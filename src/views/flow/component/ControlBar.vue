<template>
  <div class="control-box">
    <div class="direction-box">
      <!-- 左边方向控制 -->
      <div class="direction-box1">
        <div :class="['btn', 'up', active.KeyC ? 'active' : '']"><span>
            C<br />上升
          </span></div>
        <div :class="['btn', 'down', active.KeyZ ? 'active' : '']"><span>
            Z<br />下降
          </span></div>
        <div :class="['btn', 'left', active.KeyQ ? 'active' : '']"><span>
            Q<br />左转
          </span></div>
        <div :class="['btn', 'right', active.KeyE ? 'active' : '']"><span>
            E<br />右转
          </span></div>
      </div>
      <!-- 右侧方向控制 -->
      <div class="direction-box2">
        <div :class="['btn', 'up', active.KeyW ? 'active' : '']"><span>
            W<br />前进
          </span></div>
        <div :class="['btn', 'down', active.KeyS ? 'active' : '']"><span>
            S<br />后退
          </span></div>
        <div :class="['btn', 'left', active.KeyA ? 'active' : '']"><span>
            A<br />向左
          </span></div>
        <div :class="['btn', 'right', active.KeyD ? 'active' : '']"><span>
            D<br />向右
          </span></div>
      </div>
      <!-- 云台控制 -->
      <div class="direction-box2 direction-box3">
        <div :class="['btn', 'up', active.ArrowUp ? 'active' : '']"><span>
            ↑<br />向上
          </span></div>
        <div :class="['btn', 'down', active.ArrowDown ? 'active' : '']"><span>
            ↓<br />向下
          </span></div>
        <div :class="['btn', 'left', active.ArrowLeft ? 'active' : '']"><span>
            ←<br />向左
          </span></div>
        <div :class="['btn', 'right', active.ArrowRight ? 'active' : '']"><span>
            →<br />向右
          </span></div>
      </div>
    </div>
    <div>
      <span>当前速度{{ speed }}/s</span>
      <div class="key-box">
        <div class="key-box-item">
          <div :class="['key-item', active.NumpadAdd ? 'active' : '']">
            <span>+</span>
            <span>加速</span>
          </div>
          <div :class="['key-item', active.NumpadSubtract ? 'active' : '']">
            <span>-</span>
            <span>减速</span>
          </div>
        </div>
        <div class="key-box-item">
          <div :class="['key-item', active.Digit1 ? 'active' : '']">
            <span>1</span>
            <span>拉近</span>
          </div>
          <div :class="['key-item', active.Digit2 ? 'active' : '']">
            <span>2</span>
            <span>拉远</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let _this;
