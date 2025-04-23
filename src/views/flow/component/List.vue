<!--
 * @Author: 刘小满
 * @Date: 2025-01-21 10:23:33
 * @Descripttion: 
-->
<template>
  <div class="power">
    <!-- tag切换 -->
    <div class="tab-list">
      <div
        :class="{ 'tab-item': true, active: tabIndex === 0 }"
        @click="tabIndex = 0"
      >
        <span>救火力量</span>
      </div>
      <div
        :class="{ 'tab-item': true, active: tabIndex === 1 }"
        @click="tabIndex = 1"
      >
        <span>救援方案</span>
      </div>
    </div>
    <!-- 力量 -->
    <div>
      <div
        class="list"
        v-if="tabIndex === 0"
      >
        <device-item
          v-for="i of deviceList"
          :key="i"
          :row="i"
          :taskInfo="taskInfo"
          @handleManualFlight="handleManualFlight"
        ></device-item>
      </div>
      <div
        class="list"
        v-if="tabIndex === 1"
      >
        <plan-item
          :taskInfo="taskInfo"
          :planList="planList"
        ></plan-item>
      </div>
    </div>
  </div>
</template>

<script>
import DeviceItem from './DeviceItem.vue';
import PlanItem from './PlanItem.vue';
import TaskItem from './TaskItem.vue';
import { listDistribution } from '@/api/task';
import { gpsTobd09, calculateDistance } from '@/utils';

export default {
  props: {
    taskInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      tabIndex: 0,
      deviceList: [], // 设备列表
      planList: [], // 方案列表
      deviceInfo: null,
      refreshInterval: null, // 新增：定时器变量
      loading: false,
    };
  },
  components: {
    DeviceItem,
    PlanItem,
    TaskItem,
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    },
  },
  watch: {
    taskInfo: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.deviceInfo = null;
          this.listDistribution();
        }
      },
    },
  },
  // mounted() {
  //   // 新增：设置定时器，每隔30秒刷新一次数据
  //   this.refreshInterval = setInterval(() => {
  //     this.listDistribution(false);
  //   }, 3000);
  // },
  beforeDestroy() {
    // 新增：清除定时器
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
  methods: {
    listDistribution(flag = true) {
      const _this = this;
      if(_this.loading) {
        return
      }
      _this.loading = true;
      listDistribution({
        taskId: this.taskInfo.id,
      }).then((res) => {
        const arr = res.rows.map((el) => {
          return new Promise(async (resolve, reject) => {
            const pointArr = await gpsTobd09([{ lng: el.longitude, lat: el.latitude }]);
            const point = pointArr[0];
            console.log('point', point);
            const distance = calculateDistance(point, {
              lng: _this.taskInfo.targetLongitudeBd09,
              lat: _this.taskInfo.targetLatitudeBd09,
            });
            let geoc = new BMapGL.Geocoder();
            geoc.getLocation(new BMapGL.Point(point.lng, point.lat), function (rs) {
              console.log('地址详细信息1', rs);
              let addComp = rs.content.address_detail;
              resolve({
                ...el,
                ...addComp,
                longitudeBd09: point.lng,
                latitudeBd09: point.lat,
                distance: (distance /1000).toFixed(2),
                time: (distance / 15 / 60).toFixed(0)
              });
            });
          });
        });
        Promise.all(arr).then((data) => {
          _this.loading = false;
          this.deviceList = data.filter((el) => el.flyerId == this.userInfo.userId);
          if(!this.deviceInfo && flag) {
            this.deviceInfo = this.deviceList[0];
            this.$emit('changeDeviceInfo', this.deviceInfo);
          }
          this.planList = data;
        });
      });
    },
    handleManualFlight(row) {
      this.$emit('handleManualFlight', row)
    }
  },
};
</script>

<style lang="scss" scoped >
.power {
  position: absolute;
  left: 10px;
  top: calc(18% - 10px);
  height: calc(52% + 20px);
  background: #28323e;
  width: 2.72rem;
  border-radius: 10px;
  padding: 10px;
  .tab-list {
    display: flex;
    justify-content: space-between;
    // border-bottom: 1px solid #363846;
    padding: 11px 0;
    .tab-item {
      width: 50%;
      color: #fff;
      font-size: 0.14rem;
      text-align: center;
      cursor: pointer;
      line-height: 0.32rem;
      border-radius: 6px 6px 2px 2px;
      border: 1px solid #3c4755;
      background: #303a47;
      &.active {
        background: #28323e;
        border-color: #03baca;
        border-bottom: none;
      }
    }
  }
}
</style>