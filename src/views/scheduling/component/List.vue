<!--
 * @Author: 刘小满
 * @Date: 2025-01-21 10:23:33
 * @Descripttion: 
-->
<template>
  <div class="power">
    <!-- tag切换 -->
    <div class="tab-list">
      <div
        :class="{ 'tab-item': true, active: tabIndex === 0 }"
        @click="tabIndex = 0"
      >
        <span>救火力量</span>
      </div>
      <div
        :class="{ 'tab-item': true, active: tabIndex === 1 }"
        @click="tabIndex = 1"
      >
        <span>救援方案</span>
      </div>
    </div>
    <!-- 力量 -->
    <!-- 力量 -->
    <div>
      <div
        class="list"
        v-if="tabIndex === 0"
      >
        <device-item
          v-for="i of deviceList"
          :key="i"
          :row="i"
          :taskInfo="taskInfo"
        ></device-item>
      </div>
      <div
        class="list"
        v-if="tabIndex === 1"
      >
        <plan-item
          v-for="i of taskUavList"
          :taskInfo="taskInfo"
          :planInfo="i"
        ></plan-item>
      </div>
    </div>
  </div>
</template>

<script>
import DeviceItem from './DeviceItem.vue';
import PlanItem from './PlanItem.vue';
export default {
  props: {
    taskInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    deviceList: {
      type: Array,
      default() {
        return [];
      },
    },
    taskUavList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      tabIndex: 0,
    };
  },
  components: {
    DeviceItem,
    PlanItem,
  },

};
</script>

<style lang="scss" scoped >
.power {
  position: absolute;
  left: 10px;
  top: calc(18% + 20px);
  height: calc(52% - 10px);
  background: #282f33;
  width: 2.72rem;
  border-radius: 10px;
  padding: 10px;
  .tab-list {
    display: flex;
    justify-content: space-between;
    // border-bottom: 1px solid #363846;
    padding: 11px 0;
    .tab-item {
      width: 50%;
      color: #fff;
      font-size: 0.14rem;
      text-align: center;
      cursor: pointer;
      line-height: 0.32rem;
      border-radius: 6px 6px 2px 2px;
      border: 1px solid #3c4755;
      background: #303a47;
      &.active {
        background: #28323e;
        border-color: #03baca;
        border-bottom: none;
      }
    }
  }
}
</style>