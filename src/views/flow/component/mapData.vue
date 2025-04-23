<!--
 * @Author: 刘小满
 * @Date: 2025-01-21 10:27:08
 * @Descripttion: 
-->
<template>
  <div class="map-box">
    <div class="header">地图态势</div>
    <div
      class="map-container"
      :id="mapId"
    ></div>
  </div>
</template>

<script>
import { gpsTobd09 } from '@/utils';
export default {
  props: {
    deviceInfoSys: {
      type: Object,
      default() {
        return {};
      },
    },
    deviceInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      mapId: `map-${Math.random()}`,
      map: null,
      center: null,
      deviceMark: null,
      startMark: null,
      pointList: [],
      polyline: null,
      lastTime: '',
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async setPoint(data) {
      console.log('调用setPoint', data);
      if (this.map && !data.position.longitude || !data.position.latitude) {
        return;
      }
      if (this.lastTime) {
        const timeDiff = new Date() - this.lastTime;
        if (timeDiff < 1500) {
          return;
        }
      }
      this.lastTime = new Date();
      const point = {
        lng: data.position.longitude,
        lat: data.position.latitude,
      };
      const pointBadidu = await gpsTobd09([point]);
      this.pointList.push(pointBadidu[0]);
      this.setPolyline();
      const yaw = data?.attitude?.yaw || 0;
      this.setDeviceMark(pointBadidu[0], yaw);
    },
    init() {
      const _this = this;
      this.map = new BMapGL.Map(this.mapId);
      const localcity = new BMapGL.LocalCity();
      localcity.get((e) => {
        _this.map.centerAndZoom(e.center, 18);
      });
      this.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    },
    setDeviceMark(point, yaw = 0) {
      if (!this.deviceMark) {
        this.deviceMark = new BMapGL.Marker(point, {
          icon: new BMapGL.Icon(require('@/assets/images/aircraft1.png'), new BMapGL.Size(30, 30), {
            imageSize: new BMapGL.Size(30, 30),
            anchor: new BMapGL.Size(15, 15),
          }),
          // rotation: yaw,
        });
        this.map.addOverlay(this.deviceMark);
      } else {
        this.deviceMark.setPosition(point);
        // this.deviceMark.setRotation(yaw);
      }
      this.map.panTo(point);
    },
    setPolyline() {
      // 设置起始位置
      if (!this.startMark) {
        const point = this.pointList[0];
        this.startMark = new BMapGL.Marker(point, {
          icon: new BMapGL.Icon(
            require('@/assets/images/local-position.png'),
            new BMapGL.Size(30, 30),
            {
              imageSize: new BMapGL.Size(30, 30),
              anchor: new BMapGL.Size(15, 15),
            }
          ),
        });
        this.map.addOverlay(this.startMark);
      }
      // 设备移动轨迹
      if (!this.polyline) {
        this.polyline = new BMapGL.Polyline(this.pointList, {
          strokeColor: '#2D9EA8',
          strokeWeight: 2,
          strokeOpacity: 1,
        });
        this.map.addOverlay(this.polyline);
      } else {
        this.polyline.setPath(this.pointList);
      }
    },
  },
};
</script>

<style lang="scss" scoped >
.map-box {
  position: absolute;
  top: calc(70% + 20px);
  left: 10px;
  background: #282f33;
  width: 2.72rem;
  height: calc(30% - 30px);
  border-radius: 10px;
  padding: 0px;
  overflow: hidden;
  .header {
    position: absolute;
    top: 0;
    width: 100%;
    line-height: 25px;
    z-index: 100;
    background: rgba($color: #000000, $alpha: 0.7);
    padding: 0 10px;
  }
  .map-container {
    width: 100%;
    height: 100%;
    position: absolute;
  }
}
</style>