<!--
 * @Author: 刘小满
 * @Date: 2025-01-15 15:42:13
 * @Descripttion: 
-->
<template>
  <div class="app-main">
    <task-list
      :taskList="taskList"
      @handleTask="handleTask"
      :taskInfo="taskInfo"
    ></task-list>
    <bai-du-map
      ref="map"
      :mapData="mapData"
    ></bai-du-map>
    <!-- 救援情况 -->
    <rescue-situation></rescue-situation>
    <!-- 救援实施 -->
    <rescue-implementation
      :distributionList="distributionList"
      :taskInfo="taskInfo"
    ></rescue-implementation>
  </div>
</template>

<script>
import BaiDuMap from './BaiDuMap.vue';
import RescueSituation from './RescueSituation.vue';
import RescueImplementation from './RescueImplementation.vue';
import { listTask, listDistribution } from '@/api/task';
import { gpsTobd09 } from '@/utils';
import TaskList from './TaskList.vue';

// 模拟接口调用
const mockApi = {
  // 获取任务列表
  async getTaskList(params) {
    try {
      console.log('this.taskId', this.taskId);
      const response = await listTask(params);
      return response.rows;
    } catch (error) {
      console.error('获取任务列表失败:', error);
      return [];
    }
  },
  // 获取待飞行消息下发记录列表
  async getDistributionList(params) {
    try {
      const response = await listDistribution(params);
      return response.rows;
    } catch (error) {
      console.error('获取待飞行消息下发记录列表失败:', error);
      return [];
    }
  },
};

export default {
  components: {
    BaiDuMap,
    RescueSituation,
    RescueImplementation,
    TaskList,
  },
  data() {
    return {
      taskId: '',
      mapData: {
        zoom: 12,
        markers: [],
        firePoint: null, // 起火点
      },
      distributionList: [],
      taskInfo: {},
      taskList: [],
    };
  },
  created() {
    this.taskId = this.$route.query.taskId;
    this.initData();
  },
  methods: {
    async handleTask(task) {
      this.taskInfo = task;
      // 获取第一个任务作为起火点
      const fireTask = task;

      // 转换起火点坐标为百度坐标
      const firePoint = { lng: fireTask.targetLongitudeBd09, lat: fireTask.targetLatitudeBd09 };
      const distributionList = await mockApi.getDistributionList({ taskId: this.taskInfo.id });

      // 设置起火点
      this.mapData.firePoint = {
        ...firePoint,
        title: fireTask.landmark,
        address: fireTask.completeAddress,
        createTime: fireTask.createTime,
      };
      // 处理所有任务点
      const pointArr = distributionList.map((task) => ({
        lng: task.longitude,
        lat: task.latitude,
      }));

      // 转换所有点的坐标为百度坐标
      const bdPoints = await gpsTobd09(pointArr);
      this.distributionList = distributionList.map((el, index) => {
        return {
          point: bdPoints[index],
          ...el,
        };
      });
      // 设置标记点
      this.mapData.markers = bdPoints.map((point, index) => {
        return {
          ...point,
          title: fireTask.name,
          taskStatus: fireTask.taskStatus,
          fireTypeName: fireTask.fireTypeName,
          fireLevelName: fireTask.fireLevelName,
          createTime: fireTask.createTime,
          completeAddress: fireTask.completeAddress,
          id: fireTask.id,
        };
      });

      // 设置地图中心点为起火点
      this.mapData.center = firePoint;
      this.distributionList = distributionList;
    },
    // 初始化数据
    async initData() {
      try {
        const taskList = await mockApi.getTaskList({ pageSize: 1000, taskStatus: 0 });
        this.taskList = taskList;
        let index = taskList.findIndex((el) => el.id == this.taskId);
        console.log('taskList', taskList, index, this.taskId);
        if (index < 0) {
          index = 0;
        }
        this.handleTask(taskList[index]);
      } catch (error) {
        console.error('初始化数据失败:', error);
        this.$message.error('数据加载失败，请刷新页面重试');
      }
    },
  },
};
</script>

<style>
.app-main {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>