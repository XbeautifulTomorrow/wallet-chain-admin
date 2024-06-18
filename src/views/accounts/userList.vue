<template>
  <div>
    <div class="searchBox">
      <div class="searchLeft">
        <el-input @keyup.enter.native="fetchUserList" clearable v-model="searchForm.userId"
          placeholder="输入用户ID/昵称"></el-input>

        <el-select style="margin-left: 20px" v-model="searchForm.businessesId" filterable clearable
          @change="fetchUserList()" placeholder="全部平台">
          <el-option v-for="(item, index) in platformDrop" :key="index" :label="item.text" :value="item.value">
          </el-option>
        </el-select>
        <el-select style="margin-left: 20px" v-model="searchForm.withdrawalStatus" filterable clearable
          @change="fetchUserList()" placeholder="全部状态">
          <el-option v-for="(item, index) in statusDrop" :key="index" :label="item.text" :value="item.value">
          </el-option>
        </el-select>

        <el-date-picker v-model="registerAt" style="width:260px" type="daterange" range-separator="-"
          start-placeholder="注册时间开始" end-placeholder="注册时间结束" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <el-date-picker v-model="rangeAt" style="width: 260px; margin-left: 10px" type="daterange" range-separator="-"
          start-placeholder="账变时间开始" end-placeholder="账变时间结束" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>

        <el-button size="medium" type="primary" style="margin-left: 20px" icon="el-icon-search"
          @click="fetchUserList">搜索</el-button>

        <el-button size="medium" type="warning" style="margin-left: 20px" icon="el-icon-download"
          @click="toExportData">导出</el-button>
        <el-button size="medium" type="warning" style="margin-left: 20px" icon="el-icon-download"
          @click="toUpdateBatch()">批量上分</el-button>
      </div>
      <div class="searchRight"></div>
    </div>
    <div class="userInfo">
      <div>用户总数 {{ totalNum }}</div>
    </div>
    <el-table border :data="userList" height="73vh" style="width: 99%" @sort-change="sortChange">
      <el-table-column prop="id" label="用户ID/昵称">
        <template slot-scope="scope">
          <p :style="{ color: scope.row.userType == 'INNER' ? 'red' : '#000' }">
            {{ scope.row.userId || "--" }}
          </p>
          <p :style="{ color: scope.row.userType == 'INNER' ? 'red' : '#000' }">
            {{ scope.row.userName || "--" }}
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="businessesName" label="平台"> </el-table-column>
      <el-table-column prop="totalAssets" label="总资产"> </el-table-column>
      <el-table-column prop="registrationTime" label="注册时间">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.registrationTime, "YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column prop="accountChangeTime" label="最后账变时间">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.accountChangeTime, "YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column prop="code" label="最后登录IP"></el-table-column>
      <el-table-column prop="withdrawalStatus" label="提款限制">
        <template slot-scope="scope">
          <span v-if="scope.row.withdrawalStatus == 1" style="color: #21AE04;">正常</span>
          <span v-else style="color: #FF0707;">限制提款</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="toUpdate(scope.row)">上下分</el-button>
          <el-button size="small" type="primary" @click="handleDetail(scope.row)">详情</el-button>
          <el-button size="small" type="primary" @click="handleStatus(scope.row)">
            <span v-if="scope.row.withdrawalStatus == 1">限制提款</span>
            <span v-else>解除限制</span>
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
    <assetDetails v-if="showAsset == true" :assetInfo="assetData" @closePopup="handleClose"></assetDetails>
    <el-dialog :title="ruleForm.businessesUserIds ? '批量上分' : '上分'" :visible.sync="showUpPoints" width="440px"
      :close-on-click-modal="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户ID">
          <el-input readonly v-model="ruleForm.businessesUserId" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="代币" prop="coin">
          <el-select v-model="ruleForm.coin" filterable clearable @change="changeCoin" placeholder="所有币种">
            <el-option v-for="(item, index) in coinDrop" :key="index" :label="item.coinName" :value="item.coinName">
              <div class="coin-box">
                <div class="coin-info">
                  <img class="coin-img" :src="item.img" />
                  <div class="coin-name">{{ item.coinName }}</div>
                </div>
                <div class="coin-value">{{ `$${item.value || 1000}` }}</div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="余额">
          <el-input readonly v-model="ruleForm.balance" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="上分金额" prop="amount">
          <el-input placeholder="请输入金额" v-model.number="ruleForm.amount" type="number" style="width: 240px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showUpPoints = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import config from "@/config/env";
