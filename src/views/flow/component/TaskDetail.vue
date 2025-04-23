<template>
  <div class="project-container">
    <div class="project-container-box">
      <div class="deatil-header">
        <div
          class="left"
          @click="goBack"
        >
          <i class="el-icon-arrow-left"></i>
        </div>
        <div class="title"> <el-tag
            effect="plain"
            color="transparent"
            size="mini"
            type="success"
          >航点</el-tag>航线</div>
      </div>
      <div class="deatil-container" >
      <!-- 航点航线 -->
      <el-form
        size="mini"
        label-position="top"
      >
        <el-collapse
          v-model="activeNames"
          @change="handleChange"
        >
          <el-collapse-item
            title="航线设置"
            name="1"
          >
            <el-form-item label="飞行高度 m">
              <div class="slider-box">
                <el-slider
                  v-model="form.height"
                  :max="500"
                ></el-slider>
                <el-input-number
                  v-model="form.height"
                  :min="0"
                  :max="500"
                  :controls="false"
                ></el-input-number>
              </div>
            </el-form-item>
            <el-form-item label="飞行速度 m/s">
              <div class="slider-box">
                <el-slider
                  v-model="form.speed"
                  :max="15"
                  :min="1"
                ></el-slider>
                <el-input-number
                  v-model="form.speed"
                  :min="1"
                  :max="15"
                  :controls="false"
                ></el-input-number>
              </div>
            </el-form-item>
            <el-form-item label="返航高度 m">
              <div class="slider-box">
                <el-slider
                  v-model="form.heightReturn"
                  :max="500"
                ></el-slider>
                <el-input-number
                  v-model="form.heightReturn"
                  :min="0"
                  :max="500"
                  :controls="false"
                ></el-input-number>
              </div>
            </el-form-item>
            <el-form-item label="爬升高度 m">
              <div class="slider-box">
                <el-slider
                  v-model="form.heightClimb"
                  :max="500"
                ></el-slider>
                <el-input-number
                  v-model="form.heightClimb"
                  :min="0"
                  :max="500"
                  :controls="false"
                ></el-input-number>
              </div>
            </el-form-item>
            <el-form-item label="飞行器偏航角模式">
              <el-select
                style="width: 100%;"
                v-model="form.yawAngle"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in dict.type.yaw_angle"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="云台俯仰控制">
              <el-select
                style="width: 100%;"
                v-model="form.pitchAngle"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in dict.type.pitch_angle"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务完成动作">
              <el-select
                style="width: 100%;"
                v-model="form.finishAction"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in dict.type.finish_action"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item
            title="航点设置"
            name="2"
            v-if="manageWaylineWaypointList.length"
          >
            <div class="destinations-tab">
              <i
                class="iconfont icon-a-ziyuan44"
                @click="pointIndex > 0 ? pointIndex-- : '' "
              ></i>
              <div class="destinations">
                航点{{ pointIndex + 1 }}
              </div>
              <i
                class="iconfont icon-a-ziyuan45"
                @click="pointIndex < (manageWaylineWaypointList.length -1) ? pointIndex++ : '' "
              ></i>
            </div>
            <el-form-item label="航点高度 m">
              <el-checkbox
                :checked="manageWaylineWaypointList[pointIndex].waypointHeight === 0"
                style="position: absolute;top: -28px;right: 0px;"
              ><span style="color: #fff;font-size: 12px;">跟随航线</span></el-checkbox>
              <div class="slider-box">
                <el-slider
                  v-model="manageWaylineWaypointList[pointIndex].waypointHeight"
                  :min="0"
                  :max="500"
                ></el-slider>
                <el-input-number
                  v-model="manageWaylineWaypointList[pointIndex].waypointHeight"
                  :min="0"
                  :max="500"
                  :controls="false"
                ></el-input-number>
              </div>
            </el-form-item>
            <el-form-item label="航点速度 m/s">
              <el-checkbox
                :checked="manageWaylineWaypointList[pointIndex].waypointSpeed === 0"
                style="position: absolute;top: -28px;right: 0px;"
              ><span style="color: #fff;font-size: 12px;">跟随航线</span></el-checkbox>
              <div class="slider-box">
                <el-slider
                  v-model="manageWaylineWaypointList[pointIndex].waypointSpeed"
                  :max="15"
                  :min="1"
                ></el-slider>
                <el-input-number
                  v-model="manageWaylineWaypointList[pointIndex].waypointSpeed"
                  :max="15"
                  :min="1"
                  :controls="false"
                ></el-input-number>
              </div>
            </el-form-item>
            <el-form-item label="飞行器偏航角°">
              <el-checkbox
                :checked="manageWaylineWaypointList[pointIndex].waypointYawAngle === 0"
                style="position: absolute;top: -28px;right: 0px;"
              ><span style="color: #fff;font-size: 12px;">跟随航线</span></el-checkbox>
              <div class="slider-box">
                <el-slider
                  v-model="manageWaylineWaypointList[pointIndex].waypointYawAngle"
                  :max="500"
                ></el-slider>
                <el-input-number
                  v-model="manageWaylineWaypointList[pointIndex].waypointYawAngle"
                  :min="0"
                  :max="500"
                  :controls="false"
                ></el-input-number>
              </div>
            </el-form-item>
            <el-form-item label="云台俯仰角°">
              <div class="slider-box">
                <el-slider
                  v-model="manageWaylineWaypointList[pointIndex].waypointPitchAngle"
                  :min="-90"
                  :max="-30"
                ></el-slider>
                <el-input-number
                  v-model="manageWaylineWaypointList[pointIndex].waypointPitchAngle"
                  :min="-90"
                  :max="-30"
                  :controls="false"
                ></el-input-number>
              </div>
            </el-form-item>
            <!-- <el-form-item label="航点动作">
              <div
                class="select-box"
                @click="addAction"
              >
                已选择{{ manageWaylineWaypointList[pointIndex].manageWaylineWaypointActionList.length }}个动作 <i class="el-icon-arrow-right"></i>
              </div>
              <div style="display: flex;align-items: center;">
                <span style="flex-shrink: 0;margin-right: 10px;">经度</span>
                <el-input
                  placeholder="请输入经度"
                  :value="manageWaylineWaypointList[pointIndex].gcj02Longitude"
                >
                </el-input>
              </div>
              <div style="display: flex;align-items: center;margin-top: 10px;">
                <span style="flex-shrink: 0;margin-right: 10px;">纬度</span>
                <el-input
                  placeholder="请输入纬度"
                  :value="manageWaylineWaypointList[pointIndex].gcj02Latitude"
                ></el-input>
              </div>
            </el-form-item> -->
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <el-button
        type="primary"
        style="width: 100%;"
        @click="handlerSubmit"
      >开启无人机</el-button>
    </div>
    </div>
  </div>
