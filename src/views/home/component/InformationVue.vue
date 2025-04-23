<!--
 * @Author: 刘小满
 * @Date: 2025-01-15 16:35:34
 * @Descripttion: 
-->
<template>
  <div class="info-list flex_end_center" >
    <div class="info-item" v-for="item in infoData.droneStats" :key="item.name" >
      <div class="title">{{ item.name }}</div>
      <div class="num" >{{ item.value }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    infoData: {
      type: Object,
      default: () => ({
        droneStats: []
      })
    }
  }
};
</script>

<style lang="scss" scoped >
.info-list {
  position: absolute;
  right: 0px;
  top: 10px;
  z-index: 100;
  .info-item {
    background-color: rgba($color: #000000, $alpha: 0.6);
    // height: 0.65rem;
    padding: 0 0.1rem 0.1rem;
    font-size: 0.14rem;
    color: #fff !important;
    margin-right: 0.1rem;
    border-radius: 5px;
    .title {
      margin: 0.1rem 0  0.05rem;
    }
    .num {
      font-size: 0.18rem;  
      font-weight: bold;
    }
  }
}
</style>