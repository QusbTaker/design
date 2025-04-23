<!--
 * @Author: 刘小满
 * @Date: 2025-01-15 15:42:13
 * @Descripttion: 
-->
<template>
  <div class="home app-main">
    <bai-du-map ref="map" :mapData="mapData"></bai-du-map>
    <!-- 右上角信息 -->
    <information-vue :infoData="infoData"></information-vue>
    <!-- 左上角信息 -->
    <filter-vue
      :filterData="filterData"
      @onSearch="handleSearch"
      @selectItem="handleSelectItem"
    ></filter-vue>
  </div>
</template>

<script>
import BaiDuMap from './component/BaiDuMap.vue';
import InformationVue from './component/InformationVue.vue';
import FilterVue from './component/FilterVue.vue';
import { getFlightStatisticsGroupByTime, getUavFunctionTypeNumber } from '@/api/home';
import { listTask } from '@/api/task';
// 模拟接口调用
const mockApi = {
  // 获取地图数据
  getMapData(params = {}) {
    return new Promise(async (resolve) => {
      let taskData = await listTask(Object.assign({}, params, { pageSize: 1000 }));
      let markers = [];
      taskData.rows.forEach((el) => {
        markers.push({
          lat: el.targetLatitudeBd09,
          lng: el.targetLongitudeBd09,
          type: el.taskStatus, // 0-进行中，1-结束
          title: el.name,
          ...el,
        });
      });
      resolve({
        // 青岛市中心
        zoom: 18,
        markers,
      });
    });
  },
  // 获取信息面板数据
  async getInfoData(params = {}) {
    return new Promise(async (resolve) => {
      let droneStats = [];
      let count = 0;
      let flyCoutData = await getFlightStatisticsGroupByTime();
      flyCoutData.data.forEach((el) => {
        count += el.flightNumber;
      });
      droneStats.push({ name: '无人机救援次数', value: count });
      let uavFunctionTypeNumber = await getUavFunctionTypeNumber(Object.assign({}, params, { pageSize: 1000 }));
      uavFunctionTypeNumber.data.forEach((el) => {
        droneStats.push({ name: el.uavOfficialName, value: el.number });
      });
      resolve({
        droneStats: droneStats,
      });
    });
  },
};

export default {
  components: {
    BaiDuMap,
    InformationVue,
    FilterVue,
  },
  data() {
    return {
      mapData: null,
      infoData: null,
      filterData: null,
      selectItemInfo: {}
    };
  },
  created() {
    this.initData();
  },
  methods: {
    // 初始化数据
    async initData() {
      try {
        // 并行获取所有数据
        const [mapData, infoData] = await Promise.all([
          mockApi.getMapData(),
          mockApi.getInfoData(),
        ]);

        this.mapData = mapData;
        this.infoData = infoData;
      } catch (error) {
        console.error('初始化数据失败:', error);
        this.$message.error('数据加载失败，请刷新页面重试');
      }
    },
    // 搜索处理
    async handleSearch(params) {
      try {
        this.infoData = await mockApi.getInfoData(params);
        this.mapData = await mockApi.getMapData(params);
      } catch (error) {
        console.error('搜索失败:', error);
        this.$message.error('搜索失败，请重试');
      }
    },
    // 选择救援任务
    handleSelectItem(item) {
      this.selectItemInfo = item;
      this.$refs['map'].moveMap(item);
    },
  },
};
</script>

<style lang="scss" scoped >
.home {
  width: 100%;
  height: 100%;
}
</style>