<!--
 * @Author: 刘小满
 * @Date: 2025-01-15 10:07:52
 * @Descripttion: 
-->
<template>
  <div class="home">
    首页
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      // 版本号
      version: "3.8.6"
    };
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    }
  }
};
</script>

<style scoped lang="scss">
.home {
}
</style>

