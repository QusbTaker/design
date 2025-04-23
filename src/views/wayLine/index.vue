<template>
  <div class="app-container">
    <!-- 表格 -->
    <el-form
      :inline="true"
      :model="queryParams"
      ref="queryForm"
    >
      <el-form-item prop="name">
        <el-input
          placeholder="请输入"
          class="el-input-label4"
          v-model="queryParams.name"
          suffix-icon="el-icon-search"
        >
          <span slot="prefix">任务名称</span>
        </el-input>
      </el-form-item>
      <el-form-item prop="createId">
        <el-select
          class="el-input-label3"
          v-model="queryParams.createId"
          clearable
          placeholder="请选择"
          style="width: 200px;"
        >
          <span slot="prefix">创建者</span>
          <el-option
            v-for="item in userList"
            :key="item.userName"
            :label="item.userName"
            :value="item.userId"
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
        type="index"
        label="序号"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="航线名称"
        width="300"
      >
        <template slot-scope="{ row }">
          <div>
            {{ '航线' + row.waylineId }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="taskName"
        label="所属任务"
      >
      </el-table-column>
      <el-table-column
        prop="uavName"
        label="飞行器"
      >
      </el-table-column>
      <el-table-column
        prop="createBy"
        label="创建者"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
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
              @click="handlerDetail(row)"
            >详情</el-button>
            <!-- <el-button
              size="mini"
              v-hasPermi="['system:user:remove']"
              @click="handleDelete(row)"
              type="text"
            >删除</el-button> -->
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

  </div>
</template>

<script>
import { listUser } from '@/api/system/user';
import { listWayLine, deleteWayLine } from '@/api/wayline';
import { listExecuteTask } from '@/api/task';
export default {
  dicts: ['fire_type'],
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        createId: '',
        taskStatus: '',
        taskType: 2,
      },
      tableData: [],
      total: 0,
      userList: [],
      visibleAccount: false,
      visibleAssign: false,
      row: null,
    };
  },
  created() {
    this.getList();
    this.getUserList();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listExecuteTask(this.queryParams).then((response) => {
        this.tableData = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询用户列表 */
    getUserList() {
      listUser({ pageSize: 1000 }).then((response) => {
        this.userList = response.rows;
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id;
      this.$modal
        .confirm('是否确认删除编号为"' + ids + '"的数据项？')
        .then(function () {
          return deleteWayLine(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {});
    },
    handlerDetail(row) {
      this.$router.push(`/wayLine/detail?wayLineId=${row.waylineId}`);
    },
  },
};
</script>

<style>
</style>