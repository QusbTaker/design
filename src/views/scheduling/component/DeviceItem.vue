<template>
  <div class="device-item">
    <div class="name">{{ row.uavName }}</div>
    <div class="desc">
      型号：{{ row.uavModel }}
    </div>
    <div class="desc">飞手：{{ row.flyerName }}</div>
    <div
      class="desc"
      v-if="row.distance < 0.01 && row.distance > 0"
    >
      已到达着火点
    </div>
    <div
      class="desc info"
      v-if="row.receiveTags != 0"
    >距着火点{{ row.distance }}km，预计{{ (row.distance * 1000 / 15 / 60).toFixed(1) }}分钟后到达</div>
  </div>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    handleAutoFlight(row) {
      console.log('row', row);
      this.$router.push({
        path: '/flow/routePlanning',
        query: { taskId: row.taskId, uavId: row.uavId },
      });
    },
    handleManualFlight(row) {
      // Handle manual flight logic
      this.$emit('handleManualFlight', row);
    },
  },
};
</script>

<style lang="scss" scoped>
.device-item {
  background: linear-gradient(90deg, #32434d, #2d3b48, #2c3942);
  border-radius: 7px;
  border: 1px solid #38454f;
  margin-bottom: 10px;
  padding: 0.14rem 0.17rem;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    border: 1px solid #3f5d80;
    background: linear-gradient(90deg, #34485e 0%, #2a4b73 0%, #27476d 100%);
  }
  .name {
    margin-bottom: 0.1rem;
  }
  .desc {
    font-weight: 400;
    font-size: 12px;
    color: #d7dbdd;
    line-height: 20px;
    &.info {
      color: #2bc7d5;
      margin-top: 5px;
    }
  }
  .buttons {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    .el-button {
      width: 50%;
      font-size: 0.14rem;
    }
  }
}
</style>