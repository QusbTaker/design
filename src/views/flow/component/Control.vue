<!--
 * @Author: 刘小满
 * @Date: 2025-01-20 15:39:56
 * @Descripttion: 
-->
<template>
  <div class="app-main">
    <task-list
      :taskInfo="taskInfo"
      :taskList="taskList"
      @handleTask="handleTask"
    ></task-list>
    <!-- 救援力量 -->
    <power-list
      v-if="taskInfo"
      :taskInfo="taskInfo"
      :taskList="taskList"
      @changeDeviceInfo="changeDeviceInfo"
      @handleManualFlight="handleManualFlight"
    ></power-list>
    <!-- 实时数据 -->
    <map-data
      v-if="taskInfo"
      ref="mapData"
      :deviceInfoSys="deviceInfoSys"
      :deviceInfo="deviceInfo"
    ></map-data>
    <!-- 视频 -->
    <live-video
      v-if="taskInfo"
      :deviceInfo="deviceInfo"
    ></live-video>
    <!-- 操控日志 -->
    <task-progress
      v-if="taskInfo"
      :operateList="operateList"
    ></task-progress>
    <!-- 控制 -->
    <control-bar
      v-if="taskInfo"
      :deviceInfoSys="deviceInfoSys"
      :deviceInfo="deviceInfo"
    ></control-bar>
    <!-- 无人机信息 -->
    <compass-info
      v-if="taskInfo"
      :deviceInfoSys="deviceInfoSys"
      :deviceInfo="deviceInfo"
    ></compass-info>
    <!-- 按钮 -->
    <compass-btn
      v-if="taskInfo"
      :deviceInfoSys="deviceInfoSys"
      :deviceInfo="deviceInfo"
      @endTask="takeFlight"
    ></compass-btn>
    <!-- 自检起飞弹窗 -->
    <take-off
      :visible.sync="visible"
      :taskType="1"
      :taskId="taskInfo ? taskInfo.id : ''"
      :uavId="deviceInfo ? deviceInfo.uavId : ''"
      @takeFlight="takeFlight"
    ></take-off>
  </div>
</template>

