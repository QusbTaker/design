<!--
 * @Author: 刘小满
 * @Date: 2025-01-21 10:27:08
 * @Descripttion: 
-->
<template>
  <div class="map-box">
    <!-- 视频区域 -->
    <webrtc-player
      :controls="true"
      v-if="url"
      :videoId="videoId"
      :url="url"
    ></webrtc-player>
  </div>
</template>

<script>
import WebrtcPlayer from '@/components/video/WebrtcPlayer';
export default {
  props: {
    deviceInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    WebrtcPlayer,
  },
  computed: {
  },
  watch: {
    deviceInfo: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (newVal) {
          const sn = newVal.sn;
          const taskExecuteId = newVal.taskExecuteId;
          if(sn && taskExecuteId) {
            this.url = this.$store.state.config.liveUrl.replace('livestream', `livestream-${sn}_${taskExecuteId}`);
          } else {
            this.url = '';
          }
        }
      },
    },
  },
  data() {
    return {
      videoId: 'video1',
      url: '',
    };
  },
};
</script>

<style lang="scss" scoped >
.map-box {
  position: absolute;
  top: 10px;
  left: calc(2.72rem + 20px);
  background: #282f33;
  width: calc(100% - 2.72rem - 3.54rem - 40px);
  height: 75%;
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
}
</style>