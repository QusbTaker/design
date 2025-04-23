<!--
 * @Author: 刘小满
 * @Date: 2025-01-15 15:42:13
 * @Descripttion: 系统信息页面
-->
<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <div class="search-header">
      <el-form
        :inline="true"
        :model="queryParams"
        ref="queryForm"
        class="search-form"
      >
        <el-form-item prop="taskName">
          <el-input
            v-model="queryParams.taskName"
            placeholder="任务名称"
            clearable
            class="custom-input el-input-label4"
          >
            <span slot="prefix">任务名称</span>
          </el-input>
        </el-form-item>
        <el-form-item prop="timeRange">
          <el-date-picker
            v-model="queryParams.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            class="custom-date-picker"
            style="width: 360px;"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
            <span slot="prefix">时间</span>
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="uavName">
          <el-input
            v-model="queryParams.uavName"
            placeholder="无人机名称"
            clearable
            class="custom-input el-input-label5"
          >
            <span slot="prefix">无人机名称</span>
          </el-input>
        </el-form-item>
        <el-form-item prop="uavModel">
          <el-select
            v-model="queryParams.uavModel"
            placeholder="无人机型号"
            class="custom-select el-input-label5"
            clearable
          >
            <span slot="prefix">无人机型号</span>
            <el-option
              v-for="item in uavModelList"
              :key="item.uavModel"
              :label="item.uavModel"
              :value="item.uavModel"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleQuery"
          >查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      v-loading="loading"
    >
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      />
      <el-table-column
        prop="operationTime"
        label="时间"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ parseTime(scope.row.operationTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="taskName"
        label="任务名称"
        show-overflow-tooltip
      />
      <el-table-column
        prop="uavName"
        label="无人机名称"
        show-overflow-tooltip
      />
      <el-table-column
        prop="uavModel"
        label="无人机型号"
        show-overflow-tooltip
      />
      <el-table-column
        prop="flyerName"
        label="飞手"
        width="100"
        align="center"
      />
      <el-table-column
        prop="methodLabel"
        label="无人机操作"
        align="center"
      >

      </el-table-column>
      <el-table-column
        label="操作状态"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 'success' ? 'success' : 'info'"
            effect="dark"
            size="mini"
          >
            {{ scope.row.status === 'success' ? '成功' : '失败' }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getOperationListMysql } from '@/api/task';
import { parseTime } from '@/utils/ruoyi';
import { listUavModel } from '@/api/organization/device';
export default {
  name: 'SystemInformation',
  dicts: ['uav_function_type', 'uav_model'],
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        taskName: undefined,
        timeRange: [],
        startTime: undefined,
        endTime: undefined,
        uavName: undefined,
        uavModel: undefined,
      },
      // 表格数据
      tableData: [],
      // 无人机型号
      uavModelList: [],
    };
  },
  created() {
    this.getList();
    this.listUavModel();
  },
  methods: {
    parseTime,
    /** 无人机型号 */
    listUavModel() {
      listUavModel().then((response) => {
        this.uavModelList = response.rows || [];
      });
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      const params = {
        ...this.queryParams,
      };
      if (this.queryParams.timeRange.length > 0) {
        params.startTime = this.queryParams.timeRange[0];
        params.endTime = this.queryParams.timeRange[1];
      }
      delete params.timeRange;
      getOperationListMysql(params).then((response) => {
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
      this.queryParams.timeRange = [];
      this.handleQuery();
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .search-header {
    margin-bottom: 20px;
    border-radius: 4px;

    .search-form {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;

      .el-form-item {
        margin-bottom: 0;
        margin-right: 10px;
      }
    }
  }

  ::v-deep .el-tag {
    border: none;
    padding: 2px 8px;

    &.el-tag--success {
      background: #4d9446;
      color: #fff;
    }

    &.el-tag--info {
      background: #ff4d4f;
      color: #fff;
    }
  }
}
</style>