<template>
  <el-dialog
    title="分配无人机"
    :visible="visible"
    append-to-body
    lock-scroll
    width="800px"
    @close="close"
  >
    <div class="device-list">
      <div
        class="device-item"
        v-for="i of deviceList"
        :key="i.sn"
      >
        <i class="iconfont icon-a-ziyuan4"></i>
        <div class="info">
          <div>{{ i.nickname }}</div>
          <div class="number">ID:{{ i.sn }}</div>
        </div>
        <el-checkbox
          :checked="bindList.includes(i.id)"
          @change="(val) => change(val, i)"
        ></el-checkbox>
      </div>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="close">取 消</el-button>
      <el-button
        @click="submit"
        type="primary"
      >确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listUav, userBoundFind, userBoundEdit } from '@/api/organization/device';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    row: {
      type: Object | null,
      default: null,
    },
  },
  data() {
    return {
      checkList: [1],
      bindList: [],
      deviceList: [],
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.getDetail();
      } else {
        this.deviceList = [];
        this.bindList = [];
      }
    },
  },
  methods: {
    getDetail() {
      userBoundFind({ userId: this.row.userId }).then((response) => {
        this.bindList = response.boundUavIdList;
        this.deviceList = response.allUavList;
      });
    },
    close() {
      this.$emit('update:visible', false);
    },
    change(val, i) {
      if (val) {
        this.bindList.push(i.id);
      } else {
        this.bindList = this.bindList.filter((el) => el !== i.id);
      }
    },
    submit() {
      const params = {
        userId: this.row.userId,
        uavIds: this.bindList.join(','),
      };
      userBoundEdit(params).then((response) => {
        this.$message({
          type: 'success',
          message: '绑定成功',
        });
        this.close();
        this.$emit('reload');
      });
    },
  },
};
</script>

<style lang="scss" scoped >
.device-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  min-height: 100px;
  max-height: 400px;
  overflow-y: auto;
  .device-item {
    width: calc(33.33% - 10px);
    background: #2a333b;
    padding: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 14px;
    height: 65px;
    i {
      font-size: 30px;
      color: #03baca;
      margin-right: 10px;
    }
    .info {
      flex-grow: 1;
      .number {
        color: #8492a1;
      }
    }
  }
}
</style>