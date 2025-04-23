<template>
  <el-dialog
    :title="title"
    :visible="visible"
    append-to-body
    lock-scroll
    top="15vh"
    width="849px"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="beforeClose"
  >
    <div class="tab-list">
      <div
        :class="['active']"
        class="tab"
      >起飞前自检</div>
    </div>
    <!-- 内容区域 -->
    <div class="start-content">
      <div>
        <div class="device-info">
          <div class="left">
            <div class="header">
              <div class="name status-success">无人机信息</div>
              <div class="name">SN：{{ uavInfo.sn }}</div>
              <div class="name">型号：{{ uavInfo.uavModel }}</div>
            </div>
            <div class="img">
              <webrtc-player
                :controls="true"
                :videoId="'video1'"
                :url="liveUrl"
              ></webrtc-player>
            </div>
          </div>
          <div class="right">
            <div class="header">
              <div class="text">正在检测，请稍等</div>
            </div>
            <div class="content">
              <div class="item">
                <div class="text">卫星数：</div>
                <div class="value">
                  <span>{{ deviceInfo.gpsNumSatellites }}</span>
                  <i
                    v-if="deviceInfo.gpsNumSatellites > 0"
                    style="color: #3AF2A6;"
                    class="iconfont icon-a-ziyuan102"
                  ></i>
                  <i
                    v-else
                    style="color: #FF6969;"
                    class="iconfont icon-a-ziyuan96"
                  ></i>
                </div>
              </div>
              <div class="item">
                <div class="text">无人机剩余电量：</div>
                <div class="value">
                  <span>{{ deviceInfo.batteryRemainingPercent }}%</span>
                  <i
                    v-if="deviceInfo.batteryRemainingPercent > 0"
                    style="color: #3AF2A6;"
                    class="iconfont icon-a-ziyuan102"
                  ></i>
                  <i
                    v-else
                    style="color: #FF6969;"
                    class="iconfont icon-a-ziyuan96"
                  ></i>
                </div>
              </div>
              <div class="item">
                <div class="text">全球位置估计状态：</div>
                <div class="value">
                  <i
                    v-if="deviceInfo.healthIsGlobalPositionOk"
                    style="color: #3AF2A6;"
                    class="iconfont icon-a-ziyuan102"
                  ></i>
                  <i
                    v-else
                    style="color: #FF6969;"
                    class="iconfont icon-a-ziyuan96"
                  ></i>
                </div>
              </div>
              <div class="item">
                <div class="text">本地位置估计状态：</div>
                <div class="value">
                  <i
                    v-if="deviceInfo.healthIsLocalPositionOk"
                    style="color: #3AF2A6;"
                    class="iconfont icon-a-ziyuan102"
                  ></i>
                  <i
                    v-else
                    style="color: #FF6969;"
                    class="iconfont icon-a-ziyuan96"
                  ></i>
                </div>
              </div>
              <div class="item">
                <div class="text">返航点设置状态：</div>
                <div class="value">
                  <i
                    v-if="deviceInfo.healthIsHomePositionOk"
                    style="color: #3AF2A6;"
                    class="iconfont icon-a-ziyuan102"
                  ></i>
                  <i
                    v-else
                    style="color: #FF6969;"
                    class="iconfont icon-a-ziyuan96"
                  ></i>
                </div>
              </div>
              <div class="item">
                <div class="text">陀螺仪校准状态：</div>
                <div class="value">
                  <i
                    v-if="deviceInfo.healthIsGyrometerCalibrationOk"
                    style="color: #3AF2A6;"
                    class="iconfont icon-a-ziyuan102"
                  ></i>
                  <i
                    v-else
                    style="color: #FF6969;"
                    class="iconfont icon-a-ziyuan96"
                  ></i>
                </div>
              </div>
              <div class="item">
                <div class="text">加速度计校准状态：</div>
                <div class="value">
                  <i
                    v-if="deviceInfo.healthIsAccelerometerCalibrationOk"
                    style="color: #3AF2A6;"
                    class="iconfont icon-a-ziyuan102"
                  ></i>
                  <i
                    v-else
                    style="color: #FF6969;"
                    class="iconfont icon-a-ziyuan96"
                  ></i>
                </div>
              </div>
              <div class="item">
                <div class="text">磁力计校准状态：</div>
                <div class="value">
                  <i
                    v-if="deviceInfo.healthIsMagnetometerCalibrationOk"
                    style="color: #3AF2A6;"
                    class="iconfont icon-a-ziyuan102"
                  ></i>
                  <i
                    v-else
                    style="color: #FF6969;"
                    class="iconfont icon-a-ziyuan96"
                  ></i>
                </div>
              </div>
              <div class="item">
                <div class="text">无人机是否可以解锁：</div>
                <div class="value">
                  <i
                    v-if="deviceInfo.healthIsArmable"
                    style="color: #3AF2A6;"
                    class="iconfont icon-a-ziyuan102"
                  ></i>
                  <i
                    v-else
                    style="color: #FF6969;"
                    class="iconfont icon-a-ziyuan96"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="() => beforeClose()">取 消</el-button>
      <el-button
        @click="next"
        type="primary"
        :loading="loading"
      >开启飞行</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addExecuteTask, updateExecuteTask, uavMqttCheck, takeFlight } from '@/api/task';
