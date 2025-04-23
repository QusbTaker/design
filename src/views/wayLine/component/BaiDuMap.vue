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
import { html2Text, createCustomIcon } from '@/utils';

export default {
  props: {
    mapData: {
      type: Object,
      default: () => ({
        zoom: 12,
        markers: [],
        wayLine: null,
      }),
    },
  },
  data() {
    return {
      mapId: `map-${Math.random()}`,
      map: null,
      markerList: [], // 存储标记点实例
      polyline: null, // 存储航线实例
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
      this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放

      // 如果有传入中心点，则使用传入的中心点
      console.log('this.初始化', JSON.stringify(this.mapData));
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

    },

    // 更新地图数据
    updateMapData() {
      console.log('this.mapData', this.mapData);
      if (!this.map || !this.mapData) return;

      // 清除现有标记点和航线
      this.clearOverlays();

      // 绘制航线
      if (this.mapData.wayLine && this.mapData.wayLine.points) {
        const points = this.mapData.wayLine.points.map(
          (point) => new BMapGL.Point(point.lng, point.lat)
        );

        this.polyline = new BMapGL.Polyline(points, {
          strokeColor: '#2D9EA8',
          strokeWeight: 2,
          strokeOpacity: 1,
        });

        this.map.addOverlay(this.polyline);
      }

      // 添加标记点
      this.mapData.wayLine.points.forEach((markerData, idx) => {
        function createDOM(properties) {
          let htmlStr = `
        <div style="width: 30px;height: 30px;
        background: #03BACA; 
        color: white; 
        border-radius: 50%;
        border: 2px solid #FFFFFF;
        text-align: center;
        line-height: 26px;
        ">
            <span>${properties.index + 1}</span>
          </div>
        `;
          const dom = new DOMParser().parseFromString(htmlStr, 'text/html').body.firstChild;
          return dom;
        }
        const customOverlay = new BMapGL.CustomOverlay(createDOM, {
          point: markerData,
          opacity: 1,
          offsetX: 0,
          offsetY: -22,
          properties: {
            index: idx,
          },
        });
        this.map.addOverlay(customOverlay);
        this.markerList.push(customOverlay);
      });
    },

    // 清除所有覆盖物
    clearOverlays() {
      // 清除标记点
      this.markerList.forEach((marker) => {
        this.map.removeOverlay(marker);
      });
      this.markerList = [];

      // 清除航线
      if (this.polyline) {
        this.map.removeOverlay(this.polyline);
        this.polyline = null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style> 