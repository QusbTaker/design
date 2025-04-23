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
import { html2Text, createCustomIcon } from '@/utils';
const imgHuo = require('@/assets/images/huo.png');
export default {
  props: {
    taskInfo: {
      type: Object | null,
      default: null,
    },
  },
  data() {
    return {
      mapId: `map-${Math.random()}`,
      map: null,
      center: null,
      marksList: [],
      polyline: null, // 新增：用于存储线段
      isDragging: false,
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
      if (this.taskInfo) {
        const center = {
          lng: _this.taskInfo.targetLongitudeBd09,
          lat: _this.taskInfo.targetLatitudeBd09,
        };
        _this.center = center;
        _this.map.centerAndZoom(center, 20);
        _this.addFirePoint(center);
      } else {
        localcity.get((e) => {
          _this.map.centerAndZoom(e.center, 18);
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
      //       } else {
      //         console.log('获取精准定位失败');
      //       }
      //     });
      //   }
      // });

      this.isDragging = false; // 新增：标记是否正在拖动
      this.map.addEventListener('click', function (e) {
        console.log('点击', _this.isDragging);
        if (!_this.isDragging && e.latlng) {
          // 只有在非拖动状态下才添加标记点
          _this.addMark(e.latlng);
        }
      });
    },
    async addFirePoint(center) {
      const _this = this;
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
          lat: _this.taskInfo.targetLatitudeBd09,
          lng: _this.taskInfo.targetLongitudeBd09,
        },
        opacity: 1,
        offsetX: 0,
        offsetY: -15,
        properties: {
          title: _this.taskInfo.landmark,
        },
      });
      _this.map.addOverlay(customOverlay);
    },

    // 添加标记点
    async addMark(latlng) {
      const _this = this;
      const customHtml = `
    <div style="width: 100%;height: 100%;
    position:absolute;
    background: #03BACA; 
    color: white; 
    border-radius: 50%;
    border: 2px solid #FFFFFF;
    text-align: center;
    line-height: 26px;
    ">
      <span>${this.marksList.length + 1}</span>
    </div>
  `;
      // 将富文本转换为图片
      const customImageUrl = await createCustomIcon(customHtml);
      console.log('customImageUrl', customImageUrl);
      // 创建自定义图标
      const customIcon = new BMapGL.Icon(customImageUrl, new BMapGL.Size(30, 30));

      const marker = new BMapGL.Marker(latlng, {
        icon: customIcon,
        enableDragging: true,
      });

      // 监听标记点拖动事件
      marker.addEventListener('dragstart', () => {
        console.log('开始拖动');
        _this.isDragging = true; // 开始拖动时设置为true
      });
      marker.addEventListener('dragend', (e) => {
        this.updatePolyline();
        setTimeout(() => {
          _this.isDragging = false; // 拖动结束后设置为false
        }, 300);
      });

      // 监听删除按钮点击事件
      marker.addEventListener('click', function (event) {
        event.domEvent.stopPropagation();
      });
      marker.addEventListener('rightclick', function (event) {
        console.log('删除标记点', event);
        event.domEvent.stopPropagation();
        event.domEvent.preventDefault();
        // 在这里处理右击逻辑，例如删除标记点

        const index = _this.marksList.indexOf(marker);
        _this.marksList = _this.marksList.filter((el, idx) => {
          if (idx >= index) {
            _this.map.removeOverlay(el);
            return false;
          } else {
            return true;
          }
        });
        _this.updatePolyline();
      });

      this.map.addOverlay(marker);
      this.marksList.push(marker);
      this.updatePolyline();
    },
    // 更新线段
    updatePolyline() {
      // 删除原有线段
      if (this.polyline) {
        this.map.removeOverlay(this.polyline);
      }
      // 创建新的线段
      if (this.marksList.length > 1) {
        const points = this.marksList.map((marker) => marker.getPosition());
        this.polyline = new BMapGL.Polyline(points, {
          strokeColor: '#2D9EA8',
          strokeWeight: 2,
          strokeOpacity: 1,
        });
        this.map.addOverlay(this.polyline);
      } else {
        this.polyline = null;
      }
      // 把最新的坐标信息更新到表单
      const points = this.marksList.map((el) => {
        return {
          point: el.getPosition(),
        };
      });
      this.$bus.$emit('draw-liner-change', { points });
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