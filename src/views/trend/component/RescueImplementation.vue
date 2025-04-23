<!--
 * @Author: 刘小满
 * @Date: 2025-01-16 10:10:43
 * @Descripttion: 
-->
<template>
  <div class="implementation">
    <el-collapse
      v-model="activeNames"
      @change="handleChange"
    >
      <el-collapse-item
        title="救援实施"
        name="1"
        class="implementation-item"
      >
        <el-collapse
          v-model="activeNames1"
          @change="handleChange"
          class="implementation-box"
        >
          <el-collapse-item
            :title="'消防无人机' + distributionList.length  + '架'"
          >
            <!-- <div>
              <div>天气情况 </div>
              <div>温度：13℃</div>
              <div>天气：多云</div>
              <div>风级：西北风2-3级</div>
              <div>湿度：72%</div>
            </div> -->
            <plan-item
              :planList="distributionList"
              :taskInfo="taskInfo"
            ></plan-item>
          </el-collapse-item>
        </el-collapse>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import PlanItem from './PlanItem.vue';
export default {
  components: {
    PlanItem,
  },
  props: {
    distributionList: {
      type: Array,
      default: () => [],
    },
    taskInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      activeNames: ['1'],
      activeNames1: [1, 2, 3],
    };
  },
  methods: {
    handleChange(val) {
      console.log(val);
    },
  },
};
</script>

<style lang="scss" scoped >
.implementation {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 100;
  width: 244px;
  .implementation-item {
    ::v-deep .el-collapse-item__wrap {
      padding: 0px;
    }
    .implementation-box {
      ::v-deep .el-collapse-item__wrap {
        padding: 15px 15px 0 15px;
      }
    }
  }
}
</style>