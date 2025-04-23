<template>
  <div class="home app-main" >
    <bai-du-map></bai-du-map>
  </div>
</template>

<script>
import BaiDuMap from './component/BaiDuMap.vue';
export default {
  components: {
    BaiDuMap,
  }
}
</script>

<style lang="scss" scoped >
.home {
  width: 100%;
  height: 100%;
}
</style>