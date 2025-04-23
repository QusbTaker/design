<!--
 * @Author: 刘小满
 * @Date: 2025-01-15 15:42:13
 * @Descripttion: 
-->
<template>
  <div class="app-main">
    <trend-content v-if="taskList.length > 0" />
    <empty-vue v-else></empty-vue>
  </div>
</template>

<script>
import TrendContent from './component/TrendContent.vue';
import EmptyVue from '../flow/component/Empty.vue';
import { listTask } from '@/api/task';
export default {
  components: {
    TrendContent,
    EmptyVue,
  },
  data() {
    return {
      taskList: [],
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      const res = await listTask({ pageSize: 1000, taskStatus: 0 });
      this.taskList = res.rows;
    },
  },
};
</script>

<style>
.app-main {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>