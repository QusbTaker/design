<template>
  <div class="compass-page">
    <div class="block_18 flex-col">
      <div class="section_12 flex_bw_start flex_wrap">
        <div
          v-if="['HOLD', 'OFFBOARD'].includes(deviceInfoSys.flightMode) 
          && deviceInfoSys.taskExecuteId
          && deviceInfoSys.position.relativeAltitude >= 3
          "
          class="group_43 flex"
        >
          <div
            class="image-text_10 flex_center_center"
            @click="returnToLaunch"
          >
            <i class="iconfont icon-a-ziyuan133"></i>
            <span class="text-group_19">一键返航</span>
          </div>
        </div>
        <div
          class="group_43 group_44 flex"
          v-if="['HOLD'].includes(deviceInfoSys.flightMode) && deviceInfoSys.taskExecuteId"
        >
          <div
            class="image-text_10 flex_center_center"
            @click="startOffboardMode"
          >
            <i class="iconfont icon-a-ziyuan132"></i>
            <span class="text-group_19">手动接管</span>
          </div>
        </div>
        <!-- v-if="['UNKNOWN', 'RETURN_TO_LAUNCH', 'LAND'].includes(deviceInfoSys.flightMode)" -->
        <div
          class="group_43 box_34 flex"
          v-if="deviceInfoSys.position.relativeAltitude < 3 && deviceInfoSys.taskExecuteId"
        >
          <div
            class="image-text_10 flex_center_center"
            @click="takeOff"
          >
            <i class="iconfont icon-a-ziyuan130"></i>
            <span class="text-group_19">一键起飞</span>
          </div>
        </div>
        <div
          class="group_43 box_34 flex"
          v-if="['HOLD', 'OFFBOARD'].includes(deviceInfoSys.flightMode) && deviceInfoSys.taskExecuteId"
        >
          <div
            class="image-text_10 flex_center_center"
            @click="landOff"
          >
            <i class="iconfont icon-a-ziyuan130"></i>
            <span class="text-group_19">一键降落</span>
          </div>
        </div>
        <div
          class="group_43 box_35 flex"
          v-if="deviceInfoSys.taskExecuteId && deviceInfoSys.position.relativeAltitude < 3"
        >
          <div
            class="image-text_10 flex_center_center"
            @click="stopTask"
          >
            <i class="iconfont icon-a-ziyuan122"></i>
            <span class="text-group_19">结束任务</span>
          </div>
        </div>
      </div>
      <div class="section_14 flex_bw_center">
        <div class="group_45 flex">
          <div class="image-text_14 flex_col flex_center_center">
            <i class="iconfont icon-a-ziyuan131"></i>
            <span class="text-group_23">喊话</span>
          </div>
        </div>
        <div class="group_45 flex">
          <div class="image-text_14 flex_col flex_center_center">
            <i class="iconfont icon-a-ziyuan123"></i>
            <span class="text-group_23">开启照明</span>
          </div>
        </div>
        <div class="group_45 flex">
          <div class="image-text_14 flex_col flex_center_center">
            <i class="iconfont icon-a-ziyuan128"></i>
            <span class="text-group_23">降落货物</span>
          </div>
        </div>
        <div class="group_45 flex">
          <div class="image-text_14 flex_col flex_center_center">
            <i class="iconfont icon-a-ziyuan127"></i>
            <span class="text-group_23">喷射灭火</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { endTaskExecute } from '@/api/task';
export default {
  dicts: ['gps_signal_level', 'wind_direction', 'wind_warning'],
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
  methods: {
    startOffboardMode() {
      this.$bus.$emit('device-control', {
        topic: `thing/firedrone/${this.deviceInfo.sn}/drc/down`,
        msg: {
          data: {},
          bid: String(new Date().getTime()),
          method: 'start_offboard_mode',
        },
      });
    },
    landOff() {
      this.$bus.$emit('device-control', {
        topic: `thing/firedrone/${this.deviceInfo.sn}/service/basicAircraftService`,
        bid: String(new Date().getTime()),
        msg: {
          data: {},
          method: 'land',
        },
      });
    },
    takeOff() {
      this.$bus.$emit('device-control', {
        topic: `thing/firedrone/${this.deviceInfo.sn}/service/basicAircraftService`,
        msg: {
          data: {},
          bid: String(new Date().getTime()),
          method: 'take_off',
        },
      });
    },
    stopTask() {
      const _this = this;
      this.$confirm('结束任务后，此页面不再显示直播画面！ 请确保无人机已降落！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          endTaskExecute({
            taskExecuteId: this.deviceInfoSys.taskExecuteId,
            sn: this.deviceInfo.sn,
          }).then((res) => {
            console.log('结束任务', res);
            _this.$emit('endTask');
            _this.$bus.$emit('topic-control', {
              type: 'remove',
              sn: this.deviceInfo.sn,
            });
          });
        })
        .catch(() => {});
    },
    returnToLaunch() {
      this.$bus.$emit('device-control', {
        topic: `thing/firedrone/${this.deviceInfo.sn}/service/basicAircraftService`,
        msg: {
          data: {},
          bid: String(new Date().getTime()),
          method: 'return_to_launch',
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped >
.compass-page {
  color: #bdbebf;
  position: absolute;
  top: calc(75% + 20px);
  right: 10px;
  background: #28323e;
  border-radius: 10px;
  height: calc(35% - 0.9rem - 30px);
  width: 3.54rem;
  padding: 15px;
  overflow-x: hidden;
  overflow-y: auto;
  .block_18 {
    .section_12 {
      height: 0.95rem;
      // width: 3.3rem;
      .group_43 {
        background-color: rgba(239, 68, 68, 1);
        border-radius: 4px;
        width: calc(50% - 0.05rem);
        height: 0.38rem;
        margin-bottom: 0.1rem;
        cursor: pointer;
        .image-text_10 {
          width: 100%;
          height: 100%;
          .iconfont {
            font-size: 16px;
            color: #fff;
            margin-right: 5px;
            &.icon-a-ziyuan133 {
              font-size: 18px;
            }
            &.icon-a-ziyuan130 {
              font-size: 14px;
            }
          }
          .text-group_19 {
            max-width: 0.57rem;
            overflow-wrap: break-word;
            color: rgba(255, 255, 255, 1);
            font-size: 0.14rem;
            font-weight: normal;
            text-align: left;
            white-space: nowrap;
          }
        }
        &:hover,
        &:active {
          opacity: 0.9;
        }
      }
      .group_44 {
        background-color: rgba(202, 138, 4, 1);
      }
      .box_34 {
        background-color: rgba(59, 130, 246, 1);
      }
      .box_35 {
        background-color: rgba(16, 185, 129, 1);
      }
    }
    .section_14 {
      width: 3.3rem;
      height: 0.6rem;
      .group_45 {
        background-color: rgba(48, 58, 71, 1);
        border-radius: 4px;
        width: 0.75rem;
        height: 0.6rem;
        cursor: pointer;
        box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.04);
        .image-text_14 {
          width: 100%;
          height: 100%;
          .iconfont {
            color: #fff;
          }
          .text-group_23 {
            overflow-wrap: break-word;
            color: rgba(255, 255, 255, 1);
            font-size: 0.14rem;
            font-family: MicrosoftYaHei;
            font-weight: normal;
            text-align: left;
            white-space: nowrap;
            margin-top: 0.1rem;
          }
        }
        &:hover,
        &:active {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>