import { getWayLine } from '@/api/wayline';
import { getTask } from '@/api/task';
import { getUav } from '@/api/organization/device';
import LiveVideo from './LiveVideo.vue';
import WebrtcPlayer from '@/components/video/WebrtcPlayer';
export default {
  components: {
    LiveVideo,
    WebrtcPlayer,
  },
  props: {
    wayLineId: {
      // 航线信息
      type: Object | null,
      default: null,
    },
    taskId: {
      type: Number | String,
      default: '',
    },
    uavId: {
      type: Number | String,
      default: '',
    },
    taskType: {
      type: Number,
      default: 1,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.getDetail();
      }
    },
  },
  data() {
    return {
      taskInfo: {},
      wayLine: {},
      uavInfo: {},
      title: '连接无人机',
      step: 1,
      activeIndex: 0,
      uavsList: [],
      row: null,
      executeRow: null,
      loading: false,
      deviceInfo: {
        aircraftTotalFlightDistance: 0,
        aircraftTotalFlightDuration: 0,
        arrmed: false,
        battery: null,
        batteryRemainingPercent: 0,
        batteryVoltage: 0,
        checkTime: '2025-03-05',
        gpsFixType: 'FIX_3D',
        gpsInfo: null,
        gpsNumSatellites: 0,
        health: null,
        healthIsAccelerometerCalibrationOk: false,
        healthIsArmable: false,
        healthIsGlobalPositionOk: false,
        healthIsGyrometerCalibrationOk: false,
        healthIsHomePositionOk: false,
        healthIsLocalPositionOk: false,
        healthIsMagnetometerCalibrationOk: false,
        position: null,
        positionAbsoluteAltitude: 0,
        positionLatitude: 0,
        positionLongitude: 0,
        positionRelativeAltitude: 0,
      }, // 无人机自检信息
      checkFlag: false, //检查无人机通信状态
      liveUrl: null,
    };
  },
  beforeDestroy() {
    this.close();
  },
  methods: {
    async getDetail() {
      if (this.taskId) {
        const res = await getTask(this.taskId);
        this.taskInfo = res.data;
      }
      if (this.uavId) {
        const res = await getUav(this.uavId);
        this.uavInfo = res.data;
      }
      if (this.wayLineId) {
        const res = getWayLine(this.wayLineId);
        this.wayLine = res.data;
      }
      this.startTask();
    },
    // 关闭
    beforeClose(done) {
      if (this.executeRow) {
        updateExecuteTask({
          id: this.executeRow.id,
          endStatus: 1,
        }).then((res) => {
          if (done) {
            done();
          }
          this.step = 1;
          this.close();
        });
      } else {
        if (done) {
          done();
        }
        this.step = 1;
        this.close();
      }

      console.log('关闭');
    },
    startTask() {
      this.loading = true;
      let params = {
        uavId: this.uavId,
        taskId: this.taskId,
        taskType: this.taskType,
        sn: this.uavInfo.sn,
      };
      if (this.taskType == 2) {
        params.waylineId = this.wayLineId;
      }
      addExecuteTask(params)
        .then((res) => {
          this.loading = false;
          console.log('开启任务', res);
          this.executeRow = res.data;
          this.liveUrl = this.$store.state.config.liveUrl.replace(
            'livestream',
            `livestream-${this.executeRow.sn}_${this.executeRow.id}`
          );
          this.checkFlag = true;
          this.uavMqttCheck();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 检查无人机通信状态
    uavMqttCheck() {
      uavMqttCheck(this.executeRow.id)
        .then((res) => {
          console.log('检查通信状态', res);
          if (res.data) {
            this.deviceInfo = res.data;
          }
          if (this.checkFlag) {
            setTimeout(() => {
              this.checkFlag && this.uavMqttCheck();
            }, 1000);
          }
        })
        .catch((error) => {
          this.uavMqttCheck();
        });
    },
    // 开始起飞
    takeFlight() {
      const checkList = [
        'healthIsGlobalPositionOk',
        'healthIsLocalPositionOk',
        'healthIsHomePositionOk',
      ];
      let checkListRes = checkList.every((item) => {
        return this.deviceInfo[item];
      });
      if(this.deviceInfo.gpsNumSatellites <= 0){
        checkListRes = false;
      }
      if(this.deviceInfo.batteryRemainingPercent <= 20){ 
        checkListRes = false;
      }
      if (!checkListRes) {
        this.$modal.msgError('请检查链接状态');
        return false;
      }
      this.loading = true;
      takeFlight(this.executeRow.id)
        .then((res) => {
          this.loading = false;
          console.log('起飞', res);
          this.$bus.$emit('topic-control', {
            type: 'add',
            sn: this.uavInfo.sn,
          });
          if (this.taskType === 2) {
            this.$router.replace({
              path: '/flow',
              query: {
                executeTaskId: this.executeRow.id,
                uavId: this.uavId,
                taskId: this.taskId,
                wayLineId: this.wayLineId,
              },
            });
          } else {
            this.$emit('takeFlight', res);
            this.close();
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    next() {
      this.takeFlight();
    },
    close() {
      this.checkFlag = false;
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style lang="scss" scoped >
.start-button {
  position: fixed;
  right: 3vw;
  bottom: 6vh;
  width: 0.71rem;
  height: 0.71rem;
  background: linear-gradient(0deg, #015eea 0%, #00c0fa 100%);
  border-radius: 50%;
  font-weight: 400;
  font-size: 18px;
  line-height: 0.71rem;
  text-align: center;
  color: #ffffff;
  cursor: pointer;
  user-select: none;
}
.tab-list {
  display: flex;
  justify-content: space-between;
  padding: 0;
  .tab {
    width: 100%;
    height: 31px;
    background: #5e6f7d;
    border-radius: 1px;
    text-align: center;
    line-height: 31px;
    color: #ffffff;
    &.active {
      background: #0fa6b4;
    }
  }
}
.start-content {
  height: 50vh;
  overflow-y: auto;
  padding: 15px 0;
  .device-list {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    .device-item {
      display: block;
      width: calc(33.33% - 10px);
      height: 98px;
      background: #5e6f7d;
      border-radius: 4px;
      padding: 15px;
      cursor: pointer;
      border: 1px solid #5e6f7d;
      .name {
        font-weight: 400;
        font-size: 15px;
        color: #ffffff;
        padding-left: 20px;
        margin-bottom: 10px;
        position: relative;
        &.status-success {
          &::before {
            position: absolute;
            content: '';
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 12px;
            height: 12px;
            background: #43cf7c;
            border-radius: 50%;
          }
        }
        &.status-error {
          &::before {
            position: absolute;
            content: '';
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 12px;
            height: 12px;
            background: #ff8d1a;
            border-radius: 50%;
          }
        }
      }
      .desc {
        margin-top: 5px;
        font-size: 14px;
        color: #bbc4cc;
        padding-left: 20px;
      }
      &.active {
        border-color: #0fa6b4;
        background: #495d6d;
      }
    }
  }
  .device-info {
    display: flex;
    height: calc(50vh - 30px);
    align-items: stretch;
    overflow: hidden;
    .left {
      width: 60%;
      margin-right: 10px;
      background: #45525d;
      .header {
        display: flex;
        align-items: center;
        height: 30px;
        padding: 0 15px;
        .name {
          position: relative;
          padding-left: 20px;
          &.status-success {
            &::before {
              position: absolute;
              content: '';
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 12px;
              height: 12px;
              background: #43cf7c;
              border-radius: 50%;
            }
          }
          &.status-error {
            &::before {
              position: absolute;
              content: '';
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 12px;
              height: 12px;
              background: #ff8d1a;
              border-radius: 50%;
            }
          }
        }
      }
      .img {
        height: calc(100% - 30px);
        width: 100%;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .right {
      background: #45525d;
      width: calc(40% - 10px);
      padding: 0 12px;
      .header {
        display: flex;
        align-items: center;
        height: 36px;
        line-height: 36px;
        font-size: 14px;
        color: #ffffff;
        border-bottom: 1px solid #8494a2;
      }
      .content {
        .item {
          display: flex;
          justify-content: space-between;
          color: #d1dce5;
          font-size: 14px;
          margin: 15px 0;
          .value {
            display: flex;
            align-items: center;
            span {
              margin-right: 5px;
            }
            .iconfont {
              font-size: 10px;
              &.icon-a-ziyuan102 {
                font-size: 8px;
              }
            }
          }
        }
      }
    }
  }
}
</style>