</template>

<script>
import { addWayLine, updateWayLine, getWayLine, dowloadFile } from '@/api/wayline';
import { gpsTobd09, bd09ToGps } from '@/utils';

export default {
  props: {
    row: {
      type: Object | null,
      default: null,
    },
  },
  dicts: ['yaw_angle', 'pitch_angle', 'finish_action'],
  data() {
    return {
      tabIndex: 0,
      activeNames: ['1', '2'],
      options: [{ value: '1', label: '其他' }],
      value1: 120,
      algorithmVisible: false,
      form: {
        heightType: '0', // 航线类型
        flightTime: 0,
        mileage: 0,
        height: 0,
        heightClimb: 0, // 爬升高度
        heightReturn: 0,
        speed: 1,
        waylineName: '',
        yawAngle: '0', // 偏航角模式：0-延航线方向 1-手动控制 2-锁定当前偏航角
        pitchAngle: '0', //云台俯仰角：0-手动控制 1-依照每个航点设置
        finishAction: '0', // 完成动作：0-自动返航 1-返回航线起始点悬停 2-退出航线模式 3-原地降落
      },
      manageWaylineWaypointList: [], // 航点
      pointIndex: 0, // 航点索引
      type: '',
      initAction: [],
      workspenceInfo: {}, // 项目详情
      detail: {}, // 航线详情
    };
  },
  watch: {
    'form.speed'(val) {
      if (val && this.form.mileage) {
        this.form.flightTime = (this.form.mileage / val).toFixed(0);
      }
    },
  },
  created() {
    this.$bus.$on('draw-liner-change', (data) => {
      console.log('draw-liner-change', data);
      const pointObg = {
        manageWaylineWaypointActionList: [], // 动作
        gcj02Longitude: '', // 航点经度
        gcj02Latitude: '', //航点纬度
        waypointLatitude: '', // 航点经度
        waypointLongitude: '', //航点纬度
        num: '', // 航点序号
        waypointHeight: this.form.height || 0, //航点高度m：0-跟随系统
        waypointPitchAngle: -30, // 航点云台俯仰角
        waypointSpeed: this.form.speed || 1, // 航点速度m/s：0-跟随系统
        waypointYawAngle: '', // 航点飞行器偏航角
      };
      let pointList = [];
      let manageWaylineWaypointList = JSON.parse(JSON.stringify(this.manageWaylineWaypointList));
      pointList = data.points.map((el, idx) => {
        const point = el.point;
        const index = manageWaylineWaypointList.findIndex(
          (item) => item.gcj02Longitude === point.lng && item.gcj02Latitude === point.lat
        );
        console.log('对比index', index);
        const oldObg = index > -1 ? manageWaylineWaypointList[index] : {};
        return Object.assign({}, pointObg, oldObg, {
          gcj02Longitude: point.lng,
          gcj02Latitude: point.lat,
          num: idx + 1,
        });
      });
      pointList.sort((a, b) => a.num - b.num);
      this.manageWaylineWaypointList = pointList;
    });
  },
  beforeDestroy() {
    this.$bus.$off('draw-liner-change');
  },
  methods: {
    goBack() {
      this.$modal
        .confirm('是否保存当前任务?')
        .then((action) => {
          this.handlerStartSubmit();
        })
        .catch((error) => {
          this.$router.back();
        });
    },
    handleChange(val) {
      console.log(val);
    },
    // 航点 提交参数
    handlerSubmit() {
      const params = {
        ...this.form,
        manageWaylineWaypointList: this.manageWaylineWaypointList.map((el) => {
          return {
            ...el,
            waypointLatitude: bd09ToGps(el.gcj02Longitude, el.gcj02Latitude).lat,
            waypointLongitude: bd09ToGps(el.gcj02Longitude, el.gcj02Latitude).lng,
          };
        }),
      };
      const func = params.id ? updateWayLine : addWayLine;
      func(params).then((respone) => {
        console.log('保存成功', respone);
        this.$emit('save', respone.data)
        // this.$message({
        //   type: 'success',
        //   message: '保存成功',
        // });
        // this.$router.back();

      });
    },
  },
};
</script> 


