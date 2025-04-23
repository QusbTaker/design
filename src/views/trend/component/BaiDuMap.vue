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
const imgFire = require('@/assets/images/huo.png');
const imgDrone = require('@/assets/images/zhen.png');

export default {
  props: {
    mapData: {
      type: Object,
      default: () => ({
        zoom: 16,
        markers: [],
        firePoint: null,
      }),
    },
  },
  data() {
    return {
      mapId: `map-${Math.random()}`,
      map: null,
      markerList: [], // 存储标记点实例
      polylineList: [], // 存储连线实例
      fireMarker: null, // 存储起火点标记实例
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

      // 如果有传入中心点，则使用传入的中心点
      if (this.mapData && this.mapData.center) {
        const { center, zoom } = this.mapData;
        this.map.centerAndZoom(new BMapGL.Point(center.lng, center.lat), zoom || 10);
        this.updateMapData();
      } else {
        // 否则定位到当前城市
        const localcity = new BMapGL.LocalCity();
        localcity.get((e) => {
          _this.map.centerAndZoom(e.center, 10);
        });
      }

      this.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      // this.map.addEventListener('tilesloaded', function () {
      //   if (!_this.center) {
      //     var geolocation = new BMapGL.Geolocation();
      //     geolocation.getCurrentPosition(function (r) {
      //       if (this.getStatus() == BMAP_STATUS_SUCCESS) {
      //         _this.center = r.point;
      //         _this.map.centerAndZoom(r.point, 18);
      //         // 初始化完成后更新地图数据
      //         _this.updateMapData();
      //       } else {
      //         console.log('获取精准定位失败');
      //       }
      //     });
      //   }
      // });
    },

    // 创建标记点图标
    createMarkerIcon(isFirePoint = false) {
      const iconUrl = isFirePoint ? imgFire : imgDrone;
      return new BMapGL.Icon(iconUrl, new BMapGL.Size(25, 30), {
        imageSize: new BMapGL.Size(25, 30),
        anchor: new BMapGL.Size(16, 32),
      });
    },

    // 更新地图数据
    updateMapData() {
      if (!this.map || !this.mapData) return;

      // 清除现有标记点和连线
      this.clearOverlays();

      // 添加起火点
      if (this.mapData.firePoint) {
        const firePoint = new BMapGL.Point(this.mapData.firePoint.lng, this.mapData.firePoint.lat);
        // 创建自定义覆盖物DOM
        function createDOM(properties) {
          let htmlStr = `<div style="text-align: center;position: relative;">
            <img src="${imgFire}" draggable="false" style="height: 45px;width: 40px;cursor: pointer;">
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
          point: firePoint,
          opacity: 1,
          offsetX: 0,
          offsetY: -22,
          properties: {
            title: this.mapData.firePoint.title,
          },
        });
        this.fireMarker = customOverlay;

        // this.fireMarker.addEventListener('click', () => {
        //   this.map.openInfoWindow(fireInfoWindow, firePoint);
        // });

        this.map.addOverlay(this.fireMarker);
        this.map.centerAndZoom(firePoint, 13);
      }

      // 添加新的标记点
      this.mapData.markers.forEach((markerData) => {
        const point = new BMapGL.Point(markerData.lng, markerData.lat);
        const icon = this.createMarkerIcon(false);
        const marker = new BMapGL.Marker(point, { icon });


        // marker.addEventListener('click', () => {
        // });

        this.map.addOverlay(marker);
        this.markerList.push(marker);

        // 如果有起火点，则添加连线
        if (this.fireMarker) {
          const polyline = new BMapGL.Polyline(
            [point, new BMapGL.Point(this.mapData.firePoint.lng, this.mapData.firePoint.lat)],
            {
              strokeColor: '#00ABBA',
              strokeWeight: 2,
              strokeOpacity: 0.8,
            }
          );
          this.map.addOverlay(polyline);
          this.polylineList.push(polyline);
        }
      });
    },

    // 计算到起火点的距离
    calculateDistance(point) {
      if (!this.mapData.firePoint) return '未知';
      const firePoint = new BMapGL.Point(this.mapData.firePoint.lng, this.mapData.firePoint.lat);
      return Math.round(this.map.getDistance(point, firePoint));
    },

    // 清除所有覆盖物
    clearOverlays() {
      // 清除标记点
      this.markerList.forEach((marker) => {
        this.map.removeOverlay(marker);
      });
      this.markerList = [];

      // 清除连线
      this.polylineList.forEach((line) => {
        this.map.removeOverlay(line);
      });
      this.polylineList = [];

      // 清除起火点
      if (this.fireMarker) {
        this.map.removeOverlay(this.fireMarker);
        this.fireMarker = null;
      }
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