<!--
 * @Author: 刘小满
 * @Date: 2025-01-15 15:53:42
 * @Descripttion: 系统信息组件
-->
<template>
  <div class="system-info"  v-if="taskList.length" >
    <div class="task-box">
      <div
        :class="['task-item', { active: item.id === activeTaskId }]"
        v-for="(item, index) in taskList"
        :key="index"
        v-if="index < 3"
        @click="handleTaskItemClick(item)"
      >
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="system-info-item" v-if="activeTaskId" >
      <div class="desc-item">
        <span>详细地址</span>
        <span>{{ taskInfo.completeAddress }}</span>
      </div>
      <div class="desc-item flex_start_center">
        <span>火情类型</span>
        <span><dict-tag
            :options="dict.type.fire_type"
            :value="taskInfo.fireType"
          /></span>
      </div>
      <div class="header-item">
        <span>火场数据</span>
        <span>{{ taskInfo.createTime }}</span>
      </div>
      <div class="data-item">
        <div class="item">
          <span>楼层高度</span>
          <p>100m</p>
        </div>
        <div class="item">
          <span>火场高度</span>
          <p>12m</p>
        </div>
        <div class="item">
          <span>火场宽度</span>
          <p>25m</p>
        </div>
        <div class="item">
          <span>火场面积</span>
          <p>300m2</p>
        </div>
        <div class="item">
          <span>火势大小</span>
          <p>
            <el-progress
              :percentage="80"
              :format="format"
              color="#EF4444"
              text-color="#EF4444"
            ></el-progress>
          </p>
        </div>
      </div>
      <div class="header-item">
        <span>火场视频</span>
      </div>
      <div class="video-item">
        <video
          src="https://media.w3.org/2010/05/sintel/trailer.webm"
          controls
        />
      </div>
      <div
        class="spyon-box"
        v-if="showDelivery"
      >
        <div class="title">
          救援方案
        </div>
        <div class="spyon-box-header flex_bw_center">
          <span> <i
              class="iconfont icon-a-ziyuan89"
              style="color: #35B6C3;font-size: 12px;"
            ></i> 救援无人机/{{ selectUavList.length }}架</span>
          <i
            class="iconfont icon-a-ziyuan99"
            style="cursor: pointer;"
            @click="addUav"
          ></i>
        </div>
        <div class="uav-list">
          <div
            class="uav-item"
            v-for="(i, idx) of selectUavList"
            :key="i.uavName"
          >
            <div class="name">
              {{ i.uavName + i.uavModel }}
            </div>
            <div class="desc desc-box">
              <div class="desc-box-item"><span>距离：</span><span>{{ (i.distance / 1000).toFixed(2) }}km</span></div>
              <div class="desc-box-item">
                <span>预计到达：</span>
                <span>{{ i.time }}分钟</span>
              </div>
            </div>
            <div class="desc">
              <el-select
                v-model="i.flyerId"
                size="mini"
                placeholder="请选择飞手"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in i.pilots"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"
                >
                </el-option>
              </el-select>
            </div>
            <i
              class="iconfont icon-a-ziyuan96"
              @click="delUav(idx)"
            ></i>
          </div>
        </div>
      </div>
      <div class="button-item flex_bw_center">
        <el-button
          type="primary"
          v-if="!showDelivery"
          @click="showDelivery = true"
          style="width: 70%;"
        >
          生成救援方案
        </el-button>
        <el-button
          v-else
          type="primary"
          style="width: 70%;"
        >
          确定方案下发给飞手
        </el-button>
        <el-button style="width: 30%;color: #fff;">
          结束任务
        </el-button>
      </div>
    </div>
    <!-- 选择无人机 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
    >
      <el-table
        ref="multipleTable"
        :data="uavList"
        current-row-key="id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="50"
          align="center"
        />
        <el-table-column
          align="center"
          key="uavName"
          prop="uavName"
        >
          <template slot-scope="{ row }">{{ `${row.uavName}(${row.uavModel})` }}</template>
        </el-table-column>
      </el-table>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          :loading="loading"
          @click="chose"
        >确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils';
