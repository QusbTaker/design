<!--
 * @Author: 刘小满
 * @Date: 2025-01-21 13:12:48
 * @Descripttion: 
-->
<template>
  <div class="video-list">
    <template v-for="i in 6">
      <div
        class="video-item"
        v-if="deviceList[i - 1]"
        :key="i"
      >
        <div class="header">{{ deviceList[i - 1].uavName }}</div>
        <div class="content flex_center_center">
          <!-- 视频区域 -->
          <webrtc-player
            :controls="true"
            :videoId="'video' + i"
            :url="getLiveUrl(deviceList[i - 1])"
          ></webrtc-player>
        </div>
      </div>
      <div
        class="video-item"
        v-else
        :key="'empty-' + i"
      >
        <div class="content ">
          <div class="flex_center_center empty">
            <div class="empty-text">暂无设备飞行</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import WebrtcPlayer from '@/components/video/WebrtcPlayer';
import { listDistribution } from '@/api/task';
export default {
  props: {
    taskInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    deviceList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    WebrtcPlayer,
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    },
  },
  // data() {
  //   return {
  //     deviceList: [],
  //   };
  // },

  methods: {
    getLiveUrl(device) {
      return this.$store.state.config.liveUrl.replace('livestream', `livestream-${device.sn}_${device.id}`);
    },
  },
};
</script>

<style lang="scss" scoped >
.video-list {
  position: absolute;
  left: 292px;
  top: 10px;
  width: calc(100% - 302px);
  height: calc(100% - 20px);
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  .video-item {
    background: #282F33;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    .header {
      font-size: 14px;
      position: absolute;
      width: 100%;
      left: 0;
      top: 0;
      background: rgba($color: #282f33, $alpha: 0.6);
      color: #fff;
      padding: 0px 10px;
      line-height: 35px;
      z-index: 100;
    }
    .empty {
      height: 100%;
      .empty-text {
        color: #fff;
      }
    }
    .content {
      position: absolute;
      width: 100%;
      height: 100%;
      color: rgba($color: #282f33, $alpha: 0.5);
      font-weight: bold;
      font-size: 20px;
      video {
        object-fit: cover;
      }
    }
    &:nth-of-type(1) {
      grid-column-start: 1;
      grid-column-end: 3;
      grid-row-start: 1;
      grid-row-end: 3;
    }
    &:nth-of-type(2) {
      grid-column-start: 3;
      grid-column-end: 4;
    }
    &:nth-of-type(4) {
      grid-column-start: 1;
      grid-column-end: 2;
    }
    // &:nth-of-type(5) {
    //   grid-column-start: 2;
    //   grid-column-end: 2;
    // }
  }
}
</style>