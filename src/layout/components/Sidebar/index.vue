<template>
  <div :style="{ backgroundColor: settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }">
    <div class="sidebar-menu-list">
      <div
        :class="['sidebar-menu-item', activeMenu === i.path ? 'active' : '']"
        v-for="(i, idx) of menuList"
        @click="handleClickMenu(i)"
        v-hasPermi="i.auth"
      >
        <i :class="['iconfont', i.icon]"></i>
        <p>{{ i.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Logo from './Logo';
import SidebarItem from './SidebarItem';
import variables from '@/assets/styles/variables.scss';

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapState(['settings']),
    ...mapGetters(['sidebarRouters', 'sidebar']),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  data() {
    return {
      menuList: [
        {
          name: '救援',
          path: '/rescue',
          icon: 'icon-a-ziyuan88',
          auth: ['uav:workspace:list'],
        },
        {
          name: '任务',
          path: '/task',
          icon: 'icon-a-ziyuan90',
          auth: ['uav:task:list'],
        },
        {
          name: '航线',
          path: '/wayLine',
          icon: 'icon-a-ziyuan91',
          auth: ['uav:task:list'],
        },
        {
          name: '信息',
          path: '/information',
          icon: 'icon-a-ziyuan93',
          auth: ['uav:execute:list'],
        },
        {
          name: '历史',
          path: '/history',
          icon: 'icon-a-ziyuan92',
          auth: ['uav:flightHistory:list'],
        },
        {
          name: '飞行器',
          path: '/aircraft',
          icon: 'icon-a-ziyuan89',
          auth: ['uav:achievement:list'],
        },
      ],
    };
  },
  methods: {
    handleClickMenu(item) {
      this.$router.push(item.path);
    },
  },
};
</script>

<style lang="scss"  scoped >
.sidebar-menu-list {
  color: #fff;
  font-size: 14px;
  .sidebar-menu-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    color: #fff;
    padding: 12px 0;
    position: relative;
    .iconfont {
      font-size: 19px;
      color: #7a828e;
      margin-bottom: 10px;
    }
    p {
      padding: 0;
      margin: 0;
    }
    &:nth-of-type(1) {
      margin-top: 0;
    }
    &.active,
    &:hover {
      background-color: #353e43;
      color: #fff;
      .iconfont {
        color: #03baca;
      }
      &::before {
        position: absolute;
        width: 3px;
        left: 0;
        top: 0;
        height: 100%;
        background-color: #03baca;
        content: '';
      }
    }
  }
}
</style>
