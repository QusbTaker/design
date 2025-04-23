<!--
 * @Author: 刘小满
 * @Date: 2025-01-15 15:53:42
 * @Descripttion: 
-->
<template>
  <div class="map-wrapper">
    <div
      class="map-container"
      :id="mapId"
    ></div>
    <div class="filter flex_start_center">
      <el-input
        v-model="searchValue"
        @input="querySearch"
        placeholder="请输入"
      ></el-input>
      <div class="popover">
        <!-- 地址列表 -->
        <search-result
          v-if="step === 0"
          :data="resultArr"
          @select="selectAddess"
        ></search-result>
        <generation-scheme
          v-if="step === 1"
          @back="back"
          @taskDelivery="taskDelivery"
          :addressInfo="addressInfo"
        ></generation-scheme>
        <task-delivery
          v-if="step === 2"
          @back="back"
          :uavList="uavList"
          :taskInfo="taskInfo"
          @success="distributionSuccess"
        ></task-delivery>
      </div>
    </div>
    <!-- 添加系统信息组件 -->
    <system-info :uavList="uavList" :taskList="taskList" ></system-info>
  </div>
</template>

<script>
import SearchResult from './SearchResult.vue';
import GenerationScheme from './GenerationScheme.vue';
import TaskDelivery from './TaskDelivery.vue';
import SystemInfo from './SystemInfo.vue';
import { listUav } from '@/api/organization/device';
import { listTask } from '@/api/task';
const imgDan = require('@/assets/images/dan.png');
const imgHuo = require('@/assets/images/huo.png');
const imgXiao = require('@/assets/images/xiao.png');
const imgZhen = require('@/assets/images/zhen.png');
const imgWu = require('@/assets/images/wu.png');
import { gpsTobd09, bd09ToGps } from '@/utils';
export default {
  data() {
    return {
      mapId: `map-${Math.random()}`,
      map: null,
      center: null,
      searchValue: '',
      resultArr: [],
      isSearch: false,
      step: 0,
      addressInfo: {},
      uavList: [], // 无人机列表
      markers: [], // 无人机设置mark实例
      linerMakr: [], // 画线 无人机距离着火点线
      fireMarker: null,
      fireList: [],
      // taskInfo: {
      //   planDetails: [],
      //   task: {},
      // }, // 生成的任务信息
      taskInfo: {
        task: {},
        planDetails: [],
      },
      taskList: [],
    };
  },
  components: {
    SearchResult,
    GenerationScheme,
    TaskDelivery,
    SystemInfo,
  },
  mounted() {
    this.init();
  },
  methods: {
    // 获取任务列表
    getTaskList() {
      listTask({ pageSize: 1000, taskStatus: 0 }).then((response) => {
        this.taskList = response.rows;
        this.setTaskMarkers();
      });
    },
    getListUav() {
      listUav({ pageSize: 1000 }).then((response) => {
        this.uavList = response.rows.filter((el) => el.longitude);
        this.setUavMarkers();
      });
    },
    // 设置无人机位置
    async setUavMarkers() {
      const _this = this;
      this.markers.forEach((el) => {
        this.map.removeOverlay(el);
      });
      this.markers = [];
      let pointArr = this.uavList.map((el) => {
        return {
          lng: el.longitude,
          lat: el.latitude,
        };
      });
      pointArr = await gpsTobd09(pointArr);
      this.uavList = this.uavList.map((el, idx) => {
        const point = pointArr[idx];
        el.longitudeBd09 = point.lng;
        el.latitudeBd09 = point.lat;

        // 创建自定义覆盖物DOM
        function createDOM(properties) {
          let htmlStr = `<div style="text-align: center;position: relative;" >
            <img src="${
              [imgZhen, imgXiao, imgDan, imgWu][el.functionType - 1]
            }" draggable="false" style="height: 31px;width: 29px;cursor: pointer;">
            <div style="position: absolute;
    top: 35px;
    left: 50%;
    transform: translateX(-50%); text-align: left;display:${
      properties.show ? 'block' : 'none'
    };background: #FFFFFF;box-shadow: 0px 3px 11px 2px rgba(0,0,0,0.1);color:#9097A4;padding: 8px 8px;white-space: nowrap;" >
              <div>${properties.uavName}</div>
              <div>型号：${properties.uavModel}</div>
              <div>
                <span>距离：${properties.distance}km</span>
                <span style="margin-left: 5px" >预计到达：${properties.time}分钟</span>
                </div>
             </div>
          </div>`;
          const dom = new DOMParser().parseFromString(htmlStr, 'text/html').body.firstChild;
          return dom;
        }
        const distance = this.fireMarker ? this.map.getDistance(point, this.fireMarker.point) : 0;
        // 创建自定义覆盖物
        const customOverlay = new BMapGL.CustomOverlay(createDOM, {
          point: point,
          opacity: 1,
          offsetX: 0,
          offsetY: -20,
          properties: {
            uavName: el.uavName,
            uavModel: el.uavModel,
            uavType: el.uavType,
            distance: (distance / 1000).toFixed(2),
            time: (distance / 15 / 60).toFixed(2),
            show: false,
            idx,
          },
        });
        let marker = customOverlay;
        this.map.addOverlay(marker); // 将标注添加到地图中
        marker.addEventListener('click', function (e) {
          const idx = e.target.properties.idx;
          const show = e.target.properties.show;
          _this.markers[idx].setProperties({
            ...e.target.properties,
            show: !show,
          });
        });
        this.markers.push(marker);
        el.distance = distance;
        el.time = (distance / 15 / 60).toFixed(2);
        return el;
      });
      if (this.fireMarker) {
        this.setLinerMakr();
      }
    },
    // 设置着火列表
    async setTaskMarkers() {
      const _this = this;
      this.fireList.forEach((el) => {
        this.map.removeOverlay(el);
      });
      this.fireList = [];
      this.taskList.map((el, idx) => {
        // 创建自定义覆盖物DOM
        function createDOM(properties) {
          let htmlStr = `<div style="text-align: center;position: relative;">
            <img src="${imgHuo}" draggable="false" style="height: 35px;width: 30px;cursor: pointer;">
            <div style="background-color: #FF3C3C;color:#fff;padding: 4px;white-space: nowrap;position: absolute;
    left: 50%;
    top: 39px;
    transform: translateX(-50%);" >起火点：${properties.title}</div>
          </div>`;
          const dom = new DOMParser().parseFromString(htmlStr, 'text/html').body.firstChild;
          return dom;
        }
        // 创建自定义覆盖物
        const customOverlay = new BMapGL.CustomOverlay(createDOM, {
          point: {
            lat: el.targetLatitudeBd09,
            lng: el.targetLongitudeBd09,
          },
          opacity: 1,
          offsetX: 0,
          offsetY: -15,
          properties: {
            title: el.landmark,
          },
        });
        let marker = customOverlay;
        this.map.addOverlay(marker); // 将标注添加到地图中
        this.fireList.push(marker);
        return el;
      });
    },
    // 设置着火点
    setFireMark() {
      this.map.removeOverlay(this.fireMarker);
      // 创建自定义覆盖物DOM
      function createDOM(properties) {
        let htmlStr = `<div style="text-align: center;position: relative;">
            <img src="${imgHuo}" draggable="false" style="height: 45px;width: 40px;cursor: pointer;">
            <div style="background-color: #FF3C3C;color:#fff;padding: 8px 8px;white-space: nowrap;position: absolute;
    left: 50%;
    top: 50px;
    transform: translateX(-50%);" >起火点：${properties.title}</div>
          </div>`;
        const dom = new DOMParser().parseFromString(htmlStr, 'text/html').body.firstChild;
        return dom;
      }

      // 创建自定义覆盖物
      const customOverlay = new BMapGL.CustomOverlay(createDOM, {
        point: this.addressInfo.point,
        opacity: 1,
        offsetX: 0,
        offsetY: -22,
        properties: {
          title: this.addressInfo.title,
        },
      });
      let marker = customOverlay;
      this.fireMarker = marker;
      this.map.addOverlay(marker); // 将标注添加到地图中
      this.map.panTo(this.addressInfo.point);
      this.setUavMarkers();
    },
    setLinerMakr() {
      this.linerMakr.forEach((el) => {
        this.map.removeOverlay(el);
      });
      this.linerMakr = [];
      this.markers.forEach((el) => {
        const liner = [el.point, this.fireMarker.point];
        console.log('liner', liner);
        let polyline = new BMapGL.Polyline(liner, {
          strokeColor: '#00ABBA',
          strokeWeight: 2,
          strokeOpacity: 1,
          geodesic: true,
        });
        this.map.addOverlay(polyline);
        this.linerMakr.push(polyline);
      });
    },
    init() {
      const _this = this;
      this.map = new BMapGL.Map(this.mapId);
      const localcity = new BMapGL.LocalCity();
      localcity.get((e) => {
        _this.map.centerAndZoom(e.center, 18);
      });
      this.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      this.map.addEventListener('tilesloaded', function () {
        if (!_this.center) {
          _this.getListUav();
          _this.getTaskList();
          var geolocation = new BMapGL.Geolocation();
          geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
              _this.center = r.point;
              _this.map.centerAndZoom(r.point, 18);
            } else {
              console.log('获取精准定位失败');
            }
          });
        }
      });
    },
    querySearch(queryString) {
      const _this = this;
      if (queryString.trim()) {
        _this.isSearch = true;
        const local = new BMapGL.LocalSearch(this.map, {
          //智能搜索
          onSearchComplete: function (data) {
            console.log('搜索结果', data._pois);
            _this.isSearch && (_this.resultArr = data._pois);
            _this.isSearch = false;
          },
        });
        local.search(queryString);
      } else {
        _this.isSearch = false;
        _this.resultArr = [];
      }
    },
    // 选择地址
    async selectAddess(row) {
      const _this = this;
      console.log('选中地址', row);
      const gpsPoint = await bd09ToGps(row.point.lng, row.point.lat);
      let geoc = new BMapGL.Geocoder();
      geoc.getLocation(new BMapGL.Point(row.point.lng, row.point.lat), function (rs) {
        var addComp = rs.content.address_detail;
        _this.addressInfo = {
          targetLatitude: gpsPoint.lat,
          targetLongitude: gpsPoint.lng,
          ...row,
          ...addComp,
        };
        _this.step = 1;
        _this.setFireMark();
        // _this.resultArr = [];
      });
    },
    // 任务生成成功  进入下发页面
    taskDelivery(data) {
      this.taskInfo = data;
      this.step = 2;
    },
    distributionSuccess() {
      this.step = 0;
      this.resultArr = [];
      this.map.removeOverlay(this.fireMarker);
      this.linerMakr.forEach((el) => {
        this.map.removeOverlay(el);
      });
      this.linerMakr = [];
      this.fireMarker = null;
      this.setUavMarkers();
    },
    back() {
      this.step--;
    },
  },
};
</script>

<style lang="scss" scoped>
.map-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
}

.map-container {
  width: 100%;
  height: 100%;
  position: absolute;
  right: 340px; // 为右侧系统信息面板留出空间
  left: 0;
}

.filter {
  position: absolute;
  z-index: 100;
  left: 10px;
  top: 10px;
  .filter-item {
    margin-right: 5px;
  }
}

.popover {
  position: absolute;
  z-index: 100;
  left: 0px;
  top: 40px;
  background: #2c353e;
  width: 340px;
}
</style>