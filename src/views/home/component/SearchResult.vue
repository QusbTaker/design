<template>
  <div class="search-result">
    <div
      class="search-result-item flex_bw_center"
      v-for="(item, index) of searchResult"
      :key="item.id"
      @click="handleClick(item)"
    >
      <div class="left flex_start_start">
        <div class="num">{{ index + 1 }}、</div>
        <div class="info">
          <div class="search-result-item-name">{{ item.landmark }}</div>
          <div class="search-result-item-address">{{ item.completeAddress }}</div>
        </div>
      </div>
      <div class="right">
        <img
          v-if="item.taskStatus === '1'"
          src="@/assets/images/task-completed1.png"
          alt=""
        >
        <img
          v-else-if="item.taskStatus === '0'"
          src="@/assets/images/task-inprogress1.png"
          alt=""
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    searchResult: {
      type: Array,
    },
  },
  methods: {
    handleClick(item) {
      this.$emit('selectItem', item);
    },
  },
};
</script>

<style lang="scss" scoped>
.search-result {
  max-height: 400px;
  overflow-y: auto;
  .search-result-item {
    padding: 10px 15px;
    border-bottom: 1px solid #384044;
    cursor: pointer;
    .search-result-item-name {
      font-size: 0.14rem;
      color: #fff;
    }
    .search-result-item-address {
      font-size: 0.12rem;
      color: #BECBD8;
    }
    .right {
      margin-left: 10px;
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>
    