const whiteKeyList = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'KeyW',
  'KeyA',
  'KeyS',
  'KeyD',
  'KeyQ',
  'KeyE',
  'KeyZ',
  'KeyC',
  'NumpadAdd',
  'NumpadSubtract',
  'Digit1',
  'Digit2',
  'Space',
];
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
      active: {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        KeyW: false,
        KeyA: false,
        KeyS: false,
        KeyD: false,
        KeyQ: false,
        KeyE: false,
        KeyZ: false,
        KeyC: false,
        NumpadAdd: false,
        NumpadSubtract: false,
        Digit1: false,
        Digit2: false,
        Space: false,
      },
      speed: 1,
      cameraZoomRatios: 0,
      count: 0,
      timer: null,
    };
  },
  mounted() {
    _this = this;
    this.initKeyboard();
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.activeKeyDown);
    window.removeEventListener('keyup', this.activeKeyUp);
  },
  methods: {
    // 监听键盘事件
    initKeyboard() {
      window.addEventListener('keydown', this.activeKeyDown);
      window.addEventListener('keyup', this.activeKeyUp);
    },
    activeKeyDown(e) {
      let key = e.code,
        key1 = '',
        key2 = '';
      if (whiteKeyList.includes(key)) {
        _this.active[key] = true;
        if (!['NumpadAdd', 'NumpadSubtract'].includes(key)) {
          const speed = _this.speed * 1;
          const speedH = _this.speed * 1; //330;
          const speedW = _this.speed * 1; // 80;
          let droneControl = {
            x: 0,
            y: 0,
            h: 0,
            w: 0,
          };
          let arrowControl = {
            pitch: 0,
            yaw: 0,
            roll: 0,
          };
          let zoomRatios = {
            cameraZoomRatios: 0,
          };
          // w s
          if (_this.active['KeyW'] || _this.active['KeyS']) {
            key = 'droneControl';
            if (_this.active['KeyW'] && _this.active['KeyS']) {
              droneControl.x = 0;
            } else {
              droneControl.x = _this.active['KeyW'] ? speed : -speed;
            }
          }
          // a d
          if (_this.active['KeyA'] || _this.active['KeyD']) {
            key = 'droneControl';
            if (_this.active['KeyA'] && _this.active['KeyD']) {
              droneControl.y = 0;
            } else {
              droneControl.y = _this.active['KeyD'] ? speed : -speed;
            }
          }
          // z c
          if (_this.active['KeyZ'] || _this.active['KeyC']) {
            key = 'droneControl';
            if (_this.active['KeyZ'] && _this.active['KeyC']) {
              droneControl.h = 0;
            } else {
              droneControl.h = _this.active['KeyC'] ? speedH : -speedH;
            }
          }
          // q e
          if (_this.active['KeyQ'] || _this.active['KeyE']) {
            key = 'droneControl';
            if (_this.active['KeyQ'] && _this.active['KeyE']) {
              droneControl.w = 0;
            } else {
              droneControl.w = _this.active['KeyE'] ? speedW : -speedW;
            }
          }
          // ArrowUp  ArrowDown
          if (_this.active['ArrowUp'] || _this.active['ArrowDown']) {
            key1 = 'arrowControl';
            if (_this.active['ArrowUp'] && _this.active['ArrowDown']) {
              arrowControl.pitch = 0;
            } else {
              arrowControl.pitch = _this.active['ArrowDown'] ? -5 : 5;
            }
          }
          // ArrowLeft ArrowRight
          if (_this.active['ArrowLeft'] || _this.active['ArrowRight']) {
            key1 = 'arrowControl';
            if (_this.active['ArrowLeft'] && _this.active['ArrowRight']) {
              arrowControl.yaw = 0;
            } else {
              arrowControl.yaw = _this.active['ArrowLeft'] ? -5 : 5;
            }
          }

          if (_this.active['Digit1'] || _this.active['Digit2']) {
            key2 = 'setCameraZoomRatios';
            if (_this.active['Digit2']) {
              _this.cameraZoomRatios = _this.cameraZoomRatios / 2;
              if (_this.cameraZoomRatios < 1) {
                _this.cameraZoomRatios = 1;
              }
            } else {
              _this.cameraZoomRatios = _this.cameraZoomRatios * 2;
              if (_this.cameraZoomRatios >= 56) {
                _this.cameraZoomRatios = 56;
              }
            }
            zoomRatios.cameraZoomRatios = _this.cameraZoomRatios;
          }
          // 空格急停
          if (_this.active['Space']) {
            key = 'emergencyStop';
          }
          // 所有指令发送
          _this.deviceControl({
            key: key,
            droneControl,
            speed: _this.speed * 28,
          });
          // 云台控制
          if (key1 === 'arrowControl') {
            _this.deviceControl({
              key: key1,
              arrowControl,
              speed: _this.speed * 28,
            });
          }
          if (key2 === 'setCameraZoomRatios') {
            _this.deviceControl({
              key: key2,
              zoomRatios,
              speed: _this.speed * 28,
            });
          }
        } else {
          switch (key) {
            case 'NumpadAdd':
              _this.speedChange('increase');
              break;
            case 'NumpadSubtract':
              _this.speedChange('reduce');
              break;
          }
        }
      }
    },
    deviceControl(data) {
      this.count++;
      const count = this.count;
      const msgObj = {
        droneControl: {
          topic: 2,
          data: { seq: count, x: 0, y: 0, h: 0, w: 0 },
          method: 'drone_control',
        },
        arrowControl: {
          topic: 5,
          data: { pitch: 0, yaw: 0, roll: 0 },
          method: 'gimbal_control',
        },
        emergencyStop: {
          topic: 4,
          data: {},
          method: 'emergency_stop',
        },
        drcGimbalReset: {
          topic: 5,
          data: { reset_mode: 1 },
          method: 'gimbal_reset',
        },
        startLive: {
          topic: 6,
          data: { streamUrl: '' },
          method: 'start_live',
        },
        stopLive: {
          topic: 6,
          data: {},
          method: 'stop_live',
        },
        goHome: {
          topic: 4,
          data: {},
          method: 'go_home',
        },
        basicAircraftService: {
          method: 'landing',
          data: {},
          topic: 4,
        },
        takeOff: {
          topic: 4,
          data: {},
          method: 'take_off',
        },
        confirmLanding: {
          topic: 4,
          data: {},
          method: 'confirm_landing',
        },
        lockDroneControl1: {
          topic: 2,
          data: {
            lock: 0,
          },
          method: 'lock_drone_control',
        },
        lockDroneControl2: {
          topic: 2,
          data: {
            lock: 1,
          },
          method: 'lock_drone_control',
        },
        setCameraSourceType1: {
          topic: 7,
          data: {
            type: 'WIDE_CAMERA',
          },
          method: 'set_camera_video_stream_source_type',
        },
        setCameraSourceType2: {
          topic: 7,
          data: {
            type: 'ZOOM_CAMERA',
          },
          method: 'set_camera_video_stream_source_type',
        },
        takePhoto: {
          topic: 7,
          data: {},
          method: 'take_photo',
        },
        startRecord: {
          topic: 7,
          data: {},
          method: 'start_record',
        },
        stopRecord: {
          topic: 7,
          data: {},
          method: 'stop_record',
        },
        setCameraZoomRatios: {
          topic: 7,
          data: {
            cameraZoomRatios: 0,
          },
          method: 'set_camera_zoom_ratios',
        },
        setVideoSourceType1: {
          topic: 6,
          data: {
            quality: 'SD',
          },
          method: 'set_live_stream_quality',
        },
        setVideoSourceType2: {
          topic: 6,
          data: {
            quality: 'HD',
          },
          method: 'set_live_stream_quality',
        },
        setVideoSourceType3: {
          topic: 6,
          data: {
            quality: 'FULL_HD',
          },
          method: 'set_live_stream_quality',
        },
      };
      const topicList = {
        1: `base/${this.deviceInfo.sn}`,
        2: `thing/firedrone/${this.deviceInfo.sn}/drc/down`, // 飞控机操作
        3: `drc/${this.deviceInfo.sn}`,
        4: `thing/firedrone/${this.deviceInfo.sn}/service/basicAircraftService`, // 一键操作
        5: `thing/firedrone/${this.deviceInfo.sn}/service/gimbal`, // 云台控制
        6: `thing/firedrone/${this.deviceInfo.sn}/service/live`, // 直播
        7: `thing/firedrone/${this.deviceInfo.sn}/service/camera`, // 相机
      };
      let topic = topicList[msgObj[data.key].topic];
      let msg = msgObj[data.key];
      if (data.key === 'droneControl') {
        msg.data = Object.assign(msg.data, data.droneControl);
      }
      if (data.key === 'arrowControl') {
        msg.data = Object.assign(msg.data, data.arrowControl);
      }
      if (data.key === 'setCameraZoomRatios') {
        msg.data = Object.assign(msg.data, data.zoomRatios);
      }
      msg.bid = String(new Date().getTime());
      _this.$bus.$emit('device-control', {
        topic,
        msg,
      });
      // 每次发送操控指令，当不按键的时候发送停止信息
      clearTimeout(_this.timer);
      _this.timer = setTimeout(() => {
        _this.count++;
        _this.$bus.$emit('device-control', {
          topic: `thing/firedrone/${this.deviceInfo.sn}/drc/down`,
          msg: {
            data: { seq: this.count, x: 0, y: 0, h: 0, w: 0 },
            method: 'drone_control',
          },
        });
      }, 300);
    },
    activeKeyUp(e) {
      if (whiteKeyList.includes(e.code)) {
        _this.active[e.code] = false;
      }
    },
    // 控制速度变化
    speedChange(type = 'increase') {
      if (type === 'increase') {
        this.speed = this.speed >= 23 ? 23 : this.speed + 1;
      } else {
        this.speed = this.speed <= 0 ? 0 : this.speed - 1;
      }
    },
  },
};
</script>

