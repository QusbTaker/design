<!--
 * @Author: 刘小满
 * @Date: 2025-01-20 15:39:56
 * @Descripttion: 
-->
<template>
  <div>
    <scheduling-info @refresh="getTaskList" v-if="taskList.length > 0"></scheduling-info>
    <empty-vue v-else></empty-vue>
  </div>
</template>

<script>
import SchedulingInfo from './component/SchedulingInfo.vue';
import EmptyVue from '../flow/component/Empty.vue';
import { listTask } from '@/api/task';
export default {
  components: {
    EmptyVue,
    SchedulingInfo,
  },
  data() {
    return {
      taskList: [],
    };
  },
  created() {
    this.getTaskList();
  },
  methods: {
    getTaskList() {
      listTask({ pageSize: 1000, taskStatus: 0 }).then((res) => {
        this.taskList = res.rows;
      });
    },
  },
};
</script>

<style lang="scss" scoped >
.app-main {
  padding: 15px;
}
</style>