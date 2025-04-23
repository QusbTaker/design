<template>
  <div class="app-container">
    <!-- 表格 -->
    <el-form
      :inline="true"
      :model="queryParams"
      ref="queryForm"
    >
      <el-form-item prop="deptId">
        <treeselect
          v-model="queryParams.deptId"
          :options="deptList"
          :normalizer="normalizer"
          placeholder="选择隶属单位"
          style="width: 200px;"
        />
      </el-form-item>
      <el-form-item prop="uavName">
        <el-input
          placeholder="请输入名称"
          class="el-input-label"
          v-model="queryParams.uavName"
          suffix-icon="el-icon-search"
        >
          <span slot="prefix">搜索</span>
        </el-input>
      </el-form-item>
      <el-form-item prop="uavModel">
        <el-select
          class="el-input-label2"
          v-model="queryParams.uavModel"
          clearable
          placeholder="请选择"
        >
          <span slot="prefix">型号</span>
          <el-option
            v-for="item in uavModelList"
            :key="item.uavModel"
            :label="item.uavModel"
            :value="item.uavModel"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="responsibleBy">
        <el-select
          class="el-input-label2"
          v-model="queryParams.responsibleBy"
          clearable
          style="width: 200px;"
          placeholder="请选择"
        >
          <span slot="prefix">责任人</span>
          <el-option
            v-for="item in userList"
            :key="item.userName"
            :label="item.userName"
            :value="item.userName"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="flyerId">
        <el-select
          class="el-input-label4"
          v-model="queryParams.flyerId"
          clearable
          placeholder="请选择"
          style="width: 200px;"
        >
          <span slot="prefix">操控飞手</span>
          <el-option
            v-for="item in userList"
            :key="item.userName"
            :label="item.userName"
            :value="item.userId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="equipmentState">
        <el-select
          class="el-input-label4"
          v-model="queryParams.equipmentState"
          clearable
          placeholder="请选择"
          style="width: 200px;"
        >
          <span slot="prefix">待命状态</span>
          <el-option
            v-for="dict in dict.type.uav_equipment_state"
            :key="dict.value"
            :label="dict.label"
            :value="Number(dict.value)"
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="deptName"
        label="隶属单位"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="uavName"
        label="无人机名称"
      >
      </el-table-column>
      <el-table-column
        prop="uavModel"
        label="型号"
      >
      </el-table-column>
      <el-table-column
        prop="idleState"
        label="联网状态"
        width="180"
      >
        <template slot-scope="{ row }">
          <div>
            <el-tag
              type="warning"
              class="el-status-tag"
            >任务中</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="responsibleBy"
        label="责任人"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="pilots"
        label="操控飞手"
        width="180"
      >
        <template slot-scope="{ row }">{{ row.pilots.map(el => el.userName).join('、') }}</template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="投入使用日期"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.useTime) }}</span>
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
import { listDept } from '@/api/system/dept';
import { listUser } from '@/api/system/user';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { listUav, deleteUav } from '@/api/organization/device';
export default {
  dicts: ['uav_equipment_state'],
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        responsibleBy: '',
        uavModel: '',
        flyerId: '',
        equipmentState: null,
        deptId: null,
      },
      tableData: [],
      total: 0,
      manufacturerList: [],
      uavModelList: [],
      deptList: [],
      userList: [],
    };
  },
  created() {
    this.getList();
    this.listUavModel();
    this.getDeptList();
    this.getUserList();
  },
  components: {
    Treeselect,
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUav(this.queryParams).then((response) => {
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
  },
};
</script>

<style>
</style>