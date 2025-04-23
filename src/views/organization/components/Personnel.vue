<template>
  <div>
    <!-- 表格 -->
    <el-form
      :inline="true"
      :model="queryParams"
      ref="queryForm"
    >
      <el-form-item>
        <el-button
          @click="handlerAdd(null)"
          type="primary"
          v-hasPermi="['system:user:add']"
        >新增用户</el-button>
      </el-form-item>
      <el-form-item prop="userName">
        <el-input
          placeholder="请输入"
          v-model="queryParams.userName"
          @keyup.enter.native="handleQuery"
          suffix-icon="el-icon-search"
        >
          <span slot="prefix">用户名</span>
        </el-input>
      </el-form-item>
      <el-form-item prop="phonenumber">
        <el-input
          placeholder="请输入"
          v-model="queryParams.phonenumber"
          @keyup.enter.native="handleQuery"
          suffix-icon="el-icon-search"
        >
          <span slot="prefix">手机号</span>
        </el-input>
      </el-form-item>
      <el-form-item prop="roleId">
        <el-select
          class="el-input-label4"
          v-model="queryParams.roleId"
          clearable
          placeholder="请选择"
        >
          <span slot="prefix">角色类型</span>
          <el-option
            v-for="item in dict.type.front_role"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="handleQuery"
        >查询</el-button>
        <el-button
          class="reset"
          @click="resetQuery"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="loading"
      border
      style="width: 100%"
    >
      <el-table-column
        type="expand"
        align="center"
        width="80"
      >
        <template slot-scope="{ row }">
          <table style="width: 100%;">
            <tr>
              <th style="width: 33.33%;text-align: center;padding: 10px 0;">无人机名称</th>
              <th style="width: 33.33%;text-align: center;padding: 10px 0;">型号</th>
              <th style="width: 33.33%;text-align: center;padding: 10px 0;">待命状态</th>
            </tr>
            <tr v-for="i of row.uavs">
              <td style="text-align: center;padding: 10px 0;">{{ i.uavName }}</td>
              <td style="text-align: center;padding: 10px 0;">{{ i.uavModel }}</td>
              <td style="text-align: center;padding: 10px 0;">
                <el-tag
                  v-if="i.idleState > 0"
                  type="warning"
                  class="el-status-tag"
                >任务中</el-tag>
                <el-tag
                  v-else-if="i.equipmentState === 2"
                  type="danger"
                  class="el-status-tag"
                >不可用</el-tag>
                <el-tag
                  v-else-if="i.equipmentState === 1"
                  type="warning"
                >维修中</el-tag>
                <el-tag
                  v-else
                  type="success"
                  class="el-status-tag"
                >正常</el-tag>
              </td>
            </tr>
          </table>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="userName"
        label="用户名"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="nickName"
        label="姓名"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="roles"
        label="角色"
        width="180"
      >
        <template slot-scope="{ row }">
          <div>
            {{ row.roles.map(el => el.roleName).join('、') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="phonenumber"
        label="手机号"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="添加时间"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="uavs"
        label="已分配无人机数量"
      >
        <template slot-scope="{ row }">
          <div>{{ row.uavs.length }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="uavs"
        label="型号"
      >
        <template slot-scope="{ row }">
          <div>{{ row.uavs.map(el=>el.uavModel).join('、') }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
      >
        <template slot-scope="{ row }">
          <div>
            <el-switch
              v-if="hasAdmintAuth(row)"
              :value="row.status"
              active-color="#01acba"
              active-value="0"
              inactive-value="1"
              @change="(status) => statusShange(row, status)"
            >
            </el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        align="center"
        label="操作"
        width="200px"
      >
        <template slot-scope="{ row }">
          <div>
            <el-button
              size="mini"
              type="text"
              v-hasPermi="['system:user:edit']"
              v-if="hasAdmintAuth(row)"
              @click="handlerAdd(row)"
            >编辑</el-button>
            <el-button
              size="mini"
              v-hasPermi="['system:user:remove']"
              @click="handleDelete(row)"
              v-if="hasAdmintAuth(row)"
              type="text"
            >删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 新增账号 -->
    <add-account
      :visible.sync="visibleAccount"
      :row="row"
      @reload="getList"
    ></add-account>
  </div>
</template>

<script>
import AddAccount from './AddAccount.vue';
// import AssignDrones from './AssignDrones.vue';
import { listUser, delUser, updateUser } from '@/api/system/user';
export default {
  dicts: ['front_role'],
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        roleId: undefined,
      },
      tableData: [],
      total: 0,
      visibleAccount: false,
      visibleAssign: false,
      row: null,
    };
  },
  components: {
    AddAccount,
  },
  created() {
    this.getList();
  },
  methods: {
    hasAdmintAuth(row) {
      const flag = row.roles.some((el) => el.roleKey === 'manager' || el.roleKey === 'admin');
      return !flag;
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.queryParams).then((response) => {
        this.tableData = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 编辑新增
    handlerAdd(row) {
      this.row = row;
      this.visibleAccount = true;
    },
    statusShange(row, value) {
      console.log('切换黄台', value);
      updateUser({
        ...row,
        roleIds: row.roles.map((el) => el.roleId),
        status: value,
      }).then((res) => {
        this.getList();
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId;
      this.$modal
        .confirm('是否确认删除用户编号为"' + userIds + '"的数据项？')
        .then(function () {
          return delUser(userIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {});
    },
  },
};
</script>

<style>
</style>