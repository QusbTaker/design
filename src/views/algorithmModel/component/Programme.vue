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
        >新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="loading"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="模板名称"
        width="300"
      >
      </el-table-column>
      <el-table-column
        prop="remark"
        label="救援模板"
      >
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
              @click="handlerAdd(row)"
            >编辑</el-button>
            <el-button
              size="mini"
              v-hasPermi="['system:user:remove']"
              @click="handleDelete(row)"
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
    <programme-edit
      :visible.sync="visibleAccount"
      :row="row"
      @reload="getList"
    ></programme-edit>
  </div>
</template>

<script>
import ProgrammeEdit from './ProgrammeEdit.vue';
// import AssignDrones from './AssignDrones.vue';
import { listrescuePlan, delrescuePlan, updaterescuePlan } from '@/api/algorithmModel';
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
    ProgrammeEdit,
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listrescuePlan(this.queryParams).then((response) => {
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.id;
      this.$modal
        .confirm('是否确认删除编号为"' + userIds + '"的数据项？')
        .then(function () {
          return delrescuePlan(userIds);
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