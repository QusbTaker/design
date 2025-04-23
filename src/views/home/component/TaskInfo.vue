<template>
  <div class="task-info">
    <span
      class="back-btn flex_start_center"
      @click="handleBack"
    >
      <i class="el-icon-arrow-left"></i>
      返回
    </span>
    <div class="map-info-window">
      <div class="info-header">
        <div class="title">{{selectItem.landmark}}</div>
        <div class="address">{{selectItem.address || '暂无地址'}}</div>
      </div>
      <div class="info-body">
        <div class="info-item">
          <span class="label">救援名称：</span>
          <span class="value">{{selectItem.name || '未知'}}</span>
        </div>
        <div class="info-item">
          <span class="label">起火具体地址：</span>
          <span class="value">{{selectItem.completeAddress || '未知'}}</span>
        </div>
        <div class="info-item">
          <span class="label">开始救援时间：</span>
          <span class="value">{{selectItem.createTime || '未知'}}</span>
        </div>
        <div
          class="info-item"
          v-if="selectItem.taskStatus === '1'"
        >
          <span class="label">救援结束时间：</span>
          <span class="value">{{selectItem.endTime || '未知'}}</span>
        </div>
        <div class="info-item">
          <span class="label">参与救援单位：</span>
          <span class="value">{{selectItem.deptName || '未知'}}</span>
        </div>
      </div>
      <div class="info-footer">
        <button
          class="detail-btn"
          @click="handleDetail"
        >查看详情</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectItem: {
      type: Object,
    },
  },
  methods: {
    handleBack() {
      this.$emit('back');
    },
    handleDetail() {
      if (this.selectItem.taskStatus === '1') {
        this.$router.push(`/task/detail?taskId=${this.selectItem.id}`);
      } else {
        this.$router.push(`/trend?taskId=${this.selectItem.id}`);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.task-info {
  .back-btn {
    margin: 10px 0 10px 10px;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
  }
  .map-info-window {
    background: #2c353e;
    color: #fff;
    border-radius: 4px;
    padding: 0;
    width: 100%;
  }
  .info-header {
    padding: 10px 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .info-header .title {
    font-size: 16px;
    margin-bottom: 4px;
  }
  .info-header .address {
    font-size: 12px;
    color: #becbd8;
  }
  .info-body {
    padding: 10px 15px;
  }
  .info-body .info-item {
    margin-bottom: 10px;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
  }
  .info-body .info-item .label {
    color: #fff;
    white-space: nowrap;
  }
  .info-body .info-item .value {
    color: #becbd8;
    margin-left: 5px;
    text-align: right;
  }
  .info-footer {
    padding: 10px 15px;
    text-align: left;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  .detail-btn {
    background: #00abba;
    color: #fff;
    border: none;
    padding: 5px 15px;
    border-radius: 3px;
    cursor: pointer;
  }
  .detail-btn:hover {
    background: #008c98;
  }
}
</style>