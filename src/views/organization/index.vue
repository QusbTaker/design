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
      <personnel-vue v-if="activeName === 'personnel'"></personnel-vue>
      <dept-vue v-if="activeName === 'dept'"></dept-vue>
    </div>
  </div>
</template>

<script>
import PersonnelVue from './components/Personnel.vue';
import DeptVue from './components/Dept.vue';
import { checkPermi } from '@/utils/permission';
export default {
  data() {
    return {
      activeName: 'personnel',
    };
  },
  components: {
    PersonnelVue,
    DeptVue,
  },
  computed: {
    activeList() {
      const list = [
        { label: '单位管理', name: 'dept', auth: ['system:dept:list'] },
        { label: '人员管理', name: 'personnel', auth: ['system:user:list'] },
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