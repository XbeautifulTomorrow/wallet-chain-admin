<template>
  <div class="content">
    <div class="addBox">
      <el-button type="primary" @click="handleAdd">新增</el-button>
    </div>
    <br />
    <el-table border :data="chainList" style="width: 100%">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="chainName" label="网络名称" />
      <el-table-column prop="chainType" label="网络代码" />
      <el-table-column prop="scope" label="操作" width="220" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEditor(scope.row)"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" @click="deleteType(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pageBox">
      <el-pagination
        style="margin-top: 12px"
        layout="total, sizes, prev, pager, next, jumper"
        background
        :total="pagination.total"
        :current-page="pagination.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      v-if="showDialog"
      :title="!ruleForm.id ? '新增' : '编辑'"
      :visible.sync="showDialog"
      width="440px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item prop="chainName">
          <div slot="label" style="display: inline-block">
            <span>网络名称</span>
            <el-tooltip content="用于前台显示" placement="top" effect="light">
              <i class="el-icon-info" style="margin-left: 8px"></i>
            </el-tooltip>
          </div>
          <el-input
            placeholder="请输入网络名称"
            v-model="ruleForm.chainName"
            maxlength="50"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item prop="chainType">
          <div slot="label" style="display: inline-block">
            <span>网络代码</span>
            <el-tooltip
              content="填写时需要和开发确认"
              placement="top"
              effect="light"
            >
              <i class="el-icon-info" style="margin-left: 8px"></i>
            </el-tooltip>
          </div>
          <el-select
            v-model="ruleForm.chainType"
            style="width: 240px"
            placeholder="请选择网络代码"
            :disabled="!!ruleForm.id"
          >
            <el-option
              v-for="(item, index) in chainTypeData"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import pagination from "@/mixins/pagination";

export default {
  name: "NoticeList",
  mixins: [pagination],
  data() {
    return {
      ruleForm: {
        chainName: "",
        chainType: "",
      },
      showDialog: false,
      chainList: [],
      chainTypeData: [],
      rules: {
        chainName: [
          { required: true, message: "请输入网络名称", trigger: "blur" },
        ],
        chainType: [
          { required: true, message: "请输入网络代码", trigger: "blur" },
        ],
      },
      page: 1,
      size: 10,
    };
  },
  created() {
    this.fetchChainType();
    this.getChainType();
  },
  methods: {
    timeFormate(date, str) {
      return timeForStr(date, str);
    },
    // 获取 list
    async fetchChainType() {
      this.chainList = [];
      let res = await this.$http.chainTypeList({
        page: this.pagination.page,
        size: this.pagination.size,
      });

      if (res) {
        this.chainList = res.list;
        this.pagination.total = res.total;
      }
    },

    // 获取 list
    async getChainType() {
      this.chainList = [];
      let res = await this.$http.getChainType({
        page: this.page,
        siae: this.size,
      });

      if (res) {
        this.chainTypeData = res;
      }
    },
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate(async (valid) => {
        if (valid) {
          let res = null;
          const { id, chainType, chainName } = this.ruleForm;

          if (id) {
            res = await this.$http.chainTypeUpdate({
              ...this.ruleForm,
              chainTypeId: id,
            });
          } else {
            res = await this.$http.chainTypeSave({ ...this.ruleForm });
          }
          if (res) {
            this.$message.success("操作成功！");
            this.showDialog = false;
            this.fetchChainType();
          }
        } else {
          return false;
        }
      });
    },
    handleAdd() {
      this.showDialog = true;
      this.ruleForm.id = "";
      this.ruleForm.chainType = "";
    },
    handleEditor(row) {
      this.ruleForm = { ...row };
      this.showDialog = true;
    },
    deleteType(row) {
      this.$confirm(`确定要删除吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$http.chainTypeDelete({ chainTypeId: row.id });
          if (res) {
            this.$message.success("操作成功！");
            this.fetchChainType();
          }
        })
        .catch(() => {});
    },
    handleClose() {
      this.showDialog = false;
      this.ruleForm = {
        chainName: "",
        chainType: "",
      };
    },
    handleSizeChange(size) {
      this.pagination.size = size;
      this.fetchChainType();
    },
    handleCurrentChange(page) {
      this.pagination.page = page;
      this.fetchChainType();
    },
  },
};
</script>

<style lang="scss" scoped>
.center {
  text-align: center;
}
.inner {
  width: 15% !important;
}
.addBox {
  padding: 10px 0;
  display: flex;
}
</style>
