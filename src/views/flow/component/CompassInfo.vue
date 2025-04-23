<template>
  <div class="compass-page">
    <div class="compass">
      <div class="progress">
        <div class="tips1">{{ deviceInfoSys.speed }}m/s</div>
        <div
          class="progress-bar"
          :style="{
          '--progress': (deviceInfoSys.speed / 15 * 100) + '%'
        }"
        ></div>
        <div class="tips2">当前速度</div>
      </div>
      <div class="compass-box">
        <!-- 刻度盘 -->
        <div
          class="compass-container"
          @click="setRotate"
          :style="{
         '--rotate': -deviceInfoSys.attitude.yaw + 'deg'
      }"
        >
          <div
            class="direct-item"
            v-for="i of directList"
            :key="i"
          ><span>{{ i }}</span></div>
        </div>
        <!-- 位置信息 -->
        <div class="position-box">
          <i class="el-icon-caret-top"></i>
          <p>{{ deviceInfoSys.position.longitude }}</p>
          <p>{{ deviceInfoSys.position.latitude }}</p>
        </div>
      </div>
      <div class="progress progress1">
        <div class="tips1">{{ deviceInfoSys.position.relativeAltitude }}m</div>
        <div
          class="progress-bar"
          :style="{
            transform: 'rotateY(-180deg)',
            '--progress': (deviceInfoSys.position.relativeAltitude /  300 * 100) + '%'
            }"
        ></div>
        <div class="tips2">当前高度</div>
      </div>
    </div>
    <!-- 设备详细信息 -->
    <div class="desc-item-box flex_start_center flex_wrap">
      <div class="desc-item flex_bw_center ">
        <span>电池电量：</span>
        <span>{{ deviceInfoSys.battery.remainingPercent }}%</span>
      </div>
      <div class="desc-item flex_bw_center ">
        <span>北向速度：</span>
        <span>{{ deviceInfoSys.velocity.north }} m/s</span>
      </div>
      <div class="desc-item flex_bw_center ">
        <span>东向速度：</span>
        <span>{{ deviceInfoSys.velocity.east }} m/s</span>
      </div>
      <div class="desc-item flex_bw_center ">
        <span>下向速度：</span>
        <span>{{ deviceInfoSys.velocity.down }} m/s</span>
      </div>
      <div class="desc-item flex_bw_center ">
        <span>滚转角：</span>
        <span>{{ deviceInfoSys.attitude.roll }}</span>
      </div>
      <div class="desc-item flex_bw_center ">
        <span>俯仰角：</span>
        <span>{{ deviceInfoSys.attitude.pitch }}</span>
      </div>
      <div class="desc-item flex_bw_center ">
        <span>偏航角：</span>
        <span>{{ deviceInfoSys.attitude.yaw }}</span>
      </div>
      <div class="desc-item flex_bw_center ">
        <span>GPS信号：</span>
        <span><dict-tag
            :options="dict.type.gps_signal_level"
            :value="deviceInfoSys.gpsInfo.fixType"
          /></span>
      </div>
      <div class="desc-item flex_bw_center ">
        <span>GPS卫星数量：</span>
        <span>{{ deviceInfoSys.gpsInfo.numSatellites }}</span>
      </div>
      <div class="desc-item flex_bw_center ">
        <span>起点高度：</span>
        <span>{{ deviceInfoSys.position.relativeAltitude }}</span>
      </div>
      <div class="desc-item flex_bw_center ">
        <span>海拔高度：</span>
        <span>{{ deviceInfoSys.position.absoluteAltitude }}</span>
      </div>
      <div class="desc-item flex_bw_center ">
        <span>操控模式：</span>
        <span>{{ deviceInfoSys.flightModeLabel }}</span>
      </div>
      <div class="desc-item flex_bw_center ">
        <span>是否已解锁：</span>
        <span>{{ deviceInfoSys.arrmed }}</span>
      </div>
      <div class="desc-item flex_bw_center ">
        <span>陀螺仪校准：</span>
        <span>{{ deviceInfoSys.health.isGyrometerCalibrationOk }}</span>
      </div>
      <div class="desc-item flex_bw_center ">
        <span>加速度计校准：</span>
        <span>{{ deviceInfoSys.health.isAccelerometerCalibrationOk }}</span>
      </div>
      <div class="desc-item flex_bw_center ">
        <span>磁力计校准：</span>
        <span>{{ deviceInfoSys.health.isMagnetometerCalibrationOk }}</span>
      </div>
      <div class="desc-item flex_bw_center ">
        <span>全球位置估计：</span>
        <span>{{ deviceInfoSys.health.isGlobalPositionOk }}</span>
      </div>
      <div class="desc-item flex_bw_center ">
        <span>返航点设置：</span>
        <span>{{ deviceInfoSys.health.isHomePositionOk }}</span>
      </div>
      <div class="desc-item flex_bw_center ">
        <span>本地位置估计：</span>
        <span>{{ deviceInfoSys.health.isLocalPositionOk }}</span>
      </div>
      <div class="desc-item flex_bw_center ">
        <span>是否可以解锁：</span>
        <span>{{ deviceInfoSys.health.isArmable }}</span>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  dicts: ['gps_signal_level', 'wind_direction', 'wind_warning'],
  props: {
    taskInfo: {
      type: Object,
      default() {
        return {};
      },
    },
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
      directList: ['北', '30', '60', '东', '120', '150', '南', '210', '240', '西', '300', '330'],
      rotate: 0,
      cameraSourceType: 'setCameraSourceType1',
      videoSourceType: 'setVideoSourceType3',
      cameraZoomRatios: 0, // 初始焦距
      algorithmList: [], // 算法列表
      currentAlgorit: 0, // 当前算法索引
      algorithmVisible: false, // 添加算法弹窗
    };
  },
  //   deviceInfoSysSys: {
  //     deep: true,
  //     immediate: true,
  //     handler(newVal, oldVal) {
  //       console.log('详情变化',this.deviceInfoSysSys, newVal, oldVal);
  //       if (this.deviceInfoSysSys) {
  //         if (oldVal) {
  //           this.$bus.$off(`thing/firedrone/${oldVal.sn}/osd`);
  //         }
  //         if (newVal) {
  //           console.log('jianting', newVal);
  //           this.$bus.$on(`thing/firedrone/${newVal.sn}/osd`, (data) => {
  //             console.log('详情接收消息', data);
  //             this.deviceInfoSys = Object.assign(data.data, {
  //               position: {
  //                 ...data.data.position,
  //                 longitude: data.data.position.longitude.toFixed(6),
  //                 latitude: data.data.position.latitude.toFixed(7),
  //                 absoluteAltitude: data.data.position.absoluteAltitude.toFixed(2),
  //                 relativeAltitude: data.data.position.relativeAltitude.toFixed(2),
  //               },
  //               velocity: {
  //                 north: data.data.velocity.north.toFixed(2),
  //                 east: data.data.velocity.east.toFixed(2),
  //                 down: data.data.velocity.down.toFixed(2),
  //               },
  //               speed: (data.data.velocity
  //                 ? Math.max(Math.abs(data.data.velocity.north), Math.abs(data.data.velocity.east))
  //                 : 0
  //               ).toFixed(2),
  //               battery: {
  //                 ...data.data.battery,
  //                 voltage: data.data.battery.voltage.toFixed(1),
  //               },
  //             });
  //           });
  //         }
  //       }
  //     },
  //   },
  // },
  methods: {
    setRotate() {
      this.rotate = -Math.random() * 360;
    },

    handlerClick(key) {
      this.$bus.$emit('device-control', { key });
    },
    // 切换焦距
    changeCameraZoomRatios(val) {
      console.log('val', val);
      this.$bus.$emit('device-control', {
        key: 'setCameraZoomRatios',
        zoomRatios: {
          cameraZoomRatios: val,
        },
      });
    },
    handlerCloseTask() {},
  },
};
</script>

