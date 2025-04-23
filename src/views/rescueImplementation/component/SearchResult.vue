<template>
  <div class="address-list">
    <div
      class="address-item"
      v-for="(i, idx) of data"
      @click="handlerClick(i)"
    >
      <div>
        {{ idx + 1 + '、' }}{{ i.title }}
      </div>
      <div class="address">
        {{ i.address }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    handlerClick(row) {
      this.$emit('select', row)
    }
  }
};
</script>

<style lang="scss" scoped >
.address-list {
  max-height: 600px;
  overflow-y: auto;
  .address-item {
    padding: 10px;
    font-weight: 400;
    font-size: 14px;
    border-bottom: 1px solid #384044;
    cursor: pointer;
    .address {
      font-size: 12px;
      color: #becbd8;
      margin-top: 8px;
      padding-left: 18px;
    }
  }
}
</style>