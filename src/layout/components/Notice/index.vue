<template>
  <div class="notice-box">
    <el-popover
      width="300"
      trigger="hover"
      placement="bottom-end"
      popper-class="notice-popover"
    >

      <i
        slot="reference"
        class="el-icon-bell"
      ></i>
      <div class="notice-header">
        <span>消息通知</span>
        <span class="clear">清除</span>
      </div>
      <div class="notice-list">
        <div class="notice-item" v-for="i in 2" >
          <div style="display: flex;justify-content: space-between;" >
            <div class="tag">异常提醒</div>
            <div class="time">3分钟前</div>
          </div>
          <div class="content">无人机01（id：1212412121）无法正常
            充电，请及时维修</div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'Notice',
  data() {
    return {
      noticeList: [
        {
          title: '系统通知',
          content: '欢迎使用',
        },
      ],
    };
  },
  methods: {
    showNotice() {
      this.$notify({
        title: '系统通知',
        dangerouslyUseHTMLString: true,
      });
    },
  },
};
</script>

<style lang="scss" scoped >
.notice-box {
  color: #fff;
  .el-icon-bell {
    cursor: pointer;
  }
}
</style>