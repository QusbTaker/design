<!--
 * @Author: 刘小满
 * @Date: 2025-01-21 11:38:14
 * @Descripttion: 
-->
<template>
  <div class="task-item">
    <div class="name">2024.12.30救援</div>
    <div class="desc">
      救援类型：山林救援
    </div>
    <div class="desc">救援具体地址：青岛市市北区嘉定路五号 院A座101 </div>
    <div class="desc">
      救援开始时间：2024.12.20 12:12:12
    </div>
  </div>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      default() {
        return {}
      }
    }
  }
};
</script>

<style lang="scss" scoped >
.task-item {
  background: linear-gradient(90deg, #32434d, #2d3b48, #2c3942);
  border-radius: 7px;
  border: 1px solid #38454f;
  margin-top: 12px;
  padding: 14px 17px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    border: 1px solid #3f5d80;
    background: linear-gradient(90deg, #34485e 0%, #2a4b73 0%, #27476d 100%);
  }
  .name {
    margin-bottom: 10px;
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
}
</style>