import axios from "axios";
import { timeForStr } from "@/utils/index";
import assetDetails from "@/components/assetDetails/index.vue";
export default {
  components: {
    assetDetails
  },
  data() {
    return {
      totalNum: 0,
      registerAt: null,
      rangeAt: null,
      searchForm: {
        businessesId: null,
        withdrawalStatus: null
      },
      sortData: {
        orderBy: null,
        orderType: null,
      },
      page: 1,
      size: 20,
      ruleForm: {
        businessesUserId: null,
        businessesUserIds: null,
        coin: null,
        balance: null,
        amount: null,
      },
      userList: [],
      platformDrop: [{ text: "OS", value: "OS" }, { text: "Deepool", value: "DEEPOOL" }],
      statusDrop: [{ text: "正常", value: 1 }, { text: "限制", value: 2 }],
      rules: {
        coin: [{ required: true, message: "请选择币种", trigger: ["change", "blur"] }],
        amount: [{ required: true, message: "请输入金额", trigger: ["change", "blur"] }],
      },
      httpPath: "",
      uploadHeader: {
        certificate: sessionStorage.getItem("token"),
      },
      // 资产详情
      showAsset: false,
      assetData: null,
      // 上下分
      showUpPoints: false,
      coinDrop: [], // 币种
      assetList: []
    };
  },
  created() {
    this.fetchCoinDrop();
    this.fetchUserList();
    this.httpPath = config.api;
  },
  methods: {
    timeForStr: timeForStr,
    searchFun() {
      let { registerAt, rangeAt } = this;
      let registrationTimeStart, registrationTimeEnd, accountChangeTimeStart, accountChangeTimeEnd;

      if (registerAt) {
        // 注册起止时间
        registrationTimeStart = registerAt[0];
        registrationTimeEnd = registerAt[1];
      }

      if (rangeAt) {
        // 账变起止时间
        accountChangeTimeStart = rangeAt[0];
        accountChangeTimeEnd = rangeAt[1];
      }

      return {
        ...this.searchForm,
        registrationTimeStart,
        registrationTimeEnd,
        accountChangeTimeStart,
        accountChangeTimeEnd
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

      this.fetchUserList();
    },
    async fetchUserList(isSearch = true) {
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

      let res = await this.$http.getUserList(data);
      if (res) {
        this.userList = res.records;
        this.totalNum = res.total;
      }
    },
    // 币种下拉
    async fetchCoinDrop() {
      let res = await this.$http.getCoinDownBox();
      if (res) {
        this.coinDrop = res;
      }
    },
    // 打开上下分弹窗
    async toUpdate(event) {
      const { businessesUserId } = event;
      this.ruleForm.businessesUserId = businessesUserId;
      this.showUpPoints = true;
      const res = await this.$http.getUserDetails({
        businessesUserId: businessesUserId
      })

      if (res) {
        this.assetList = res.assetsVOS;
        this.ruleForm.balance = 0;
      }
    },
    // 打开批量上下分弹窗
    toUpdateBatch() { },
    changeCoin(event) {
      const { assetList } = this;
      if (!(assetList && assetList.length > 0)) return;

      const coin = this.assetList.find(e => e.coinName == event);
      this.ruleForm.balance = coin?.balance || 0;
    },
    submitForm() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (valid) {
          const { ruleForm } = this;
          let res = await this.$http.userUpAmount(ruleForm);

          if (res) {
            this.$message.success("操作成功！");
            this.showUpPoints = false;
            this.fetchUserList();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 打开详情弹窗
    async handleDetail(event) {
      const res = await this.$http.getUserDetails({
        businessesUserId: event.businessesUserId
      })

      if (res) {
        this.assetData = res;
        this.showAsset = true;
      }
    },
    // 关闭弹窗
    handleClose() {
      this.showAsset = false;
      this.assetData = null;
    },
    // 限制操作
    handleStatus(row) {
      const { userName, withdrawalStatus } = row;
      this.$confirm(`确定要将用户【${userName}】${withdrawalStatus == 1 ? '限制提款' : '解除限制'}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$http.userLockOrUn({ businessesUserId: row.businessesUserId });
          if (res) {
            this.$message.success("操作成功！");
            this.fetchUserList();
          }
        })
        .catch(() => { });
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
      this.fetchUserList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchUserList(false);
    },
    handleUpload(res, files, fileList) {
      this.loading = false;
      if (res.status == 200) {
        this.$message.success("导入成功");
        this.fetchUserList();
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

.coin-box {
  display: flex;
  align-items: center;
  justify-content: space-between;


}

.coin-info {
  display: flex;
  align-items: center;

  .coin-img {
    width: 20px;
    height: 20px;
    margin-right: 4px;
  }

  .coin-name {
    font-size: 16px;
    color: #303133;
  }
}


.coin-value {
  font-size: 14px;
  color: #828080;
}

/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
