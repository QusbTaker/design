<template>
  <el-dialog
    :title="form.userId ? '修改子账号' : '新增子账号'"
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
        label="归属部门"
        prop="deptId"
      >
        <treeselect
          v-model="form.deptId"
          :options="deptOptions"
          :show-count="true"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item
        label="用户名"
        prop="userName"
      >
        <el-input
          v-model="form.userName"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="姓名"
        prop="nickName"
      >
        <el-input
          v-model="form.nickName"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="角色"
        prop="roleIds"
      >
        <el-select
          v-model="form.roleIds"
          clearable
          multiple
          placeholder="请选择"
          style="width: 100%;"
        >
          <el-option
            v-for="item in dict.type.front_role"
            :key="item.value"
            :label="item.label"
            :value="Number(item.value)"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        style="margin-bottom: 0;"
        label="手机号"
        prop="phonenumber"
      >
        <el-input
          v-model="form.phonenumber"
          placeholder="请输入"
        ></el-input>
        <div>初始密码与用户名一致</div>
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
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { getUser, addUser, updateUser, deptTreeSelect } from '@/api/system/user';
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
  dicts: ['front_role'],
  components: { Treeselect },
  data() {
    return {
      form: {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        roleIds: [],
      },
      // 部门树选项
      deptOptions: undefined,
      // 默认密码
      initPassword: undefined,
      rules: {
        userName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
        ],
        nickName: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur',
          },
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur',
          },
        ],
        roleIds: [
          {
            required: true,
            message: '请选择角色',
            type: 'array',
            trigger: 'change',
          },
        ],
        deptId: [
          {
            required: true,
            message: '请选择',
            trigger: 'change',
          },
        ],
      },
    };
  },
  watch: {
    visible(val) {
      if (val) {
        if (this.row) {
          this.getDetail();
        } else {
          this.reset();
          this.form.password = this.initPassword;
        }
      }
    },
  },
  created() {
    this.getConfigKey('sys.user.initPassword').then((response) => {
      this.initPassword = response.msg;
    });
    this.getDeptTree();
  },
  methods: {
    /** 查询部门下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    getDetail() {
      getUser(this.row.userId).then((response) => {
        this.form = response.data;
        this.$set(this.form, 'roleIds', response.roleIds);
        this.form.password = '';
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
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        status: '0',
        roleIds: [],
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
          if (this.form.userId != undefined) {
            updateUser(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功');
              this.cancel();
              this.$emit('reload');
            });
          } else {
            addUser(this.form).then((response) => {
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

<style>
</style>