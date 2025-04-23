<!--
 * @Author: 刘小满
 * @Date: 2025-01-16 10:03:56
 * @Descripttion: 
-->
<template>
  <div class="app-main">
    <!-- 救援力量 -->
    <power-list
      :taskInfo="taskInfo"
      :deviceList="deviceList"
      :taskUavList="taskUavList"
    ></power-list>
    <!-- 实时数据 -->
    <real-time-data></real-time-data>
    <!-- 视频 -->
    <video-list
      :taskInfo="taskInfo"
      :deviceList="executeTaskList"
    ></video-list>
    <!-- 任务列表 -->
    <task-list
      :taskInfo="taskInfo"
      :taskList="taskList"
      @handleTask="handleTask"
      @handleEndTask="handleEndTask"
    ></task-list>
  </div>
</template>

<script>
import PowerList from './List.vue';
import RealTimeData from './RealTimeData.vue';
import VideoList from './VideoList.vue';
import TaskList from './TaskList.vue';
import { listTask, listDistribution, listExecuteTask, taskUavList } from '@/api/task';
import { gpsTobd09, calculateDistance } from '@/utils';
export default {
  components: {
    PowerList,
    RealTimeData,
    VideoList,
    TaskList,
  },
  data() {
    return {
      taskList: [],
      taskInfo: null,
      deviceList: [],
      executeTaskList: [],
      taskUavList: [], // 任务方案列表
      refreshInterval: null, // 新增：定时器变量
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    },
  },
  created() {
    this.getTaskList();
  },
  beforeDestroy() {
    // 新增：清除定时器
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
  methods: {
    // 获取方案列表
    getTaskUavList() {
      taskUavList(this.taskInfo.id).then((res) => {
        const data = res.data;
        let arr = [];
        data.uavFunctionTypeCountList.forEach((el) => {
          el.children = data.uavList.filter((item) => {
            return item.functionType === el.functionType;
          });
          arr.push(el);
        });
        this.taskUavList = arr;
      });
    },
    // 结束任务回调
    handleEndTask() {
      this.getTaskList();
    },
    // 获取执行任务列表  是否有飞行记录
    getExecuteTaskList() {
      listExecuteTask({ taskId: this.taskInfo.id, pageSize: 1000 }).then((res) => {
        this.executeTaskList = res.rows;
      });
    },
    // 获取任务列表
    getTaskList() {
      listTask({
        taskStatus: 0,
        pageSize: 1000,
      }).then((res) => {
        if (res.rows.length > 0) {
          this.taskList = res.rows;
          this.taskInfo = res.rows[0];
          this.getDistribution();
          this.getExecuteTaskList();
          this.getTaskUavList();
        } else {
          this.$emit('refresh');
        }
      });
    },
    // 切换任务
    handleTask(row) {
      this.taskInfo = row;
      // this.getDistribution();
      // this.getExecuteTaskList();
      this.deviceList = [];
      this.executeTaskList = [];
      // 新增：设置定时器，每隔30秒刷新一次数据
      clearImmediate(this.refreshInterval);
      this.refreshInterval = setInterval(() => {
        this.getDistribution();
        this.getExecuteTaskList();
        this.getTaskUavList();
      }, 3000);
    },
    // 获取该任务待飞行消息下发记录
    getDistribution() {
      const _this = this;
      listDistribution({ taskId: this.taskInfo.id, pageSize: 1000 }).then((res) => {
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
                distance: (distance / 1000).toFixed(2),
                time: (distance / 15 / 60).toFixed(0),
              });
            });
          });
        });
        Promise.all(arr).then((data) => {
          _this.loading = false;
          _this.deviceList = data;
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped >
.app-main {
  padding: 15px;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>