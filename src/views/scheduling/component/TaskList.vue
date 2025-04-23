<!--
 * @Author: 刘小满
 * @Date: 2025-01-21 10:27:08
 * @Descripttion: 
-->
<template>
  <div class="task-box">
    <div class="block_39">
      <el-select
        style="width: 100%;"
        :value="taskInfo ? taskInfo.id : ''"
        @change="taskChange"
        size="mini"
      >
        <el-option
          v-for="i of taskList"
          :label="i.name"
          :value="i.id"
          :key="i.id"
        ></el-option>
      </el-select>
      <div class="paragraph_6">救援类型： <dict-tag
          :options="dict.type.fire_type"
          :value="taskInfo.fireType"
        /></div>
      <div class="paragraph_6">具体地址：{{ taskInfo.completeAddress }}</div>
      <div>
        <el-button
          size="mini"
          @click="endTask"
          style="width: 100%;color: #0FA6B4;margin-top: 10px;"
        >
          结束任务
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { deepClone } from '../../../utils';
import { updateTask } from '@/api/task';
export default {
  props: {
    taskInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    taskList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  dicts: ['fire_type'],
  methods: {
    taskChange(val) {
      const row = deepClone(this.taskList.find((el) => el.id === val));
      this.$emit('handleTask', row);
    },
    endTask() {
      this.$confirm('确定结束任务吗？', '提示').then(() => {
        updateTask({ id: this.taskInfo.id, taskStatus: 1 }).then((res) => {
          this.$message.success('结束任务成功');
          this.$emit('handleEndTask', {});
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped >
.task-box {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #282f33;
  width: 2.72rem;
  height: 18%;
  border-radius: 10px;
  padding: 0px;
  overflow: hidden;
  .block_39 {
    padding: 10px;
    .paragraph_6 {
      color: rgba(158, 169, 186, 1);
      font-size: 12px;
      font-weight: normal;
      text-align: left;
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
    }
  }
}
</style>