<!--
 * @Author: 刘小满
 * @Date: 2025-01-15 15:42:13
 * @Descripttion: 
-->
<template>
  <div class="app-main">
    <bai-du-map
      v-if="mapData.wayLine && mapData.center"
      ref="map"
      :mapData="mapData"
    ></bai-du-map>
    <task-detail
      v-if="lineInfo"
      ref="taskDetail"
      :lineInfo="lineInfo"
    ></task-detail>
  </div>
</template>

<script>
import BaiDuMap from './component/BaiDuMap.vue';
import { getWayLine } from '@/api/wayline';
import TaskDetail from './component/TaskDetail.vue';
export default {
  components: {
    BaiDuMap,
    TaskDetail,
  },
  data() {
    return {
      wayLineId: null,
      mapData: {
        center: null,
        zoom: 20,
        markers: [],
        wayLine: null, // 航线数据
      },
      lineInfo: null,
    };
  },
  created() {
    // 从路由参数获取航线ID
    this.wayLineId = this.$route.query.wayLineId;
    this.initData();
  },
  methods: {
    // 初始化数据
    async initData() {
      try {
        const response = await getWayLine(this.wayLineId);
        console.log('response', response);
        if (response.data) {
          const wayLineData = response.data;
          this.lineInfo = wayLineData;
          // 转换航线坐标点为百度坐标
          const pointArr = wayLineData.manageWaylineWaypointList.map((point) => ({
            lng: point.gcj02Longitude,
            lat: point.gcj02Latitude,
          }));

          // 设置航线数据
          this.mapData.wayLine = {
            points: pointArr,
          };

          // 设置地图中心点为航线中心点
          const centerIndex = Math.floor(pointArr.length / 2);
          this.mapData.center = pointArr[centerIndex];
        }
      } catch (error) {
        console.error('获取航线详情失败:', error);
        this.$message.error('数据加载失败，请刷新页面重试');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.app-main {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>