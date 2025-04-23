<template>
  <div>
    <routes-map  v-if="taskInfo" :taskInfo="taskInfo"></routes-map>
    <task-detail @save="saveWayLine"></task-detail>
    <take-off
      :visible.sync="visible"
      :taskType="2"
      :taskId="$route.query.taskId"
      :uavId="$route.query.uavId"
      :wayLineId="wayLineInfo.id"
    ></take-off>
  </div>
</template>

<script>
import RoutesMap from './component/RoutesMap.vue';
import TakeOff from './component/TakeOff.vue';
import TaskDetail from './component/TaskDetail.vue';
import { getTask } from '@/api/task';
export default {
  data() {
    return {
      visible: false,
      wayLineInfo: {},
      taskInfo: null,
    };
  },
  components: { TaskDetail, RoutesMap, TakeOff },
  created() {
    getTask(this.$route.query.taskId).then((res) => {
      this.taskInfo = res.data;
    });
  },
  methods: {
    saveWayLine(wayLineInfo) {
      this.wayLineInfo = wayLineInfo;
      this.visible = true;
    },
  },
};
</script>

<style>
</style>