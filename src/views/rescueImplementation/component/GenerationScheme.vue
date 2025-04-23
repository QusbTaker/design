<template>
  <div class="scheme-box">
    <div class="header">
      <el-button
        size="mini"
        style="color: #fff;padding: 5px 8px;font-size: 12px;"
        @click="$emit('back')"
      >
        <i
          class="iconfont icon-a-ziyuan1091"
          style="font-size: 12px;vertical-align: text-top;"
        ></i>
        返回</el-button>
      <div class="address-title">
        {{ form.landmark }}
      </div>
      <div class="address-desc">
        {{ form.address }}
      </div>
    </div>
    <el-divider style="margin: 10px 0;"></el-divider>
    <div class="scheme-content">
      <el-form size="mini">
        <el-form-item label="任务名称">
          <el-input
            v-model="form.name"
            placeholder="请输入任务名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input
            v-model="form.specificAddress"
            placeholder="请输入具体起火地址和楼层"
          ></el-input>
        </el-form-item>
        <el-form-item label="火情类型">
          <el-radio-group v-model="form.fireType">
            <el-radio
              v-for="item in dict.type.fire_type"
              :key="item.value"
              :label="item.value"
            >{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="参考救援模板">
          <el-select
            popper-class="my-select"
            v-model="form.referenceRescuePlan"
            placeholder="请选择参考救援模板"
            style="width: 100%;"
          >
            <el-option
              v-for="item in referenceRescuePlan"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <div>
                <div style="font-size: 14px;color: #fff;line-height: 16px;"> {{ item.name }}</div>
                <div style="font-size: 12px;color: #BECBD8;line-height: 16px;">
                  {{ item.remark }}
                </div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="width: 100%;margin: 15px 0;"
            :loading="loading"
            @click="handlerSubmit"
          >生成灭火方案</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { listrescuePlan } from '@/api/algorithmModel';
import { addTask } from '@/api/task';
import { parseTime } from "@/utils/ruoyi"
export default {
  dicts: ['fire_type', 'fire_level'],
  props: {
    addressInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      form: {
        landmark: '',
        cityCode: '',
        cityName: '',
        completeAddress: '',
        countryCode: '',
        countryName: '',
        districtCode: '',
        districtName: '',
        fireLevel: '',
        fireType: '',
        name: '',
        provinceCode: '',
        provinceName: '',
        referenceRescuePlan: '',
        specificAddress: '',
        subDistrictCode: '',
        subDistrictName: '',
        targetHeight: 0,
        targetLatitude: 0,
        targetLongitude: 0,
      },
      referenceRescuePlan: [],
      loading: false,
    };
  },
  mounted() {
    this.getListrescuePlan();
    const addressInfo = this.addressInfo;
    this.form = {
      landmark: addressInfo.title,
      address: addressInfo.address,
      cityCode: addressInfo.city_code,
      cityName: addressInfo.city,
      completeAddress: '',
      countryCode: addressInfo.country_code,
      countryName: addressInfo.country,
      districtCode: '',
      districtName: addressInfo.district,
      provinceCode: '',
      provinceName: addressInfo.province,
      subDistrictCode: addressInfo.town_code,
      subDistrictName: addressInfo.town,
      targetLatitude: addressInfo.targetLatitude,
      targetLongitude: addressInfo.targetLongitude,
      targetLatitudeBd09: addressInfo.point.lat,
      targetLongitudeBd09: addressInfo.point.lng,
      fireLevel: '',
      fireType: '1',
      name: `${parseTime(new Date())}救援`,
      referenceRescuePlan: '',
      specificAddress: '',
      targetHeight: 0,
    };
  },
  methods: {
    getListrescuePlan() {
      listrescuePlan({ pageSize: 1000 }).then((res) => {
        console.log('方案', res);
        this.referenceRescuePlan = res.rows;
      });
    },
    handlerSubmit() {
      const params = this.form;
      params.completeAddress = params.address + params.specificAddress;
      this.loading = true;
      addTask(params).then((res) => {
        console.log('任务生成', res.data);
        this.loading = false;
        this.$emit('taskDelivery', res.data);
      }).catch(() => {
        this.loading = false;
      });;
    },
  },
};
</script>

<style lang="scss" scoped >
.scheme-box {
  .header {
    padding: 15px 18px 0;
    .address-title {
      font-size: 16px;
      color: #ffffff;
      line-height: 30px;
      margin-top: 10px;
    }
    .address-desc {
      font-weight: 400;
      font-size: 12px;
      color: #becbd8;
    }
  }
  .scheme-content {
    padding: 0 18px;
  }
}
</style>