<!--
 * @Author: 刘小满
 * @Date: 2025-01-16 10:10:43
 * @Descripttion: 
-->
<template>
  <div class="situation">
    <el-collapse
      v-model="activeNames"
      @change="handleChange"
    >
      <el-collapse-item
        title="救援情况"
        name="1"
      >
        <div class="situation-item">
          <div>天气情况   </div>
          <div>温度：13℃</div>
          <div>天气：多云</div>
          <div>风级：西北风2-3级</div>
          <div>湿度：72%</div>
        </div>
        <div class="situation-item">
          <div>起火点情况    </div>
          <div>建筑年份：13℃ </div>
          <div>建筑用途：商住两用</div>
          <div>消防系统：自动报警</div>
          <div>危化品情况：无</div>
          <div>安全责任人：178-6548-4444</div>
        </div>
        <div class="situation-item">
          <div>救援资源</div>
          <div>资源类型：2022年</div>
          <div>人员值守：张无忌</div>
          <div>灭火器：12个</div>
          <div>消防车辆：5辆</div>
          <div>消防无人机：2架</div>
          <div>架消防水带：4条</div>
        </div>
        <div class="situation-item">
          <div>消防水源   </div>
          <div>装备类型：室外消火栓</div>
          <div>当前压力：0.17MPa </div>
          <div>位置：6好公寓门口</div>
          <div>当前状态：可用</div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeNames: ['1'],
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
.situation {
  position: absolute;
  left: 10px;
  top: calc(16% - 10px);
  z-index: 100;
  width: 244px;
  .situation-item {
    border-bottom: 1px solid #404A60;
    padding: 15px 0;
    &:nth-of-type(1) {
      padding-top: 0px;
    }
    &:nth-last-of-type(1) {
      padding-bottom: 0px;
      border-bottom: 0px;
    }
  }
}
</style>