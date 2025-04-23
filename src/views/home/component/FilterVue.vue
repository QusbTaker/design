<!--
 * @Author: 刘小满
 * @Date: 2025-01-15 16:35:34
 * @Descripttion: 
-->
<template>
  <div class="filter flex_start_center">
    <div class="filter-item">
      <el-input
        v-model="searchForm.completeAddress"
        style="width: 2.5rem;"
        class="filter-item"
        placeholder="请输入位置"
        @input="handleInputSearch"
      ></el-input>
      <div class="popover">
        <!-- 地址列表 -->
        <search-result
          v-if="step === 1"
          :searchResult="searchResult"
          @selectItem="selectItem"
        ></search-result>
        <!-- 地址详情 -->
        <task-info
          :selectItem="selectItemInfo"
          @back="handleBack"
          v-if="step === 2"
        ></task-info>
      </div>
    </div>

    <el-select
      v-model="searchForm.fireType"
      placeholder="请选择救援类型"
      class="filter-item"
      style="width: 1.5rem;"
      @change="handleSearch"
      clearable
    >
      <el-option
        v-for="item in dict.type.fire_type"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-date-picker
      v-model="searchForm.createTime"
      placeholder="请选择日期"
      class="filter-item"
      value-format="yyyy-MM-dd"
      style="width: 2rem;"
      @change="handleSearch"
    >
    </el-date-picker>
    <el-input
      v-model="searchForm.name"
      style="width: 2rem;"
      class="filter-item"
      placeholder="请输入救援事件名称"
      @change="handleSearch"
    ></el-input>
  </div>
</template>

<script>
import SearchResult from './SearchResult.vue';
import { listTask } from '@/api/task';
import { debounce } from '@/utils';
import TaskInfo from './TaskInfo.vue';
export default {
  components: {
    SearchResult,
    TaskInfo,
  },
  props: {
    filterData: {
      type: Object,
      default: () => ({
        cities: [],
      }),
    },
  },
  dicts: ['fire_type', 'fire_level'],
  data() {
    return {
      searchForm: {
        completeAddress: '',
        fireType: '',
        createTime: '',
        name: '',
      },
      searchResult: [],
      timer: null,
      step: 1,
      selectItemInfo: {},
    };
  },
  methods: {
    handleSearch() {
      this.$emit('onSearch', {
        ...this.searchForm,
      });
    },
    handleInputSearch(value = '') {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        const searchValue = value.trim();
        if (!searchValue) {
          this.searchResult = [];
          return;
        }
        listTask({
          pageSize: 1000,
          completeAddress: searchValue,
        }).then((res) => {
          this.searchResult = res.rows;
        });
      }, 500);
    },
    selectItem(item) {
      this.selectItemInfo = item;
      this.step = 2;
      this.$emit('selectItem', item);
    },
    handleBack() {
      this.step = 1;
      this.selectItemInfo = {};
    },
  },
};
</script>

<style lang="scss" scoped >
.filter {
  position: absolute;
  z-index: 100;
  left: 10px;
  top: 10px;
  .filter-item {
    margin-right: 5px;
  }
  .popover {
    position: absolute;
    z-index: 100;
    left: 0px;
    top: 40px;
    background: #2c353e;
    width: 300px;
  }
}
</style>