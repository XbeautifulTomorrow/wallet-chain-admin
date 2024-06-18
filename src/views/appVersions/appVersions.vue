<template>
  <div>
    <div class="searchBox">
      <div class="searchLeft">
        <el-input
          size="medium"
          v-model="searchForm.name"
          placeholder="请输入名称"
          @keyup.enter.native="getTableList"
        ></el-input>
        <el-select
          size="medium"
          clearable
          v-model="searchForm.platform"
          @change="getTableList"
          placeholder="请选择平台类型"
        >
          <el-option label="ios" value="ios"></el-option>
          <el-option label="android" value="android"></el-option>
        </el-select>
        <el-select
          size="medium"
          clearable
          v-model="searchForm.type"
          @change="getTableList"
          placeholder="请选择业务分类"
        >
          <el-option label="CM" value="CM"></el-option>
          <el-option label="NFT" value="NFT"></el-option>
        </el-select>
        <el-button
          size="medium"
          type="primary"
          icon="el-icon-search"
          @click="getTableList"
          >搜索</el-button
        >
      </div>
      <div class="searchRight">
        <el-button
          size="medium"
          type="primary"
          icon="el-icon-plus"
          @click="addFunc('add')"
          >新增版本</el-button
        >
      </div>
    </div>
    <el-table
      :data="tableData"
      height="73vh"
      :header-cell-style="{
        'background-color': '#F6F6F6',
        'font-weight': '600',
        color: '#333',
        height: '20px',
      }"
      style="width: 100%"
    >
      <el-table-column prop="name" label="app名称"> </el-table-column>
      <el-table-column
        prop="platform_code"
        show-overflow-tooltip
        label="平台类型"
      >
      </el-table-column>
      <el-table-column prop="type" show-overflow-tooltip label="业务类型">
      </el-table-column>
      <el-table-column prop="release_time" width="160px" label="发布时间">
      </el-table-column>
      <el-table-column prop="state" show-overflow-tooltip label="版本更新说明">
      </el-table-column>
      <el-table-column prop="increment_link" label="增量更新地址">
      </el-table-column>
      <el-table-column prop="forced" width="120px" label="是否强制更新">
        <template slot-scope="scope">
          <span>{{ scope.row.forced == "y" ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="download_link" label="下载链接">
        <!-- <template slot-scope="scope">
        <a :href="scope.row.download_link"></a>
      </template> -->
      </el-table-column>
      <el-table-column prop="versions" width="100px" label="版本号">
      </el-table-column>
      <el-table-column prop="way" width="150px" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="deleteApp(scope.row)"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="warning"
            @click="editFunc(scope.row)"
            v-if="compareTime(scope.row.release_time)"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pageBox" v-if="totalNum > 0">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.current"
        :page-sizes="[10, 30, 40]"
        :page-size="searchForm.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      >
      </el-pagination>
    </div>
    <el-dialog
      :title="!ruleForm.id ? 'app发版' : 'app发版修改'"
      :visible.sync="dialogVisible"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="app-ruleForm"
      >
        <div class="inputRow">
          <el-form-item label="app名称" prop="name" :rules="rules.blurRule">
            <el-input
              placeholder="app名称"
              v-model="ruleForm.name"
              style="width: 240px"
            ></el-input>
          </el-form-item>
        </div>
        <div class="inputRow">
          <el-form-item
            label="平台类型"
            prop="platform_code"
            :rules="rules.selectRule"
          >
            <el-select
              v-model="ruleForm.platform_code"
              placeholder="请选择平台类型"
            >
              <el-option label="ios" value="ios"></el-option>
              <el-option label="android" value="android"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务分类" prop="name" :rules="rules.selectRule">
            <el-select v-model="ruleForm.type" placeholder="请选择业务分类">
              <el-option label="CM" value="CM"></el-option>
              <el-option label="NFT" value="NFT"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="inputRow">
          <el-form-item
            label="是否强制更新"
            prop="forced"
            :rules="rules.selectRule"
          >
            <el-select
              v-model="ruleForm.forced"
              placeholder="请选择是否强制更新"
            >
              <el-option label="是" value="y"></el-option>
              <el-option label="否" value="n"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="发布时间"
            prop="release_time"
            :rules="rules.selectRule"
          >
            <el-date-picker
              v-model="ruleForm.release_time"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="是否生效" prop="status" :rules="rules.selectRule">
            <el-select v-model="ruleForm.status" placeholder="请选择是否生效">
              <el-option label="是" value="y"></el-option>
              <el-option label="否" value="n"></el-option>
            </el-select>
          </el-form-item> -->
        </div>
        <div class="inputRow">
          <el-form-item
            label="下载链接"
            prop="download_link"
            :rules="rules.blurRule"
          >
            <el-input
              placeholder="请输入下载链接"
              v-model="ruleForm.download_link"
              style="width: 240px"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="增量更新地址"
            prop="increment_link"
            :rules="rules.blurRule"
          >
            <el-input
              placeholder="请输入增量更新地址"
              v-model="ruleForm.increment_link"
              style="width: 240px"
            ></el-input>
          </el-form-item>
        </div>
        <div class="inputRow">
          <el-form-item
            label="版本更新说明"
            prop="versions"
            :rules="rules.blurRule"
          >
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="ruleForm.state"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="版本号" prop="versions" :rules="rules.blurRule">
            <el-input
              placeholder="请输入版本号"
              v-model="ruleForm.versions"
              style="width: 240px"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      totalNum: 0,
      searchForm: {
        current: 1,
        size: 10,
        name: "",
        platform: "",
        type: "",
      },
      tableData: [],
      dialogVisible: false,
      ruleForm: {
        id: "",
        download_link: "",
        forced: "",
        increment_link: "",
        name: "",
        platform_code: "",
        release_time: "",
        state: "",
        status: "y",
        type: "",
        versions: "",
      },
      rules: {
        blurRule: [{ required: true, message: "请输入", trigger: "blur" }],
        selectRule: [{ required: true, message: "请选择", trigger: "change" }],
      },
    };
  },
  created() {
    this.getTableList();
  },
  methods: {
    compareTime(time) {
      let date1 = new Date().getTime();
      let date2 = new Date(time).getTime();
      if (date2 > date1) {
        return true;
      } else {
        return false;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let ruleForm = { ...this.ruleForm };
          let res = null;
          if (this.ruleForm.id) {
            ruleForm.password = undefined;
            res = await this.$http.appEdit({ ...ruleForm });
          } else {
            res = await this.$http.appAdd({ ...ruleForm });
          }
          if (res) {
            this.$refs[formName].resetFields();
            this.ruleForm.status = "y";
            this.$message.success("操作成功！");
            this.dialogVisible = false;
            this.getTableList();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    deleteApp(row) {
      this.$confirm(`确定要删除版本号为${row.versions} 的版本吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$http.appDelete({ id: row.id });
          if (res) {
            this.$message.success("操作成功！");
            this.getTableList();
          }
        })
        .catch(() => {});
    },
    async editFunc(row) {
      let res = await this.$http.getAppInfo({ id: row.id });
      if (res) {
        this.ruleForm = res;
        this.dialogVisible = true;
      }
    },
    addFunc(type) {
      if (type == "add") {
        this.dialogVisible = true;
        this.ruleForm.id = "";
      }
    },
    async getTableList(val) {
      this.tableData = [];
      let res = await this.$http.getAppList({ ...this.searchForm });
      if (res) {
        this.tableData = res.records;
        this.totalNum = res.total;
      }
    },
    handleSizeChange(val) {
      this.searchForm.current = 1;
      this.searchForm.size = val;
      this.getTableList();
    },
    handleCurrentChange(val) {
      this.searchForm.current = val;
      this.getTableList();
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .app-ruleForm {
  .inputRow {
    display: flex;
  }
  .el-input__inner {
    width: 240px !important;
  }
  .el-textarea__inner {
    width: 240px !important;
  }
}
</style>
