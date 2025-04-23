<template>
  <div class="app-container">
    <div class="page-header">
      <router-link to="/">首页</router-link>
      <i class="el-icon-arrow-right"></i>
      <span>{{ taskInfo.name }}</span>
      <i class="el-icon-arrow-right"></i>
      <span>救援详情</span>
    </div>
    <div class="task-detail">
      <div class="task-detail-left">
        <div class="card-title">
          救援详情
        </div>
        <div class="info-box">
          <div class="info-item">
            <div class="info-item-label">
              救援名称
            </div>
            <div class="info-item-value">
              {{ taskInfo.name }}
            </div>
          </div>
          <div class="info-item">
            <div class="info-item-label">
              起火具体地址
            </div>
            <div class="info-item-value">
              {{ taskInfo.completeAddress }}
            </div>
          </div>
          <div class="info-item">
            <div class="info-item-label">
              开始救援时间
            </div>
            <div class="info-item-value">
              {{ taskInfo.createTime }}
            </div>
          </div>
          <div class="info-item">
            <div class="info-item-label">
              救援结束时间
            </div>
            <div class="info-item-value">
              {{ taskInfo.endTime }}
            </div>
          </div>
          <div class="info-item">
            <div class="info-item-label">
              出动救援力量
            </div>
            <div class="info-item-value">
              {{ '侦查无人机' + taskInfo.taskExecuteList.length + '架' }}
            </div>
          </div>
          <div class="info-item">
            <div class="info-item-label">
              参与救援单位
            </div>
            <div class="info-item-value">
              {{ taskInfo.deptName }}
            </div>
          </div>
        </div>
      </div>
      <div class="task-detail-center">
        <div class="video-content">
          <div class="card-title">
            救援视频
          </div>
          <div class="video-box flex_start_center ">
            <div
              class="video-item"
              v-for="item in executeTaskList"
              :key="item.id"
            >
              <video
                :src="item.livestreamUrl"
                controls
              />
              <div class="video-item-title">
                {{ item.uavName }}
              </div>
            </div>
          </div>

        </div>
        <div class="summary-content">
          <div class="card-title">
            救援分析总结
          </div>
          <div class="summary-box">
            <el-input
              type="textarea"
              :rows="10"
              v-model="remark"
              placeholder="请输入"
            />
            <el-button type="primary" @click="saveRemark">
              保存
            </el-button>
          </div>

        </div>
      </div>
      <div class="task-detail-right">
        <div class="card-title">救援方案</div>
        <div class="device-box">
          <div
            class="device-item"
            v-for="item in deviceList"
            :key="item.id"
          >
            <div class="device-item-title">
              <i class="iconfont icon-a-ziyuan89" />
              {{ item.uavName }}
            </div>
            <div class="device-item-value">
              {{ item.uavName }}
            </div>
            <div class="device-item-value">
              型号：{{ item.uavModel }}
            </div>
            <div class="device-item-value">
              飞手：{{ item.flyerName }}
            </div>
            <div class="device-item-value">
              距离起火点：{{ item.distance || 0 }}km
            </div>
            <div class="device-item-value">
              到达时间：{{ item.time || 0 }}分钟
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTask, updateTask, listTask, listDistribution, listExecuteTask } from '@/api/task';
export default {
  data() {
    return {
      taskInfo: {},
      deviceList: [],
      executeTaskList: [],
      remark: '',
    };
  },
  created() {
    this.taskId = this.$route.query.taskId;
    this.getTask();
    this.getDistribution();
    this.getExecuteTask();
  },
  methods: {
    getTask() {
      listTask({
        id: this.taskId,
      }).then((res) => {
        this.taskInfo = res.rows[0];
        this.remark = this.taskInfo.remark;
      });
    },
    getDistribution() {
      listDistribution({
        taskId: this.taskId,
        pageSize: 1000,
      }).then((res) => {
        this.deviceList = res.rows;
      });
    },
    getExecuteTask() {
      listExecuteTask({
        pageSize: 1000,
        endStatus: 1,
        taskId: this.taskId,
      }).then((res) => {
        this.executeTaskList = res.rows;
      });
    },
    saveRemark() {
      updateTask({
        id: this.taskId,
        remark: this.remark,
      }).then((res) => {
        this.$message.success('保存成功');
        this.getTask();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  padding: 15px;
}
.page-header {
  margin-bottom: 10px;
}
.card-title {
  border-bottom: 1px solid #363846;
  line-height: 40px;
  padding-left: 15px;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 16px;
    background-color: #03baca;
    border-radius: 4px;
  }
}
.task-detail {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: calc(100% - 30px);
  gap: 10px;
  &-left {
    width: 20%;
    height: 100%;
    background-color: #282f33;
    border-radius: 4px;
    padding: 10px;
    .info-box {
      .info-item {
        margin-top: 20px;
        .info-item-label {
          font-size: 14px;
          color: #becbd8;
          margin-bottom: 5px;
        }
        .info-item-value {
          font-size: 14px;
          color: #fff;
        }
      }
    }
  }
  &-center {
    width: 60%;
    height: 100%;
    border-radius: 4px;
    .video-content {
      height: 40%;
      padding: 10px;
      background-color: #282f33;
      .video-box {
        overflow-x: auto;
        margin-top: 10px;
        .video-item {
          border-radius: 4px;
          margin-right: 10px;
          video {
            width: 3rem;
            height: 2rem;
            object-fit: cover;
            border-radius: 4px;
          }
        }
      }
    }
    .summary-content {
      margin-top: 10px;
      height: calc(60% - 10px);
      padding: 10px;
      background-color: #282f33;
      .summary-box {
        .el-textarea {
          margin-top: 10px;
        }
        .el-button {
          margin-top: 10px;
        }
      }
    }
  }
  &-right {
    width: 20%;
    height: 100%;
    background-color: #282f33;
    border-radius: 4px;
    padding: 10px;
    .device-box {
      .device-item {
        margin-top: 10px;
        .device-item-title {
          font-size: 14px;
          color: #fff;
          .iconfont {
            font-size: 14px;
            color: #03baca;
            margin-right: 5px;
          }
        }
        .device-item-value {
          font-size: 14px;
          color: #becbd8;
          padding-left: 20px;
          margin-top: 5px;
        }
      }
    }
  }
}
</style>