<style lang="scss" scoped >
.compass-page {
  color: #bdbebf;
  position: absolute;
  top: 10px;
  right: 10px;
  background: #28323e;
  border-radius: 10px;
  height: 75%;
  width: 3.54rem;
  padding: 15px;
  overflow-x: hidden;
  overflow-y: auto;
}
.progress {
  flex-shrink: 0;
  width: 0.48rem;
  height: 1.8rem;
  position: relative;
  font-weight: 400;
  font-size: 14px;
  color: #ffffff;
  .tips1 {
    position: absolute;
    top: -20px;
    right: 0;
    white-space: nowrap;
  }
  .tips2 {
    position: absolute;
    bottom: -20px;
    right: -20px;
    white-space: nowrap;
    color: #bdbebf;
  }
  .progress-bar {
    --progress: 0%;
    width: 100%;
    height: 100%;
    mask-size: 100% 100%;
    mask-image: url(data:image/png;base64,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);
    background-color: #37424e;
    background-image: linear-gradient(
      to top,
      #728efe 0%,
      #5174f8 var(--progress),
      transparent var(--progress),
      transparent 100%
    );
  }
}
.progress1 {
  .tips1 {
    left: 0;
  }
  .tips2 {
    left: -20px;
  }
  .progress-bar {
    --progress: 0%;
    background-image: linear-gradient(
      to top,
      #1ee1f3 0%,
      #1dbdf1 var(--progress),
      transparent var(--progress),
      transparent 100%
    );
  }
}
.compass {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.compass-box {
  flex-shrink: 0;
  width: 2.31rem;
  height: 2.31rem;
  background: #222b37;
  box-shadow: 0px 5px 21px 0px rgba(0, 0, 0, 0.34);
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  .position-box {
    position: absolute;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-size: 0.14rem;
    color: #afb4b9;
    p {
      padding: 0;
      margin: 0;
      line-height: 0.2rem;
    }
    i {
      color: #6888fd;
      font-size: 0.5rem;
    }
  }
  .compass-container {
    --rotate: 0deg;
    position: relative;
    width: 1.96rem;
    height: 1.96rem;
    border: 10px solid #374351;
    box-sizing: border-box;
    border-radius: 50%;
    transition: all 0.3s linear;
    transform: rotate(var(--rotate));
    .direct-item {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 0;
      height: 100%;
      padding-top: 10px;
      color: #afb4b9;
      font-size: 12px;
      &::before {
        content: '';
        position: absolute;
        width: 1px;
        height: 7px;
        background: #afb4b9;
        top: -4px;
        left: 50%;
        transform: translateX(-50%);
      }
      // transform-origin: 50% 50%;
    }
    // 循环旋转角度
    @for $i from 1 through 12 {
      .direct-item:nth-of-type(#{$i}) {
        transform: translateX(-50%) rotate(($i - 1) * 30deg);
      }
    }
    // 指定刻度加粗
    @for $i from 1 through 4 {
      .direct-item:nth-of-type(#{($i * 3 - 2)}) {
        span {
          display: inline-block;
          transition: all 0.3s linear;
          transform: rotate(calc(#{($i - 1)} * -90deg - var(--rotate)));
        }
        &::before {
          width: 2px;
        }
      }
    }
  }
}
.device-position {
  text-align: center;
  margin: 0.18rem 0 0.15rem 0;
  i {
    color: #157c80;
  }
}
.desc-item-box {
  margin-top: 10px;
  gap: 2px;
  .desc-item {
    color: #bdbebf;
    font-size: 0.14rem;
    background: #1c232b;
    width: calc(50% - 1px);
    line-height: 0.35rem;
    padding: 0 0.10rem;
  }
}
.device-item {
  display: flex;
  align-items: center;
  height: 0.55rem;
  background: #1c232b;
  font-weight: 400;
  font-size: 12px;
  color: #bdbebf;
  margin: 4px 0;
  i {
    font-size: 0.28rem;
    margin: 0 0.09rem;
  }
  .device-item-desc {
    line-height: 0.18rem;
  }
}
.btn-box {
  .el-button {
    margin-bottom: 0.1rem;
    margin-left: 0;
    margin-right: 0.1rem;
  }
}
.algorithm-list {
  .algorithm-item {
    position: relative;
    padding: 0 10px;
    height: 28px;
    line-height: 28px;
    background: #161b1e;
    border-radius: 3px;
    // text-overflow: ellipsis;
    // overflow: hidden;
    // white-space: nowrap;
    margin-bottom: 5px;
    .el-icon-error {
      cursor: pointer;
      color: #ff4c34;
      position: absolute;
      right: -5px;
      top: -5px;
    }
  }
}
</style>