<template>
  <div class="scheme-box">
    <div class="header">
      <el-button
        size="mini"
        style="color: #fff;padding: 5px 8px;font-size: 12px;"
        @click="$emit('back')"
      >
        <i
          class="iconfont icon-a-ziyuan1091"
          style="font-size: 12px;vertical-align: text-top;"
        ></i>
        返回</el-button>
      <div class="address-title">
        {{ taskInfo.task.landmark }}
      </div>
      <div class="address-desc">
        {{ taskInfo.task.address }}
      </div>
    </div>
    <el-divider style="margin: 10px 0;"></el-divider>
    <div class="scheme-content">
      <div class="info-item flex_bw_center">
        <span>任务名称</span>
        <span>{{ taskInfo.task.name }}</span>
      </div>
      <div class="info-item flex_bw_center">
        <span>详细地址</span>
        <span>{{ taskInfo.task.specificAddress }}</span>
      </div>
      <div class="info-item flex_bw_center">
        <span>火情类型</span>
        <span><dict-tag
            :options="dict.type.fire_type"
            :value="taskInfo.task.fireType"
          ></dict-tag></span>
      </div>
    </div>
    <div class="spyon-box">
      <div class="title">
        侦查方案
      </div>
      <div class="spyon-box-header flex_bw_center">
        <span> <i
            class="iconfont icon-a-ziyuan89"
            style="color: #35B6C3;font-size: 12px;"
          ></i> 侦查无人机/{{ selectUavList.length }}架</span>
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
            <div class="desc-box-item">
              <span>距离：</span>
              <span>{{ (i.distance / 1000).toFixed(2) }}km</span>
            </div>
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
      <div>
        <el-button
          type="primary"
          style="width: 100%;margin: 15px 0;"
          @click="handlerSubmit"
        >确定侦察方案并下发给飞手</el-button>
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
import { addDistribution } from '@/api/task';
import { deepClone } from '../../../utils';
export default {
  dicts: ['fire_type', 'fire_level'],
  props: {
    taskInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    uavList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      form: {
        landmark: '',
        cityCode: '',
        cityName: '',
        completeAddress: '',
        countryCode: '',
        countryName: '',
        districtCode: '',
        districtName: '',
        fireLevel: '',
        fireType: '',
        name: '',
        provinceCode: '',
        provinceName: '',
        referenceRescuePlan: '',
        specificAddress: '',
        subDistrictCode: '',
        subDistrictName: '',
        targetHeight: 0,
        targetLatitude: 0,
        targetLongitude: 0,
      },
      referenceRescuePlan: [],
      title: '选择无人机',
      open: false,
      selectUavList: [],
      tabSelect: [],
      loading: false,
    };
  },
  mounted() {
    const info = this.taskInfo.planDetails[0];
    console.log('info', info);
    const arr = this.uavList
      .filter((el) => el.uavModel == info.uavModel)
      .sort((a, b) => a.distance - b.distance);
    this.selectUavList = arr.slice(0, info.number);
  },
  methods: {
    delUav(idx) {
      this.selectUavList.splice(idx, 1);
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
    handleSelectionChange(arr) {
      this.tabSelect = deepClone(arr);
    },
    handlerSubmit() {
      const params = [];
      let flag = true;
      flag = this.selectUavList.every((el) => el.flyerId);
      if (!flag) {
        this.$message.error({
          message: '请选择飞手',
        });
        return;
      }
      this.selectUavList.forEach((el) => {
        params.push({
          taskId: this.taskInfo.task.id,
          uavId: el.id,
          sn: el.sn,
          receiveTags: 0,
          flyerId: el.flyerId,
        });
      });
      this.loading = true;
      addDistribution(params)
        .then((res) => {
          console.log('任务下发成功', res.data);
          this.loading = false;
          this.$message.success({
            message: '任务下发成功',
          });
          this.$emit('success');
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped >
.scheme-box {
  max-height: 600px;
  overflow-y: auto;
  .header {
    padding: 15px 18px 0;
    .address-title {
      font-size: 16px;
      color: #ffffff;
      line-height: 30px;
      margin-top: 10px;
    }
    .address-desc {
      font-weight: 400;
      font-size: 12px;
      color: #becbd8;
    }
  }
  .scheme-content {
    padding: 0 18px;
    .info-item {
      padding: 8px 0;
      border-bottom: 1px solid #384044;
      color: #becbd8;
      font-size: 14px;
      span {
        &:nth-of-type(2) {
          color: #ffffff;
        }
      }
    }
  }
  .spyon-box {
    padding: 0 18px;
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
              background: #282F33;
              display: flex;
              align-items: center;
              flex-direction: column;
              width: 50%;
              padding: 5px;
              span {
                text-align: left;
                color: #9097A4;
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