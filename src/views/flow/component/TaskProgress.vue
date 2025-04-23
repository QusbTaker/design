<template>
  <div class="log-box">
    <div>任务进度</div>
    <el-divider></el-divider>
    <div class="timeline">
      <div
        :class="['timeline-item', i.status == 'success' ? 'active' : '']"
        v-for="i of operateList"
      >

        <div class="left-time">
          {{ parseTime(i.timestamp || new Date(i.operationTime), '{hh}:{ii}:{ss}') }}
        </div>
        <div class="timeline-item-icon">
          <i class="el-icon-dot"></i>
        </div>
        <div class="timeline-item-content">
          <span>{{ i.methodLabel }}</span>
          <i
            v-if="i.status == 'success'"
            class="el-icon-check"
          ></i>
          <i
            v-else
            class="el-icon-close"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/utils/index';
export default {
  props: {
    taskInfo: {
      type: Object | null,
      default: function () {
        return null;
      },
    },
    operateList: {
      type: Array | null,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      reverse: true,
      // operateList: [
      //   {
      //     methodLabel: '活动按期开始',
      //     timestamp: '2018-04-15',
      //     status: 'success'
      //   }
      // ],
    };
  },
};
</script>

<style lang="scss" scoped >
.log-box {
  position: absolute;
  top: calc(75% + 20px);
  left: calc(2.72rem + 20px);
  width: 3rem;
  height: calc(35% - 0.9rem - 30px);
  background: #28323e;
  border-radius: 10px;
  padding: 10px 15px;
  overflow-x: hidden;
  overflow-y: auto;
}
.form-box {
  .form-item {
    font-weight: 400;
    font-size: 14px;
    color: #bdbebf;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }
}
.timeline {
  // height: 3.5rem;
  overflow: auto;
  .timeline-item {
    display: flex;
    align-items: flex-start;
    padding-bottom: 20px;
    position: relative;
    color: #bdbebf;
    position: relative;
    font-size: 12px;
    .left-time {
      width: 30px;
    }
    .timeline-item-icon {
      margin: 0 20px;
      position: relative;
      z-index: 1;
      .el-icon-dot {
        width: 10px;
        height: 10px;
        background: #6d7581;
        border-radius: 50%;
        position: relative;
      }
    }
    .timeline-item-content {
      flex-shrink: 1;
      flex-grow: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-icon-check {
        font-size: 9px;
        color: #31c629;
      }
    }
    &.active {
      .timeline-item-icon {
        .el-icon-dot {
          border: 2px solid #b6f2f7;
          width: 10px;
          height: 10px;
          background: #03baca;
        }
      }
    }
    &:nth-last-of-type(1) {
      &::after {
        display: none;
      }
    }
    &::after {
      position: absolute;
      left: 54px;
      top: 2px;
      content: '';
      width: 2px;
      height: 100%;
      background: #6d7581;
      z-index: 0;
    }
  }
}
</style>