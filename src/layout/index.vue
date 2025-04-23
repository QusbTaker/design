<template>
  <div
    :class="classObj"
    class="app-wrapper"
    :style="{'--current-color': theme}"
  >
    <div
      v-if="device==='mobile'&&sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <div
      :class="{hasTagsView:needTagsView}"
      v-if="fullPath === '/perception'"
      class="main-container perception-cont"
    >
      <app-main />
    </div>
    <div
      :class="{hasTagsView:needTagsView}"
      v-else
    >
      <div :class="{'fixed-header':fixedHeader}">
        <navbar @handleFullPath="handleFullPath" />
      </div>
      <sidebar class="sidebar-container" />
      <div class="main-container">
        <app-main />
      </div>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel';
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components';
import ResizeMixin from './mixin/ResizeHandler';
import { mapState } from 'vuex';
import variables from '@/assets/styles/variables.scss';
import MqttClient from '@/utils/mqtt';
import { listUav } from '@/api/organization/device';
// import config from '../config';
export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView,
  },
  mixins: [ResizeMixin],
  data() {
    return {
      fullPath: '', // 当前页面路由
      mqtt: null,
      sn: 'haio',
      uavList: [], // 设备列表
    };
  },
  computed: {
    ...mapState({
      theme: (state) => state.settings.theme,
      sideTheme: (state) => state.settings.sideTheme,
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader,
      userInfo: (state) => state.user.userInfo,
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile',
      };
    },
    variables() {
      return variables;
    },
  },
  //在进入路由前监听路
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // vm就是即将被激活的组件实例
      vm.fullPath = to.fullPath;
    });
  },
  created() {
    this.$store.dispatch('config/getInitConfig');
    this.$bus.$on('device-control', (data) => {
      const { topic, msg } = data;
      console.log('发送消息', data);
      if (topic && msg && this.mqtt && this.mqtt.connected) {
        this.mqtt.publish(topic, JSON.stringify(msg));
      }
    });
    this.$bus.$on('topic-control', (data) => {
      if (data.type === 'add') {
        this.addTopic(data.sn);
      } else {
        this.removeTopic(data.sn);
      }
    });
  },
  mounted() {
    this.getUavList();
  },
  methods: {
    /** 查询设备列表 */
    getUavList() {
      listUav({
        responsibleBy: this.userInfo.userName,
        pageSize: 1000,
      }).then((response) => {
        this.uavList = response.rows;
        this.initMqtt();
      });
    },
    addTopic(sn) {
      this.mqtt.subscribe(`thing/firedrone/${sn}/osd`);
      // this.mqtt.subscribe(`thing/firedrone/${sn}/drc/up`);
      this.mqtt.subscribe(`thing/firedrone/${sn}/servicesReply`);
    },
    removeTopic(sn) {
      this.mqtt.unsubscribe(`thing/firedrone/${sn}/osd`);
      // this.mqtt.unsubscribe(`thing/firedrone/${sn}/drc/up`);
      this.mqtt.unsubscribe(`thing/firedrone/${sn}/servicesReply`);
    },
    initMqtt() {
      const _this = this;
      this.mqtt = new MqttClient({
        // heartbeatTopic: `thing/product/${_this.sn}/drc/down`,
        // heartbeatContent: JSON.stringify({
        //   method: 'drc_heart_beat',
        //   data: {},
        // }),
        connectSuccess() {
          console.log('链接成功');
          // _this.mqtt.heartbeat();
          _this.uavList.forEach((el) => {
            if (el.idleState > 0) {
              _this.mqtt.subscribe(`thing/firedrone/${el.sn}/osd`);
              // _this.mqtt.subscribe(`thing/firedrone/${el.sn}/drc/up`);
              _this.mqtt.subscribe(`thing/firedrone/${el.sn}/servicesReply`);
            }
            // _this.mqtt.subscribe(`thing/firedrone/${el.sn}/web/status`);
            _this.mqtt.subscribe(`thing/firedrone/${el.sn}/web/user/${_this.userInfo.userId}`);
          });
        },

        connectError(error) {
          console.log('链接错误', error);
        },
        connectReconnect(error) {
          console.log('链接重连', error);
        },
        connectClose(error) {
          console.log('链接关闭', error);
        },
        connectMessage(topic, message) {
          console.log('收到消息', topic, message);
          // 监听无人机状态变更
          if (topic.indexOf('web/status') > -1) {
            console.log('状态变更1', message);
          } else {
            _this.$bus.$emit(topic, message);
          }
        },
      });
    },
    handleFullPath(fullPath) {
      this.fullPath = fullPath || '';
    },
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/mixin.scss';
@import '~@/assets/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  width: 100%;
  // width: calc(100% - #{$base-sidebar-width});
  transition: width 0.28s;
}

.sidebarHide .fixed-header {
  width: 100%;
}

.mobile .fixed-header {
  width: 100%;
}
.perception-cont {
  margin-left: 0 !important;
  padding-top: 0 !important;
  .app-main {
    min-height: 100%;
  }
}
</style>