<script>
import TaskList from './TaskList.vue';
import PowerList from './List.vue';
import mapData from './mapData.vue';
import LiveVideo from './LiveVideo.vue';
import ControlBar from './ControlBar.vue';
import TaskProgress from './TaskProgress.vue';
import CompassInfo from './CompassInfo.vue';
import CompassBtn from './CompassBtn.vue';
import TakeOff from './TakeOff.vue';
import { listTask, getDistribution, listExecuteTask, getOperationListInflux } from '@/api/task';
import { deepClone } from '../../../utils';
const DEFAULTINFO = {
  speed: 0,
  gpsInfo: {
    numSatellites: 0,
    fixType: '',
  },
  position: {
    latitude: '',
    longitude: '',
    absoluteAltitude: 0,
    relativeAltitude: 0,
  },
  battery: {
    remainingPercent: 0,
    voltage: 0,
  },
  flightMode: '',
  velocity: {
    north: 0,
    east: 0,
    down: 0,
  },
  taskExecuteId: 0,
  attitude: {
    roll: 0,
    pitch: 0,
    yaw: 0,
  },
  arrmed: false,
  health: {
    isGyrometerCalibrationOk: false, // 陀螺仪校准状态（false 表示未校准或异常）
    isAccelerometerCalibrationOk: false, // 加速度计校准状态（false 表示未校准或异常）
    isMagnetometerCalibrationOk: true, // 磁力计校准状态（true 表示正常）
    isGlobalPositionOk: true, // 全球位置估计状态（true 表示正常）
    isHomePositionOk: true, // 返航点设置状态（true 表示正常）
    isLocalPositionOk: true, // 本地位置估计状态（true 表示正常）
    isArmable: false, // 无人机是否可以解锁（false 表示不可解锁）
  },
};
export default {
  components: {
    TaskList,
    PowerList,
    mapData,
    LiveVideo,
    ControlBar,
    TaskProgress,
    CompassInfo,
    CompassBtn,
    TakeOff,
  },
  data() {
    return {
      taskList: [],
      taskInfo: null,
      deviceInfo: null,
      deviceInfoSys: {
        speed: 0,
        gpsInfo: {
          numSatellites: 0,
          fixType: '',
        },
        position: {
          latitude: '',
          longitude: '',
          absoluteAltitude: 0,
          relativeAltitude: 0,
        },
        battery: {
          remainingPercent: 0,
          voltage: 0,
        },
        flightMode: '',
        velocity: {
          north: 0,
          east: 0,
          down: 0,
        },
        taskExecuteId: 0,
        attitude: {
          roll: 0,
          pitch: 0,
          yaw: 0,
        },
        arrmed: false,
        health: {
          isGyrometerCalibrationOk: false, // 陀螺仪校准状态（false 表示未校准或异常）
          isAccelerometerCalibrationOk: false, // 加速度计校准状态（false 表示未校准或异常）
          isMagnetometerCalibrationOk: true, // 磁力计校准状态（true 表示正常）
          isGlobalPositionOk: true, // 全球位置估计状态（true 表示正常）
          isHomePositionOk: true, // 返航点设置状态（true 表示正常）
          isLocalPositionOk: true, // 本地位置估计状态（true 表示正常）
          isArmable: false, // 无人机是否可以解锁（false 表示不可解锁）
        },
      },
      operateList: [],
      visible: false, // 自检起飞弹窗
    };
  },
  created() {
    this.getTasklist();
  },
  watch: {
    deviceInfo: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        if (this.deviceInfo) {
          this.operateList = [];
          if (oldVal) {
            this.$bus.$off(`thing/firedrone/${oldVal.sn}/osd`);
            this.$bus.$off(`thing/firedrone/${oldVal.sn}/servicesReply`);
          }
          if (newVal) {
            if (newVal.taskExecuteId) {
              this.getOperationListInflux();
            }
            this.$bus.$on(`thing/firedrone/${newVal.sn}/osd`, (data) => {
              this.deviceInfoSys = Object.assign(data.data, {
                position: {
                  ...data.data.position,
                  longitude: data.data.position.longitude.toFixed(6),
                  latitude: data.data.position.latitude.toFixed(7),
                  absoluteAltitude: data.data.position.absoluteAltitude.toFixed(2),
                  relativeAltitude: data.data.position.relativeAltitude.toFixed(2),
                },
                attitude: {
                  roll: data.data.attitude.roll.toFixed(2),
                  pitch: data.data.attitude.pitch.toFixed(2),
                  yaw: data.data.attitude.yaw.toFixed(2),
                },
                velocity: {
                  north: data.data.velocity.north.toFixed(2),
                  east: data.data.velocity.east.toFixed(2),
                  down: data.data.velocity.down.toFixed(2),
                },
                speed: (data.data.velocity
                  ? Math.max(Math.abs(data.data.velocity.north), Math.abs(data.data.velocity.east))
                  : 0
                ).toFixed(2),
                battery: {
                  ...data.data.battery,
                  voltage: data.data.battery.voltage.toFixed(1),
                },
              });
              if (data.data.gpsInfo.fixType != 'NO_GPS' && this.$refs['mapData']) {
                this.$refs['mapData'].setPoint(data.data);
              }
            });
            this.$bus.$on(`thing/firedrone/${newVal.sn}/servicesReply`, (data) => {
              console.log('操作', data);
              const info = {
                ...data.data,
                operationTime: data.timestamp,
              };
              this.operateList.unshift(info);
            });
          }
        }
      },
    },
  },
  methods: {
    getOperationListInflux() {
      getOperationListInflux(this.deviceInfo.taskExecuteId).then((res) => {
        this.operateList = res.data;
      });
    },
    getTasklist() {
      listTask({ pageSize: 1000, taskStatus: 0 }).then((res) => {
        console.log('res', res);
        if (res.rows.length > 0) {
          this.taskList = res.rows;
          let index = this.taskList.findIndex((el) => el.id === this.$route.query.taskId);
          if (index < 0) {
            index = 0;
          }
          this.taskInfo = this.taskList[index];
        } else {
          this.$emit('refresh');
        }
      });
    },
    // 查询飞行记录
    listExecuteTask() {
      listExecuteTask({
        endStatus: 0,
        taskId: this.taskInfo.id,
        uavId: this.deviceInfo.uavId,
      }).then((res) => {
        if (res.rows.length > 0) {
          const row = res.rows[0];
          this.$set(this.deviceInfo, 'taskExecuteId', row.id);
          this.deviceInfo.taskExecuteInfo = row;
        } else {
          this.$set(this.deviceInfo, 'taskExecuteId', null);
        }
      });
    },
    // 切换任务
    handleTask(row) {
      this.taskInfo = row;
    },
    // 切换设备
    changeDeviceInfo(data) {
      const params = data || this.deviceInfo;
      getDistribution(params.id).then((res) => {
        this.deviceInfo = res.data;
        this.listExecuteTask();
      });
    },
    handleManualFlight() {
      this.visible = true;
    },
    takeFlight() {
      this.deviceInfoSys = deepClone(DEFAULTINFO);
      this.changeDeviceInfo();
    },
  },
};
</script>

<style lang="scss" scoped >
.app-main {
  height: calc(100vh - 50px);
  padding: 15px;
}
</style>