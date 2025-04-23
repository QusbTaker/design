<template>
  <el-dialog
    :title="form.userId ? '修改救援模板' : '新增救援模板'"
    :visible="visible"
    append-to-body
    lock-scroll
    width="500px"
    @close="close"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="80px"
    >
      <el-form-item
        label="模板名称"
        prop="name"
      >
        <el-input
          v-model="form.name"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="火灾类型"
        prop="fireType"
      >
        <el-select
          v-model="form.fireType"
          clearable
          placeholder="请选择"
          style="width: 100%;"
        >
          <el-option
            v-for="item in dict.type.fire_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="适用的火势等级"
        prop="fireLevel"
        class="label-more"
      >
        <el-select
          v-model="form.fireLevel"
          clearable
          placeholder="请选择"
          style="width: 100%;"
        >
          <el-option
            v-for="item in dict.type.fire_level"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="模板详情"
        required
        prop="aiRescuePlanDetailsList"
      >
        <div>
          <el-row
            style="margin-bottom: 10px;"
            :gutter="5"
            v-for="(i, idx) of aiRescuePlanDetailsList"
            :key="idx"
          >
            <el-col :span="11">
              <el-select
                v-model="i.uavModel"
                clearable
                placeholder="请选择无人机型号"
                style="width: 100%;"
                @change="(uavModel) => uavModelChange(i, uavModel)"
              >
                <el-option
                  v-for="item in uavModelList"
                  :key="item.uavModel"
                  :label="item.uavModel"
                  :value="item.uavModel"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select
                v-model="i.number"
                clearable
                placeholder="请选择数量"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in 10"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button
                type="text"
                size="mini"
                @click="addList(idx)"
              >
                <i class="iconfont icon-a-ziyuan99"></i>
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="delList(idx)"
                v-if="aiRescuePlanDetailsList.length > 1"
              >
                <i
                  class="iconfont icon-a-ziyuan98"
                  style="color: #FF6565;"
                ></i>
              </el-button>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="cancel">取 消</el-button>
      <el-button
        @click="submitForm"
        type="primary"
      >确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listUavModel } from '@/api/organization/device';
import { getrescuePlan, addrescuePlan, updaterescuePlan } from '@/api/algorithmModel';
import { deepClone } from '@/utils';
const DEFAULEITEM = {
  uavModel: '',
  uavOfficialName: '',
  functionType: '',
  number: '',
};

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    row: {
      type: Object | null,
      default: null,
    },
  },
  dicts: ['fire_type', 'fire_level'],
  data() {
    const validateList = (rule, value, callback) => {
      const flag = this.aiRescuePlanDetailsList.every((el) => {
        return el.uavModel && el.number;
      });
      if (!flag) {
        callback(new Error('请检查模板详情填写是否有空缺'));
      } else {
        this.form.aiRescuePlanDetailsList = deepClone(this.aiRescuePlanDetailsList);
        callback();
      }
    };
    return {
      form: {
        name: undefined,
        fireType: undefined,
        fireLevel: undefined,
        aiRescuePlanDetailsList: '[]',
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入模板名称',
            trigger: 'blur',
          },
        ],
        fireType: [
          {
            required: true,
            message: '请选择',
            trigger: 'change',
          },
        ],
        fireLevel: [
          {
            required: true,
            message: '请选择',
            trigger: 'change',
          },
        ],
        aiRescuePlanDetailsList: [
          {
            validator: validateList,
            trigger: 'change',
          },
        ],
      },
      uavModelList: [],
      aiRescuePlanDetailsList: [], // 模板列表 { id, uavModel, number }
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.listUavModel();
        if (this.row) {
          this.getDetail();
        } else {
          this.aiRescuePlanDetailsList = [deepClone(DEFAULEITEM)];
          this.reset();
        }
      }
    },
  },
  methods: {
    /** 无人机型号 */
    listUavModel() {
      listUavModel().then((response) => {
        this.uavModelList = response.rows || [];
      });
    },
    uavModelChange(row, uavModel) {
      const itemInfo = this.uavModelList.find((el) => el.uavModel == uavModel)
      row.uavOfficialName = itemInfo.uavOfficialName;
      row.functionType = itemInfo.functionType;
    },
    addList(idx) {
      this.aiRescuePlanDetailsList.splice(idx + 1, 0, deepClone(DEFAULEITEM));
    },
    delList(idx) {
      this.aiRescuePlanDetailsList.splice(idx, 1);
    },
    getDetail() {
      getrescuePlan(this.row.id).then((response) => {
        this.form = response.data;
        this.aiRescuePlanDetailsList = response.data.aiRescuePlanDetailsList;
        if(this.aiRescuePlanDetailsList.length <= 1) {
          this.addList(0)
        }
      });
    },
    // 取消按钮
    cancel() {
      this.aiRescuePlanDetailsList = [];
      this.reset();
      this.close();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        fireType: undefined,
        fireLevel: undefined,
        aiRescuePlanDetailsList: '[]'
      };
      this.resetForm('form');
    },
    close() {
      this.$emit('update:visible', false);
    },
    confirm() {
      this.$emit('confirm');
      this.close();
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updaterescuePlan(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功');
              this.cancel();
              this.$emit('reload');
            });
          } else {
            addrescuePlan(this.form).then((response) => {
              this.$modal.msgSuccess('新增成功');
              this.cancel();
              this.$emit('reload');
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped >
.label-more {
  ::v-deep .el-form-item__label {
    line-height: 20px;
  }
}
</style>