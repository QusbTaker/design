<!--
 * @Author: 刘小满
 * @Date: 2025-01-15 15:53:42
 * @Descripttion: 
-->
<template>
  <div
    class="map-container"
    :id="mapId"
  ></div>
</template>

<script>
// 导入图标
const taskInProgressIcon = require('@/assets/images/task-inprogress.png');
const taskCompletedIcon = require('@/assets/images/task-completed.png');

export default {
  props: {
    mapData: {
      type: Object,
      default: () => ({
        zoom: 18,
        markers: [],
      }),
    },
  },
  data() {
    return {
      mapId: `map-${Math.random()}`,
      map: null,
      center: null,
      // 定义图标
      markerIcons: {
        inProgress: null,
        completed: null,
      },
    };
  },
  watch: {
    mapData: {
      handler(newVal) {
        if (newVal && this.map) {
          this.updateMapData();
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const _this = this;
      this.map = new BMapGL.Map(this.mapId);
      const localcity = new BMapGL.LocalCity();
      localcity.get((e) => {
        _this.map.centerAndZoom(e.center, 12);
      });
      this.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      // 初始化图标
      this.initMarkerIcons();
    },
    // 初始化图标
    initMarkerIcons() {
      this.markerIcons.inProgress = new BMapGL.Icon(taskInProgressIcon, new BMapGL.Size(32, 32), {
        imageSize: new BMapGL.Size(25, 30),
        anchor: new BMapGL.Size(16, 32),
      });
      this.markerIcons.completed = new BMapGL.Icon(taskCompletedIcon, new BMapGL.Size(32, 32), {
        imageSize: new BMapGL.Size(25, 30),
        anchor: new BMapGL.Size(16, 32),
      });
    },

    // 更新地图数据
    updateMapData() {
      if (!this.map || !this.mapData) return;

      // 清除现有标记点
      this.map.clearOverlays();

      // 添加新的标记点
      this.mapData.markers.forEach((markerData) => {
        const point = new BMapGL.Point(markerData.lng, markerData.lat);
        const icon =
          markerData.taskStatus === '0' ? this.markerIcons.inProgress : this.markerIcons.completed;
        const marker = new BMapGL.Marker(point, { icon });
        const taskExecuteList = markerData.taskExecuteList || [];
        const deviceText1 = `侦查无人机${taskExecuteList.filter((item) => item.functionType === '1').length}架`;
        if (markerData.title) {
          // 创建信息窗口内容
          const content = `
            <div class="map-info-window">
              <div class="info-header">
                <div class="title">${markerData.landmark}</div>
                <div class="address">${markerData.address || '暂无地址'}</div>
              </div>
              <div class="info-body">
                  <div class="info-item">
                  <span class="label">救援名称：</span>
                  <span class="value">${markerData.name || '未知'}</span>
                </div>
                <div class="info-item">
                  <span class="label">起火具体地址：</span>
                  <span class="value">${markerData.completeAddress || '未知'}</span>
                </div>
                <div class="info-item">
                  <span class="label">开始救援时间：</span>
                  <span class="value">${markerData.createTime || '未知'}</span>
                </div>
                 ${
                   markerData.taskStatus === '1'
                     ? `<div class="info-item">
                    <span class="label">救援结束时间：</span>
                    <span class="value">${markerData.endTime || '未知'}</span>
                  </div>`
                     : ''
                 }
                <div class="info-item">
                  <span class="label">出动救援力量：</span>
                <span class="value">${ deviceText1 || '未知'}</span>
                </div>
                <div class="info-item">
                  <span class="label">参与救援单位：</span>
                <span class="value">${markerData.deptName || '未知'}</span>
                </div>
              </div>
              <div class="info-footer">
                <button class="detail-btn" onclick="window.viewTaskDetail(${
                  markerData.taskStatus + ',' + markerData.id
                })">查看详情</button>
              </div>
            </div>
          `;

          // 定义信息窗口样式
          const styles = `
            <style>
              .map-info-window {
                background: #2C353E;
                color: #fff;
                border-radius: 4px;
                padding: 0;
                width: 100%;
              }
              .info-header {
                padding: 5px 10px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
              }
              .info-header .title {
                font-size: 16px;
                margin-bottom: 4px;
              }
              .info-header .address {
                font-size: 12px;
                color: #BECBD8;
              }
              .info-body {
                padding: 5px 10px;
              }
              .info-body .info-item {
                margin-bottom: 2px;
                font-size: 13px;
                display: flex;
                justify-content: space-between;
              }
              .info-body .info-item .label {
                color: #909399;
              }
              .info-body .info-item .value {
                color: #BECBD8;
                margin-left: 5px;
                text-align: right;
              }
              .info-footer {
                padding: 10px 15px;
                text-align: left;
                border-top: 1px solid rgba(255,255,255,0.1);
              }
              .detail-btn {
                background: #00ABBA;
                color: #fff;
                border: none;
                padding: 5px 15px;
                border-radius: 3px;
                cursor: pointer;
              }
              .detail-btn:hover {
                background: #008C98;
              }
              .BMap_bubble_top {
                background: #2C353E;
                color: #fff;
              }
              .BMap_bubble_pop {
                padding: 0 !important;
              }
              .BMap_bubble_center {
                width: 100% !important;
                background: #2C353E;
              }
              .BMap_bubble_pop img {
                filter: sepia(100%) grayscale(100%) invert(100%) hue-rotate(180deg) brightness(1.2) contrast(0.8);
              }
            </style>
          `;

          // 创建信息窗口
          const infoWindow = new BMapGL.InfoWindow(styles + content, {
            width: 312,
            minHeight: 260,
            title: null,
            enableAutoPan: true,
            enableCloseOnClick: false,
          });

          marker.addEventListener('click', () => {
            this.map.openInfoWindow(infoWindow, point);
          });
          // 添加全局方法用于处理详情按钮点击
          window.viewTaskDetail = (taskStatus, taskId) => {
            console.log(taskStatus, taskId);
            if (taskStatus === '1') {
              this.$router.push(`/task/detail?taskId=${taskId}`);
            } else {
              this.$router.push(`/trend?taskId=${taskId}`);
            }
          };
        }

        this.map.addOverlay(marker);
      });
    },
    moveMap(item) {
      this.mapData.markers.forEach((markerData) => {
        if (markerData.id === item.id) {
          this.map.centerAndZoom(new BMapGL.Point(markerData.lng, markerData.lat), 20);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped >
.map-container {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>