export default {
  name: 'SystemInfo',
  props: {
    taskList: {
      type: Array,
      default() {
        return [];
      },
    },
    uavList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  dicts: ['fire_type'],
  data() {
    return {
      activeNames: ['1'],
      selectUavList: [],
      pilotList: [],
      open: false,
      title: '选择无人机',
      loading: false,
      activeTaskId: '',
      showDelivery: false,
      taskInfo: {},
    };
  },
  watch: {
    taskList: {
      immediate: true,
      handler(val) {
        if (val.length) {
          this.activeTaskId = val[0].id;
          this.taskInfo = val[0];
        }
      },
    },
  },
  methods: {
    format(percentage) {
      return `${percentage > 60 ? '大火' : `小火`}`;
    },
    handleChange(val) {
      console.log(val);
    },
    addUav() {
      this.open = true;
      this.tabSelect = deepClone(this.selectUavList);
      this.$nextTick(() => {
        this.tabSelect.forEach((row) => {
          // console.log('this.$refs', JSON.parse(JSON.stringify(this.$refs)));
          this.$refs.multipleTable.toggleRowSelection(row, true);
        });
      });
    },
    cancel() {
      this.open = false;
      this.$refs.multipleTable.clearSelection();
    },

    chose() {
      this.selectUavList = deepClone(this.tabSelect);
      this.open = false;
      this.$refs.multipleTable.clearSelection();
    },
    delUav(idx) {
      this.selectUavList.splice(idx, 1);
    },
    handleSelectionChange(arr) {
      this.tabSelect = deepClone(arr);
    },
    handleTaskItemClick(row) {
      if (row.id === this.activeTaskId) {
        this.activeTaskId = '';
        this.taskInfo = {};
      } else {
        this.activeTaskId = row.id;
        this.taskInfo = row;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.system-info {
  z-index: 1000;
  position: absolute;
  top: 10px;
  right: 10px;
  width: 340px;
  // max-height: 70vh;
  // background-color: #1e2329;
  color: #fff;
  box-sizing: border-box;
  overflow-y: auto;
  .desc-item {
    font-size: 12px;
    margin-bottom: 5px;
    span {
      &:nth-of-type(1) {
        color: #becbd8;
        margin-right: 10px;
      }
      &:nth-of-type(2) {
        color: #fff;
      }
    }
  }
  .task-box {
    width: 3.4rem;
    background: #282f33;
    box-shadow: 0rem 0rem 0rem 0rem rgba(0, 0, 0, 0.19);
    border-radius: 0.1rem;
    padding: 0.1rem;
    .task-item {
      line-height: 35px;
      color: #aeb5b7;
      background: #313b43;
      border-radius: 0.05rem;
      margin-bottom: 0.1rem;
      padding: 0 10px;
      cursor: pointer;
      &:nth-last-of-type(1) {
        margin-bottom: 0;
      }
      &.active {
        background: #35b6c3;
        color: #fff;
        font-weight: bold;
      }
    }
  }
  .system-info-item {
    background: #282f33;
    border-radius: 0.1rem;
    width: 3.4rem;
    padding: 15px;
    margin-top: 2px;
    .desc-item {
      font-size: 12px;
      color: #aeb5b7;
    }
  }
  .header-item {
    font-size: 14px;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 15px 0 10px;
    span {
      &:nth-of-type(1) {
        color: #edc319;
      }
      &:nth-of-type(2) {
        color: #616871;
        font-size: 12px;
      }
    }
  }
  .data-item {
    display: grid;
    gap: 5px;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 50px 50px;
    .item {
      background: #333a3e;
      border-radius: 4px;
      padding: 5px;
      box-sizing: border-box;
      span {
        font-weight: 400;
        font-size: 12px;
        color: #9097a4;
      }
      p {
        font-weight: 400;
        font-size: 14px;
        color: #ffffff;
        margin: 0px 0px;
        padding: 0px;
        line-height: 18px;
      }
      &:nth-last-of-type(1) {
        grid-column-start: 2;
        grid-column-end: 4;
      }
    }
  }
  .video-item {
    width: 100%;
    height: 100%;
    video {
      width: 100%;
    }
  }
  .button-item {
    margin-top: 10px;
  }
  .spyon-box {
    color: #becbd8;
    .title {
      font-weight: bold;
      font-size: 18px;
      color: #ffffff;
      margin: 15px 0;
    }
    .uav-list {
      .uav-item {
        position: relative;
        margin-top: 10px;
        background: #313b43;
        padding: 14px 18px;
        .name {
          color: #ced1d6;
        }
        .desc {
          font-size: 12px;
          color: #9097a4;
          margin-top: 10px;
          span {
            margin-right: 15px;
          }
          &.desc-box {
            display: flex;
            gap: 10px;
            justify-content: space-between;
            .desc-box-item {
              background: #282f33;
              display: flex;
              align-items: center;
              flex-direction: column;
              width: 50%;
              padding: 5px;
              span {
                text-align: left;
                color: #9097a4;
                width: 100%;
                margin-right: 0;
                margin-left: 5px;
                &:nth-of-type(2) {
                  color: #fff;
                }
              }
            }
          }
        }
        .icon-a-ziyuan96 {
          position: absolute;
          width: 16px;
          height: 16px;
          top: -3px;
          right: -5px;
          color: #fff;
          background: #ff706a;
          display: inline-block;
          border-radius: 50%;
          font-size: 10px;
          text-align: center;
          line-height: 16px;
          // transform: translateY(-50%);
          cursor: pointer;
        }
      }
    }
  }
}
</style> 