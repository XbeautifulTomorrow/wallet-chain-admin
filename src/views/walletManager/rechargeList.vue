<template>
  <div>
    <div class="searchBox">
      <div class="searchLeft">
        <el-input @keyup.enter.native="fetchWalletRechargeList" clearable v-model="searchForm.idOrUserIdOrWalletAddress"
          placeholder="输入ID/用户ID/钱包地址"></el-input>

        <el-select v-model="searchForm.businessesId" filterable clearable @change="fetchWalletRechargeList()"
          placeholder="全部平台">
          <el-option v-for="(item, index) in platformDrop" :key="index" :label="item.businessesName" :value="item.id">
          </el-option>
        </el-select>

        <el-select v-model="searchForm.chainName" filterable clearable @change="fetchWalletRechargeList()"
          placeholder="所有网络">
          <el-option v-for="(item, index) in networkDrop" :key="index" :label="item.chainName" :value="item.chainName">
          </el-option>
        </el-select>

        <el-select v-model="searchForm.coinName" filterable clearable @change="fetchWalletRechargeList()"
          placeholder="所有币种">
          <el-option v-for="(item, index) in coinDrop" :key="index" :label="item.coinName" :value="item.coinName">
          </el-option>
        </el-select>

        <el-date-picker v-model="createAt" style="width: 260px; margin-right: 20px" type="daterange" range-separator="-"
          start-placeholder="创建时间开始" end-placeholder="创建时间结束" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <el-date-picker v-model="rangeAt" style="width: 320px; margin-right: 20px" type="daterange" range-separator="-"
          start-placeholder="最后账变时间开始" end-placeholder="最后账变时间结束" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>

        <el-button size="medium" type="primary" icon="el-icon-search" @click="fetchWalletRechargeList()">搜索</el-button>
        <el-button size="medium" type="primary" icon="el-icon-search">查看全链统计</el-button>
      </div>
      <div class="searchRight"></div>
    </div>
    <el-table border :data="rechargeList" height="73vh" style="width: 99%" @sort-change="sortChange">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="walletAddress" label="地址" show-overflow-tooltip></el-table-column>
      <el-table-column prop="userName" label="所属用户"></el-table-column>
      <el-table-column prop="businessesName" label="平台"></el-table-column>
      <el-table-column prop="chainName" label="网络"></el-table-column>
      <el-table-column prop="coinName" label="币种"></el-table-column>
      <el-table-column prop="balance" label="余额"></el-table-column>
      <el-table-column prop="userRecharge" label="用户转入"></el-table-column>
      <el-table-column prop="gasAmount" label="转入GAS"></el-table-column>
      <el-table-column prop="aggregationAmount" label="已归集金额" min-width="100"></el-table-column>
      <el-table-column prop="aggregationNumber" label="归集次数"></el-table-column>
      <el-table-column prop="gasAggregationAmount" label="归集GAS"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="160">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.createTime, "YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column prop="accountChangeTime" label="最后账变时间" min-width="160">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.accountChangeTime, "YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="toEdit(scope.row)">详情</el-button>
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
      createAt: null,
      rangeAt: null,
      searchForm: {
        idOrUserIdOrWalletAddress: null,
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
      rechargeList: [],
      httpPath: ""
    };
  },
  created() {
    this.fetchPlatformDrop();
    this.fetchNetworkDrop();
    this.fetchCoinDrop();
    this.fetchWalletRechargeList();
    this.httpPath = config.api;
  },
  methods: {
    timeForStr: timeForStr,
    searchFun() {
      let { createAt, rangeAt } = this;
      let createTimeStart, createTimeEnd, accountChangeTimeStart, accountChangeTimeEnd;

      if (createAt) {
        // 创建起止时间
        createTimeStart = createAt[0];
        createTimeEnd = createAt[1];
      }

      if (rangeAt) {
        // 最后账变起止时间 
        accountChangeTimeStart = rangeAt[0];
        accountChangeTimeEnd = rangeAt[1];
      }

      return {
        ...this.searchForm,
        createTimeStart,
        createTimeEnd,
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

      this.fetchWalletRechargeList();
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
    async fetchWalletRechargeList(isSearch = true) {
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

      const res = await this.$http.getWalletRechargeList(data);
      if (res) {
        this.rechargeList = res.records;
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
      this.fetchWalletRechargeList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchWalletRechargeList(false);
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
