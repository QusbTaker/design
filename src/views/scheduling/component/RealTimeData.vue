<!--
 * @Author: 刘小满
 * @Date: 2025-01-21 10:27:08
 * @Descripttion: 
-->
<template>
  <div class="real-time">
    <div class="header flex_bw_center">
      <span class="name">火场实时数据</span>
      <span class="time">2025.03.05 12:12:12</span>
    </div>
    <div class="list">
      <div class="item">
        <span>楼层高度</span>
        <p>100m</p>
      </div>
      <div class="item">
        <span>火场高度</span>
        <p>12m</p>
      </div>
      <div class="item">
        <span>火场宽度</span>
        <p>25m</p>
      </div>
      <div class="item">
        <span>火场面积</span>
        <p>300m2</p>
      </div>
      <div class="item">
        <span>火势大小</span>
        <p>
          <el-progress
            :percentage="80"
            :format="format"
            color="#EF4444"
            text-color="#EF4444"
          ></el-progress>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    format(percentage) {
      return `${percentage > 60 ? "大火" : `小火`}`;
    },
  },
};
</script>

<style lang="scss" scoped >
.real-time {
  position: absolute;
  top: calc(70% + 20px);
  left: 10px;
  background: #282f33;
  width: 272px;
  height: calc(30% - 30px);
  border-radius: 10px;
  padding: 10px;
  .header {
    .name {
      font-weight: 400;
      font-size: 14px;
      color: #edc319;
      line-height: 27px;
    }
    .time {
      font-weight: 400;
      font-size: 12px;
      color: #616871;
    }
  }
  .list {
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: max-content;
    .item {
      background: #333a3e;
      border-radius: 4px;
      padding: 10px;
      box-sizing: border-box;
      span {
        font-weight: 400;
        font-size: 12px;
        color: #9097a4;
      }
      p {
        font-weight: 400;
        font-size: 14px;
        color: #ffffff;
        margin: 10px 0;
        padding: 0px;
      }
      &:nth-last-of-type(1) {
        grid-column-start: 2;
        grid-column-end: 4;
      }
    }
  }
}
</style>