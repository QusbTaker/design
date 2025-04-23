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

export default {
  data() {
    return {
      mapId: `map-${Math.random()}`,
      map: null,
      center: null,
    };
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
        _this.map.centerAndZoom(e.center, 10);
      });
      this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
      this.map.addEventListener('tilesloaded', function () {
        if (!_this.center) {
          var geolocation = new BMapGL.Geolocation();
          geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
              _this.center = r.point;
              _this.map.centerAndZoom(r.point, 18);
              // 初始化完成后更新地图数据
              _this.updateMapData();
            } else {
              console.log('获取精准定位失败');
            }
          });
        }
      });

    },
  }
};
</script>

<style lang="scss" scoped >
.map-container {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>