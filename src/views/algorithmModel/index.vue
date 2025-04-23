<!--
 * @Author: 刘小满
 * @Date: 2024-09-26 09:29:19
 * @Descripttion: 
-->
<template>
  <div class="app-container">
    <!-- tab切换 -->
    <el-tabs
      v-model="activeName"
      type="card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="i of activeList"
        :label="i.label"
        :name="i.name"
        :key="i.name"
      ></el-tab-pane>
    </el-tabs>
    <div>
      <programme-vue v-if="activeName === 'programme'"></programme-vue>
    </div>
  </div>
</template>

<script>
import ProgrammeVue from './component/Programme.vue';
import { checkPermi } from '@/utils/permission';
export default {
  data() {
    return {
      activeName: 'programme',
    };
  },
  components: {
    ProgrammeVue,
  },
  computed: {
    activeList() {
      const list = [
        { label: '救援模板', name: 'programme', auth: ['system:dept:list'] },
        { label: '路径规划模型', name: 'dept1', auth: ['system:user:list'] },
        { label: '火焰识别算法', name: 'dept2', auth: ['system:user:list'] },
        { label: '无人机协同算法', name: 'dept3', auth: ['system:user:list'] },
      ];
      return list.filter((el) => checkPermi(el.auth));
    },
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style lang="scss" scoped >
</style>