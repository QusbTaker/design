<!--
 * @Author: 刘小满
 * @Date: 2025-01-20 15:39:56
 * @Descripttion: 
-->
<template>
  <div>
    <control-vue
      @refresh="getTaskList"
      v-if="taskList.length > 0"
    ></control-vue>
    <empty-vue v-else></empty-vue>
  </div>
</template>

<script>
import ControlVue from './component/Control.vue';
import EmptyVue from './component/Empty.vue';
import { listTask } from '@/api/task';
export default {
  components: {
    EmptyVue,
    ControlVue,
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