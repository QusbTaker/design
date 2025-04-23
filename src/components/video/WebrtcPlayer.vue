<!--
 * @Author: 刘小满
 * @Date: 2024-10-24 10:31:06
 * @Descripttion: 
-->
<template>
  <video
    :id="videoId"
    class="player"
    :controls="controls"
    autoplay
    muted
    style="width:100%;height:100%;object-fit: fill;"
  >
  </video>

</template>
<script>
import Srs from '@/utils/srs.sdk';

export default {
  name: 'webrtcPlayer2',
  props: {
    videoId: {
      type: String,
      default: 'player',
    },
    url: {
      type: String,
      default: '',
    },
    controls: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      player: null,
    };
  },
  watch: {
    url(val) {
      if (this.player && val) {
        this.$nextTick(() => {
          this.player.close();
          this.play();
        });
      }
    },
  },
  created() {
    const _this = this;
    window.addEventListener('beforeunload', function (e) {
      _this.player.close();
      _this.player = null;
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.play();
    })
  },
  beforeDestroy() {
    if (this.player) {
      console.log('关闭直播');
      this.player.close();
      this.player = null;
    }
  },
  methods: {
    play() {
      var player = document.getElementById(this.videoId);
      console.log('player', player);
      //方法一：使用srs.sdk.js
      this.player = new Srs.SrsRtcWhipWhepAsync();
      // video标签
      player.srcObject = this.player.stream;
      this.player.play(this.url);
      //方法二：使用jswebrtc.min.js
      // new JSWebrtc.Player(this.url, { video: player, autoplay: true, });
    },
  },
};
</script>