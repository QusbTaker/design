<template>
  <div class="app-container">
    <!-- 表格 -->
    <el-form
      :inline="true"
      :model="queryParams"
      ref="queryForm"
    >
      <el-form-item>
        <el-button
          v-hasPermi="['system:device:add']"
          @click="handlerAdd(null)"
          type="primary"
        >新增</el-button>
        <el-button
          v-hasPermi="['system:device:remove']"
          :disabled="multiple"
          @click="handleDelete"
          type="danger"
        >删除</el-button>
      </el-form-item>
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
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="uavModel"
        label="型号"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="idleState"
        label="待命状态"
        width="180"
      >
        <template slot-scope="{ row }">
          <div>
            <el-tag
              v-if="row.idleState > 0"
              type="warning"
              class="el-status-tag"
            >任务中</el-tag>
            <el-dropdown
              v-else
              style="background-color: #2c353e;border-radius: 4px;"
              @command="(command) => equipmentStateChange(row, command)"
            >
              <span class="el-dropdown-link">
                <el-tag
                  v-if="row.equipmentState === 2"
                  type="danger"
                  class="el-status-tag"
                >不可用</el-tag>
                <el-tag
                  v-else-if="row.equipmentState === 1"
                  type="warning"
                >维修中</el-tag>
                <el-tag
                  v-else
                  type="success"
                  class="el-status-tag"
                >正常</el-tag>
                <i
                  style="margin-right: 10px;"
                  class="el-icon-arrow-down el-icon--right"
                ></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="0">
                  <el-tag
                    style="background-color: transparent;border-color: transparent;"
                    type="success"
                    class="el-status-tag"
                  >正常</el-tag>
                </el-dropdown-item>
                <el-dropdown-item :command="1">
                  <el-tag
                    style="background-color: transparent;border-color: transparent;"
                    type="warning"
                    class="el-status-tag"
                  >维修中</el-tag>
                </el-dropdown-item>
                <el-dropdown-item :command="2">
                  <el-tag
                    style="background-color: transparent;border-color: transparent;"
                    type="danger"
                    class="el-status-tag"
                  >不可用</el-tag>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

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
              v-hasPermi="['system:device:edit']"
              @click="handlerAdd(row)"
            >编辑</el-button>
            <el-button
              size="mini"
              v-hasPermi="['system:device:delete']"
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
    <!-- 新增无人机 -->
    <add-device
      :visible.sync="visibleDevice"
      @reload="getList"
      :row="row"
    ></add-device>
  </div>
</template>

<script>
import {
  listUav,
  delUav,
  updateUav,
  listUavModelManufacturer,
  listUavModel,
} from '@/api/organization/device';
import { listDept } from '@/api/system/dept';
import { listUser } from '@/api/system/user';
import AddDevice from './components/AddDevice.vue';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
  data() {
    return {
      tableData: [],
      visibleDevice: false,
      row: null,
      loading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        responsibleBy: '',
        uavModel: '',
        flyerId: '',
        equipmentState: null,
        deptId: null,
      },
      total: 0,
      manufacturerList: [],
      uavModelList: [],
      deptList: [],
      userList: [],
    };
  },
  components: {
    AddDevice,
    Treeselect,
  },
  dicts: ['uav_equipment_state'],
  created() {
    this.getList();
    // this.listUavModelManufacturer();
    this.listUavModel();
    this.getDeptList();
    this.getUserList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      listUav(this.queryParams).then((response) => {
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
    // 状态变更
    equipmentStateChange(row, command) {
      console.log('变更', row, command);
      this.loading = true;
      updateUav({
        ...row,
        equipmentState: command,
      }).then((res) => {
        this.getList();
        this.$modal.msgSuccess('状态更新成功');
      });
    },
    // 编辑新增
    handlerAdd(row) {
      this.row = row;
      this.visibleDevice = true;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除编号为"' + ids + '"的数据项？')
        .then(function () {
          return delUav(ids);
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

<style lang="scss" scoped>
</style>