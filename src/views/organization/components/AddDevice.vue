<template>
  <el-dialog
    :title="form.id ? '修改救援设备' : '新增救援设备'"
    :visible="visible"
    append-to-body
    lock-scroll
    width="500px"
    @close="close"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item
        label="序列号"
        prop="sn"
      >
        <el-input
          v-model="form.sn"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="型号"
        prop="uavModel"
      >
        <el-select
          v-model="form.uavModel"
          clearable
          placeholder="请选择"
          style="width: 100%;"
          @change="modelChange"
        >
          <el-option
            v-for="item in uavModelListFilter"
            :key="item.uavModel"
            :label="item.uavModel"
            :value="item.uavModel"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="隶属单位"
        prop="deptId"
      >
        <treeselect
          v-model="form.deptId"
          :options="deptList"
          :normalizer="normalizer"
          @select="deptChange"
          placeholder="选择隶属单位"
        />
        <div v-if="form.uavName">
          无人机名称： {{ form.uavName }}
        </div>
      </el-form-item>
      <el-form-item
        label="责任人"
        prop="responsibleBy"
      >
        <el-select
          v-model="form.responsibleBy"
          clearable
          placeholder="请选择"
          style="width: 100%;"
        >
          <el-option
            v-for="item in userList"
            :key="item.userName"
            :label="item.userName"
            :value="item.userName"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="操控飞手"
        prop="pilots"
      >
        <el-select
          :multiple="true"
          v-model="form.pilots"
          clearable
          placeholder="请选择"
          style="width: 100%;"
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="投入使用日期"
        prop="useTime"
      >
        <el-date-picker
          v-model="form.useTime"
          type="date"
          placeholder="选择日期"
          style="width: 100%;"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="待命状态"
        prop="equipmentState"
      >
        <el-radio-group v-model="form.equipmentState">
          <el-radio
            v-for="dict in dict.type.uav_equipment_state"
            :label="Number(dict.value)"
          >{{ dict.label }}</el-radio>
        </el-radio-group>
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
import {
  getUav,
  addUav,
  updateUav,
  listUavModelManufacturer,
  listUavModel,
  uavGenerateNumber,
} from '@/api/organization/device';
import { listDept } from '@/api/system/dept';
import { listUser } from '@/api/system/user';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { deepClone } from '@/utils';
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
  components: {
    Treeselect,
  },
  dicts: ['uav_function_type', 'uav_equipment_state'],
  data() {
    return {
      form: {
        id: undefined,
        uavName: '',
        uavModel: '',
        sn: '',
        deptId: null,
        pilots: [],
        equipmentState: 0,
      },
      rules: {
        uavModel: [
          {
            required: true,
            message: '请选择无人机型号',
            trigger: 'change',
          },
        ],
        sn: [
          {
            required: true,
            message: '请输入飞控序列号',
            trigger: 'blur',
          },
        ],
        deptId: [
          {
            required: true,
            message: '请选择隶属部门',
            trigger: 'change',
          },
        ],
        responsibleBy: [
          {
            required: true,
            message: '请选择责任人',
            trigger: 'change',
          },
        ],
        pilots: [
          {
            required: true,
            message: '请选择操控飞手',
            trigger: 'change',
            type: 'array',
          },
        ],
        useTime: [
          {
            required: true,
            message: '请选择投入使用日期',
            trigger: 'change',
          },
        ],
        equipmentState: [
          {
            required: true,
            message: '请选择待命状态',
            trigger: 'change',
            type: 'number',
          },
        ],
      },
      manufacturerList: [],
      uavModelList: [],
      deptList: [],
      userList: [],
    };
  },
  watch: {
    visible(val) {
      if (val) {
        // this.listUavModelManufacturer();
        this.listUavModel();
        this.getDeptList();
        this.getUserList();

        if (this.row) {
          this.getDetail();
        } else {
          this.reset();
        }
      }
    },
  },
  computed: {
    uavModelListFilter() {
      return this.uavModelList.filter((item) =>
        this.form.uavManufacturer ? item.uavManufacturer === this.form.uavManufacturer : true
      );
    },
  },
  methods: {
    /** 无人机生产厂商 */
    listUavModelManufacturer() {
      listUavModelManufacturer().then((response) => {
        this.manufacturerList = response.map((el) => {
          return {
            label: el,
            value: el,
          };
        });
      });
    },
    /** 无人机型号 */
    listUavModel() {
      listUavModel().then((response) => {
        this.uavModelList = response.rows || [];
      });
    },
    /** 查询部门列表 */
    getDeptList() {
      listDept({ pageSize: 1000 }).then((response) => {
        this.deptList = this.handleTree(response.data, 'deptId');
      });
    },
    /** 查询用户列表 */
    getUserList() {
      listUser({ pageSize: 1000 }).then((response) => {
        this.userList = response.rows;
      });
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children,
      };
    },
    // 部门切换
    deptChange(dept) {
      let functionTypeName = this.selectDictLabel(
        this.dict.type.uav_function_type,
        this.form.functionType
      );
      uavGenerateNumber(dept.deptId).then((res) => {
        this.form.deptName = dept.deptName;
        this.form.uavName = `${functionTypeName}-${dept.deptName}${res.data}号`;
      });
    },
    // 型号切换
    modelChange() {
      console.log('型号切换');
      const uavModel = this.uavModelListFilter.find((el) => el.uavModel === this.form.uavModel);
      this.form.functionType = uavModel.functionType;
    },
    // 获取详情
    getDetail() {
      getUav(this.row.id).then((res) => {
        this.form = res.data;
        this.form.pilots = res.data.pilots.map((el) => el.userId);
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const params = deepClone(this.form);
          params.pilots = params.pilots.map((el) => {
            const userInfo = this.userList.find((i) => i.userId === el);
            return {
              userId: userInfo.userId,
              userName: userInfo.userName,
            };
          });

          if (params.id != undefined) {
            updateUav(params).then((response) => {
              this.$modal.msgSuccess('修改成功');
              this.cancel();
              this.$emit('reload');
            });
          } else {
            addUav(params).then((response) => {
              this.$modal.msgSuccess('新增成功');
              this.cancel();
              this.$emit('reload');
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.reset();
      this.close();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        uavName: '',
        uavModel: '',
        sn: '',
        deptId: null,
        pilots: [],
        equipmentState: 0,
      };
      this.resetForm('form');
    },
    close() {
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style>
</style>