<style lang="scss" scoped >
.control-box {
  position: absolute;
  top: calc(75% + 20px);
  left: calc(2.72rem + 3rem + 30px);
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 2.72rem - 3rem - 50px - 3.54rem);
  height: calc(35% - 0.9rem - 30px);
  background: #28323e;
  border-radius: 10px;
  user-select: none;
  .direction-box {
    display: flex;
    align-items: center;
    background: #343e4b;
    border-radius: 0.8rem;
    margin-right: 0.2rem;
    .direction-box2,
    .direction-box1 {
      position: relative;
      width: 1.4rem;
      height: 1.4rem;
      border-radius: 50%;
      &::before {
        position: absolute;
        content: '无人机';
        width: 0.5rem;
        height: 0.5rem;
        background: #28323e;
        border-radius: 50%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 2;
        color: #bec4ca;
        text-align: center;
        line-height: 0.5rem;
        font-size: 0.14rem;
      }
      .btn {
        position: absolute;
        width: 40%;
        height: 40%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #4c5867;
        box-sizing: border-box;
        transition: all 0.3s linear;
        border-radius: 0px 100% 0px 0px;
        color: #bec4ca;
        cursor: pointer;
        text-align: center;
        font-size: 0.13rem;
        i {
          display: inline-block;
        }
        &.active {
          background: #0fa6b4;
          color: #fff;
        }
        &.up {
          top: 0;
          left: 50%;
          transform: translateX(-50%) rotate(-45deg);
          span {
            transform: translate(0%, 3%) rotate(45deg);
          }
        }
        &.down {
          bottom: 0;
          left: 50%;
          transform: translateX(-50%) rotate(-225deg);
          span {
            transform: translate(-5%, 0%) rotate(225deg);
          }
        }
        &.left {
          top: 50%;
          left: 0;
          transform: translateY(-50%) rotate(-135deg);
          span {
            transform: translate(5%, 8%) rotate(135deg);
          }
        }
        &.right {
          top: 50%;
          right: 0;
          transform: translateY(-50%) rotate(45deg);
          span {
            transform: translate(-5%, 0%) rotate(-45deg);
          }
        }
      }
    }
    .direction-box3 {
      &::before {
        content: '云台';
      }
    }
  }
  .speed-box {
    height: 140px;
    background: #343e4b;
    border-radius: 60px;
    width: 62px;
    overflow: hidden;
    padding: 5px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .btn {
      width: 100%;
      height: 46px;
      background: #4c5867;
      text-align: center;
      line-height: 0.46rem;
      font-size: 0.24rem;
      color: #bec4ca;
      transition: all 0.3s;
      cursor: pointer;
      &.speed-increase {
        border-radius: 40px 40px 0 0;
      }
      &.speed-reduce {
        border-radius: 0 0 40px 40px;
      }
      &.active {
        background: #0fa6b4;
        color: #fff;
      }
    }
    .speed {
      text-align: center;
      font-weight: 400;
      font-size: 12px;
      color: #ffffff;
    }
  }
  .key-box {
    .key-box-item {
      display: flex;
      align-items: center;
      margin-top: 2px;
      .key-item {
        background: #3e4957;
        height: 23px;
        margin-right: 2px;
        text-align: center;
        span {
          display: inline-block;
          height: 23px;
          &:nth-of-type(1) {
            width: 23px;
          }
          &:nth-of-type(2) {
            width: 38px;
            border-left: 1px solid #28323e;
          }
        }
        &.active {
          background: #0fa6b4;
        }
      }
    }
  }
}
</style>