<style lang="scss" scoped >
.project-container {
  position: absolute;
  left: 15px;
  top: 15px;
  width: 270px;
  background: #282f33;
  border-radius: 10px;
  z-index: 100;
  height: calc(100vh - 80px);
  .project-container-box {
    height: 100%;
    box-sizing: border-box;
    padding-bottom: 19px;
    .deatil-header {
      display: flex;
      align-items: center;
      padding: 11px;
      border-bottom: 1px solid #363846;
      .left {
        width: 30%;
        cursor: pointer;
      }
      .title {
        width: 40%;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .right {
        text-align: right;
        width: 30%;
      }
    }
    .deatil-container {
      height: calc(100% - 30px);
      overflow-y: auto;
      padding: 0px 11px;
    }
    .bottom {
      position: absolute;
      width: 100%;
      height: 19px;
      background: #3D4549;
      border-radius: 0px 0px 10px 10px;
      bottom: 0;
      left: 0px;
      text-align: center;
      color: #9EA1A5;
      cursor: pointer;
      .close {
        transition: all 0.3s;
        font-size: 12px;
        transform: rotate(-90deg);
        display: inline-block;
      }
      .open {
        transition: all 0.3s;
        font-size: 12px;
        transform: rotate(90deg);
        display: inline-block;
      }
  
    }
  }
}
::v-deep .el-collapse .el-collapse-item .el-collapse-item__wrap {
  padding: 15px 0 0;
}
::v-deep .el-collapse .el-collapse-item .el-collapse-item__header::before {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 10px;
  background: #03baca;
}
::v-deep .el-form-item {
  margin-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  .el-form-item__label {
    padding-bottom: 0px;
  }
}
.slider-box {
  display: flex;
  align-items: center;
  .el-slider {
    flex-grow: 1;
    margin-right: 10px;
  }
  ::v-deep .el-input-number {
    width: 40px;
    .el-input__inner {
      padding-left: 0px;
      padding-right: 0px;
    }
  }
}
.destinations-tab {
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .destinations {
    width: 105px;
    height: 37px;
    background: #add2ff;
    border-radius: 8px;
    line-height: 35px;
    text-align: center;
    font-weight: bold;
    font-size: 14px;
    color: #282f33;
  }
  .iconfont {
    font-size: 13px;
    cursor: pointer;
    &:hover {
      color: #03baca;
    }
  }
}
.select-box {
  height: 30px;
  background: #3f484f;
  border-radius: 3px;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  color: #ffffff;
  cursor: pointer;
  margin: 10px 0;
}
.algorithm-list {
  .algorithm-item {
    padding: 0 10px;
    height: 28px;
    line-height: 28px;
    background: #161b1e;
    border-radius: 3px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-top: 10px;
  }
}
</style>