<!--
 * @Author: 刘小满
 * @Date: 2025-01-21 11:38:14
 * @Descripttion: 
-->
<template>
  <div class="plan-item">
    <div class="plan-item-header">
      <i class="iconfont icon-a-ziyuan89"></i>
      <span class="plan-item-title">消防无人机{{ planList.length }}架</span>
    </div>
    <div class="device-list">
      <div
        :class="['device-item', activeId == i.id ? 'active' : '']"
        @click="handleClick(i)"
        v-for="i of planList"
        :key="i.id"
      >
        {{ i.uavName }}
      </div>
    </div>
    <div
      class="route-list"
      v-if="activeId"
    >
      <div class="route-header">
        <span>共{{ row.distance }}km</span>
        <span>约{{ row.time }}分钟</span>
      </div>
      <div class="route-item">
        <span>{{ row.province + row.city +  row.district + row.town  + row.street + row.street_number  }}</span>
        <span class="route-item-text">起</span>
      </div>
      <div class="route-item">
        <span>{{ taskInfo.completeAddress }}</span>
        <span class="route-item-text">终</span>
      </div>
    </div>
  </div>
</template>

<script>
import { calculateDistance } from '@/utils';
export default {
  props: {
    planList: {
      type: Array,
      default() {
        return [];
      },
    },
    taskInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      activeId: '',
      row: null,
    };
  },
  methods: {
    handleClick(item) {
      const _this = this;
      if (this.activeId == item.id) {
        this.activeId = '';
        this.row = null;
        return;
      } else {
        const distance = calculateDistance(item.point, {
          lng: this.taskInfo.targetLongitudeBd09,
          lat: this.taskInfo.targetLatitudeBd09,
        });
        let geoc = new BMapGL.Geocoder();
        geoc.getLocation(new BMapGL.Point(item.point.lng, item.point.lat), function (rs) {
          let addComp = rs.content.address_detail;
          _this.activeId = item.id;

          _this.row = {
            ...item,
            ...addComp,
            distance: (distance / 1000).toFixed(2),
            time: (distance / 15 / 60).toFixed(0),
          };
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped >
.plan-item {
  cursor: pointer;
  font-size: 14px;
  border-bottom: 1px solid #404a60;
  .plan-item-header {
    .iconfont {
      color: #35b6c3;
      font-size: 14px;
      margin-right: 5px;
    }
  }
  .device-list {
    padding-left: 18px;
    font-size: 14px;
    font-weight: 400;
    font-size: 0.14rem;
    color: #becbd8;
    line-height: 0.25rem;
    margin-top: 10px;
    .device-item {
      &.active {
        text-decoration-line: underline;
      }
    }
  }
  .route-list {
    background: #30383c;
    padding: 10px;
    .route-header {
      margin-bottom: 10px;
      span {
        color: #d6dbe7;
        border-right: 1px solid #a1a6b2;
        padding: 0 10px;
        &:nth-of-type(1) {
          padding-left: 0;
        }
        &:nth-last-of-type(1) {
          border-right: none;
        }
      }
    }
    .route-item {
      padding-left: 20px;
      padding-bottom: 15px;
      border-left: 1px dashed #3d93fd;
      margin-left: 5px;
      position: relative;
      .route-item-text {
        width: 20px;
        height: 20px;
        background: #3d93fd;
        border-radius: 50%;
        position: absolute;
        left: -10px;
        top: 0;
        text-align: center;
        line-height: 20px;
        font-size: 12px;
      }
      &:nth-last-of-type(1) {
        border-left: none;
        .route-item-text {
          background: #eb525c;
        }
      }
    }
  }
}
</style>