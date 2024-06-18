<template>
  <div>
    <div class="searchBox">
      <div class="searchLeft">
        <el-input @keyup.enter.native="fetchWithdrawalList" clearable v-model="searchForm.idOrHashOrFlowId"
          placeholder="订单ID\hash\流水号"></el-input>

        <el-input @keyup.enter.native="fetchWithdrawalList" clearable v-model="searchForm.userId"
          placeholder="输入用户ID"></el-input>

        <el-select v-model="searchForm.businessesId" filterable clearable @change="fetchWithdrawalList()"
          placeholder="全部平台">
          <el-option v-for="(item, index) in platformDrop" :key="index" :label="item.businessesName" :value="item.id">
          </el-option>
        </el-select>

        <el-select v-model="searchForm.chainName" filterable clearable @change="fetchWithdrawalList()"
          placeholder="所有网络">
          <el-option v-for="(item, index) in networkDrop" :key="index" :label="item.chainName" :value="item.chainName">
          </el-option>
        </el-select>

        <el-select v-model="searchForm.coinName" filterable clearable @change="fetchWithdrawalList()"
          placeholder="所有币种">
          <el-option v-for="(item, index) in coinDrop" :key="index" :label="item.coinName" :value="item.coinName">
          </el-option>
        </el-select>

        <el-select v-model="searchForm.auditStatus" filterable clearable @change="fetchWithdrawalList()"
          placeholder="全部状态">
          <el-option v-for="(item, index) in statusDrop" :key="index" :label="item.text" :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker v-model="initiateAt" style="width: 260px; margin-right: 20px" type="daterange"
          range-separator="-" start-placeholder="发起时间开始" end-placeholder="发起时间结束" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <el-date-picker v-model="reviewAt" style="width: 260px; margin-right: 20px" type="daterange" range-separator="-"
          start-placeholder="审核时间开始" end-placeholder="审核时间结束" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <el-date-picker v-model="arrivalAt" style="width: 260px; margin-right: 20px" type="daterange"
          range-separator="-" start-placeholder="到账时间开始" end-placeholder="到账时间结束" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>

        <el-button size="medium" type="primary" icon="el-icon-search" @click="fetchWithdrawalList">搜索</el-button>

        <el-button size="medium" type="warning" icon="el-icon-download" @click="toExportData">导出</el-button>
      </div>
      <div class="searchRight"></div>
    </div>
    <el-table border :data="withdrawalList" height="73vh" style="width: 99%" @sort-change="sortChange">
      <el-table-column prop="flowId" label="流水号"></el-table-column>
      <el-table-column label="用户ID/昵称" min-width="100">
        <template slot-scope="scope">
          <p :style="{ color: scope.row.userType == 'INNER' ? 'red' : '#000' }">
            {{ scope.row.userId || "--" }}
          </p>
          <p :style="{ color: scope.row.userType == 'INNER' ? 'red' : '#000' }">
            {{ scope.row.userName || "--" }}
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="businessesName" label="平台"></el-table-column>
      <el-table-column prop="chainName" label="网络"></el-table-column>
      <el-table-column prop="coinName" label="币种"></el-table-column>
      <el-table-column prop="assetBalance" label="币种余额"></el-table-column>
      <el-table-column prop="amount" label="提款数量"></el-table-column>
      <el-table-column prop="fee" label="手续费"></el-table-column>
      <el-table-column prop="actualArrival" label="实际到账"></el-table-column>
      <el-table-column prop="flowId" label="流水号"></el-table-column>
      <el-table-column prop="hash" label="Hash" min-width="200">
        <template slot-scope="scope">
          <el-link type="primary">{{ scope.row.hash }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="gasAmount" label="Gas"></el-table-column>
      <el-table-column prop="walletAddress" label="提款钱包" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="发起时间" min-width="160">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.createTime, "YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column prop="auditTime" label="审核时间" min-width="160">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.auditTime, "YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column prop="arrivalTime" label="到账时间" min-width="160">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.arrivalTime, "YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column prop="auditStatus" label="审核状态" fixed="right">
        <template slot-scope="scope">
          <span v-if="scope.row.auditStatus == 'WAIT'" style="color: #0E9EFD;">待审核</span>
          <span v-else-if="scope.row.auditStatus == 'TRANSFERRING'" style="color: #FD770A;">转账中</span>
          <span v-else-if="scope.row.auditStatus == 'SUCCESS'" style="color: #04B000;">已提现</span>
          <span v-else-if="scope.row.auditStatus == 'FAIL'" style="color: #FF2A07;">转账失败</span>
          <span v-else-if="scope.row.auditStatus == 'REFUSE'" style="color: #C1C1C1;">已拒绝</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" v-if="scope.row.auditStatus == 'WAIT'" type="primary"
            @click="toEdit(scope.row)">审核</el-button>
          <el-button size="small" v-if="scope.row.auditStatus != 'WAIT'" type="primary"
            @click="toEdit(scope.row)">详情</el-button>
          <el-button size="small" v-if="scope.row.auditStatus == 'FAIL'" type="primary"
            @click="toEdit(scope.row)">重试</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageBox" v-if="totalNum > 0">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="searchForm.page" :page-sizes="[20, 30, 40]" :small="false" :page-size="searchForm.size"
        layout="total, sizes, prev, pager, next, jumper" :total="totalNum" :pager-count="5">
      </el-pagination>
    </div>
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
      initiateAt: null,
      reviewAt: null,
      arrivalAt: null,
      searchForm: {
        idOrHashOrFlowId: null,
        userId: null,
        businessesId: null,
        chainName: null,
        coinName: null,
        auditStatus: null
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
      platformDrop: [], // 平台
      networkDrop: [], // 网络
      coinDrop: [], // 币种
      statusDrop: [], // 状态
      withdrawalList: [],
      httpPath: ""
    };
  },
  created() {
    this.fetchPlatformDrop();
    this.fetchNetworkDrop();
    this.fetchCoinDrop();
    this.fetchWithdrawalList();
    this.httpPath = config.api;

    this.statusDrop = [
      {
        text: "待审核",
        value: "WAIT"
      },
      {
        text: "转帐中",
        value: "TRANSFERRING"
      },
      {
        text: "转账成功",
        value: "SUCCESS"
      },
      {
        text: "转账失败",
        value: "FAIL"
      },
      {
        text: "已拒绝",
        value: "REFUSE"
      }
    ]
  },
  methods: {
    timeForStr: timeForStr,
    searchFun() {
      let { initiateAt, reviewAt, arrivalAt } = this;
      let createTimeStart, createTimeEnd, auditTimeStart, auditTimeEnd, arrivalTimeStart, arrivalTimeEnd;



      if (initiateAt) {
        // 发起起止时间
        createTimeStart = initiateAt[0];
        createTimeEnd = initiateAt[1];
      }

      if (reviewAt) {
        // 审核起止时间
        auditTimeStart = reviewAt[0];
        auditTimeEnd = reviewAt[1];
      }

      if (arrivalAt) {
        // 到账起止时间
        arrivalTimeStart = arrivalAt[0];
        arrivalTimeEnd = arrivalAt[1];
      }

      return {
        ...this.searchForm,
        createTimeStart,
        createTimeEnd,
        auditTimeStart,
        auditTimeEnd,
        arrivalTimeStart,
        arrivalTimeEnd
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

      this.fetchWithdrawalList();
    },
    // 平台下拉
    async fetchPlatformDrop() {
      const res = await this.$http.getPlatformDownBox();
      if (res) {
        this.platformDrop = res;
      }
    },
    // 网络下拉
    async fetchNetworkDrop() {
      const res = await this.$http.getChainDownBox();
      if (res) {
        this.networkDrop = res;
      }
    },
    // 币种下拉
    async fetchCoinDrop() {
      let res = await this.$http.getCoinDownBox();
      if (res) {
        this.coinDrop = res;
      }
    },
    async fetchWithdrawalList(isSearch = true) {
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

      const res = await this.$http.getWithdrawalList(data);
      if (res) {
        this.withdrawalList = res.records;
        this.totalNum = res.total;
      }
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
      this.fetchWithdrawalList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchWithdrawalList(false);
    }
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
