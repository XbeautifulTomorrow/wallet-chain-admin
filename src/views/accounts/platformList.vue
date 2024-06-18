<template>
  <div>
    <div class="searchBox">
      <div class="searchLeft">
        <el-input @keyup.enter.native="fetchPlatformList" clearable v-model="searchForm.userId"
          placeholder="输入ID/平台名"></el-input>

        <el-select style="margin-left: 20px" v-model="searchForm.withdrawalStatus" filterable clearable
          @change="fetchPlatformList()" placeholder="全部状态">
          <el-option v-for="(item, index) in statusDrop" :key="index" :label="item.text" :value="item.value">
          </el-option>
        </el-select>

        <el-button size="medium" type="primary" style="margin-left: 20px" icon="el-icon-search"
          @click="fetchPlatformList">搜索</el-button>

        <el-button size="medium" type="warning" style="margin-left: 20px" icon="el-icon-download"
          @click="toExportData">导出</el-button>
      </div>
      <div class="searchRight">
        <el-button type="primary" @click="handleAdd()">添加</el-button>
      </div>
    </div>
    <div class="userInfo">
      <div>用户总数 {{ totalNum }}</div>
    </div>
    <el-table border :data="platformList" height="73vh" style="width: 99%" @sort-change="sortChange">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="businessesName" label="平台"> </el-table-column>
      <el-table-column prop="businessesKey" label="平台Key"> </el-table-column>
      <el-table-column prop="totalUsers" label="总用户数"> </el-table-column>
      <el-table-column prop="totalAssets" label="总资产"> </el-table-column>
      <el-table-column prop="registrationTime" label="接入时间">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.registrationTime, "YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column prop="withdrawalStatus" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1" style="color: #21AE04;">正常</span>
          <span v-else style="color: #FF0707;">禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="toEdit(scope.row)">详情</el-button>
          <el-button size="small" type="primary" @click="toEdit(scope.row)">
            <span v-if="scope.row.withdrawalStatus == 1">禁用</span>
            <span v-else>启用</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageBox" v-if="totalNum > 0">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="searchForm.page" :page-sizes="[20, 30, 40]" :small="false" :page-size="searchForm.size"
        layout="total, sizes, prev, pager, next, jumper" :total="totalNum" :pager-count="5">
      </el-pagination>
    </div>

    <el-dialog :visible.sync="dialogVisible" width="440px" :close-on-click-modal="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="原邮箱号" prop="email" :rules="rules.email">
          <el-input placeholder="请输入原邮箱号" v-model="ruleForm.email"
            oninput="if(value.length > 20)value=value.slice(0, 20)" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="新邮箱号" prop="newEmail" :rules="rules.newEmail">
          <el-input placeholder="请输入新邮箱号" v-model="ruleForm.newEmail"
            oninput="if(value.length > 50)value=value.slice(0, 50)" style="width: 240px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import config from "@/config/env";
import axios from "axios";
import { timeForStr } from "@/utils/index";
export default {
  data() {
    return {
      totalNum: 0,
      registerAt: null,
      rangeAt: null,
      searchForm: {
        idOrName: null,
        status: null
      },
      sortData: {
        orderBy: null,
        orderType: null,
      },
      page: 1,
      size: 20,
      dialogVisible: false,
      ruleForm: {
        userId: "",
        newEmail: "",
      },
      platformList: [],
      statusDrop: [{ text: "正常", value: 1 }, { text: "禁用", value: 2 }],
      rules: {
        email: [{ required: true, trigger: "change" }],
        newEmail: [{ required: true, message: "请输入新邮箱" }],
      },
      httpPath: "",
      uploadHeader: {
        certificate: sessionStorage.getItem("token"),
      },
    };
  },
  created() {
    this.fetchPlatformList();
    this.httpPath = config.api;
  },
  methods: {
    timeForStr: timeForStr,
    searchFun() {

      return {
        ...this.searchForm
      };
    },
    /**
     * @description: 排序
     */
    sortChange({ column, prop, order }) {
      this.sortData.orderBy = prop;
      this.sortData.orderType = order == "descending" ? "DESC" : "ASC";

      if (!order) {
        this.sortData.orderBy = null;
        this.sortData.orderType = null;
      }

      this.fetchPlatformList();
    },
    async fetchPlatformList(isSearch = true) {
      const search = this.searchFun();
      const { sortData, size } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }
      const data = {
        ...{
          page: _page,
          size: size
        },
        ...sortData,
        ...search,
      };

      let res = await this.$http.getPlatformList(data);
      console.log(res)
      if (res) {
        this.platformList = res.records;
        this.totalNum = res.total;
      }
    },
    // 打开添加
    handleAdd() {
      this.dialogVisible = true;
    },
    submitForm() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (valid) {
          let res = await this.$http.editBit({
            userId: this.ruleForm.id,
            newEmail: this.ruleForm.newEmail,
          });

          if (res) {
            this.$message.success("操作成功！");
            this.dialogVisible = false;
            this.fetchPlatformList();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    toDetail() {
    },
    toEdit(row) {
      this.ruleForm = { ...row };
      this.dialogVisible = true;
    },
    /**
     * @description: 导出
     */
    async toExportData() {
      let self = this;
      axios
        .post(
          self.httpPath + "/user/export",
          {
            ...self.searchForm,
          },
          {
            headers: { certificate: sessionStorage.getItem("token") },
            responseType: "blob",
          }
        )
        .then((res) => {
          console.log(res);
          this.download(res.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    download(data) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", "excel.xlsx");

      document.body.appendChild(link);
      link.click();
    },
    handleSizeChange(val) {
      this.page = 1;
      this.size = val;
      this.fetchPlatformList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchPlatformList(false);
    },
    handleUpload(res, files, fileList) {
      this.loading = false;
      if (res.status == 200) {
        this.$message.success("导入成功");
        this.fetchPlatformList();
        return;
      }
      this.$message.error("上传失败");
    },
  },
};
</script>

<style lang="scss" scoped>
.userInfo {
  margin-top: 12px;
  margin-bottom: 12px;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
}

.btns {
  padding: 0 10px;
  display: flex;
  align-items: center;

  &>div+div {
    margin-left: 20px;
  }
}

.usd {
  width: 30%;
  margin-left: 50%;
  text-align: left;
}

.download {
  color: #5a7bef;
  margin-right: 40px;
  cursor: pointer;
  font-size: 24px;
}

.butt_select {
  display: inline-grid !important;
}

.el-checkbox-group {
  width: 70px;
}

::v-deep .el-select__tags {
  height: 40px;
  top: 0;
  transform: none;
}
</style>
