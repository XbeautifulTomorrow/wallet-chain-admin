<template>
  <div>
    <div class="searchBox">
      <div class="searchLeft">
        <el-input @keyup.enter.native="fetchWalletGatherStatisticsList" clearable v-model="searchForm.idOrHashOrAddress"
          placeholder="输入Hash/流水号/被归集钱包/归集钱包"></el-input>

        <el-select v-model="searchForm.businessesId" filterable clearable @change="fetchWalletGatherStatisticsList()"
          placeholder="全部平台">
          <el-option v-for="(item, index) in platformDrop" :key="index" :label="item.businessesName" :value="item.id">
          </el-option>
        </el-select>

        <el-select v-model="searchForm.chainName" filterable clearable @change="fetchWalletGatherStatisticsList()"
          placeholder="所有网络">
          <el-option v-for="(item, index) in networkDrop" :key="index" :label="item.chainName" :value="item.chainName">
          </el-option>
        </el-select>

        <el-select v-model="searchForm.coinName" filterable clearable @change="fetchWalletGatherStatisticsList()"
          placeholder="所有币种">
          <el-option v-for="(item, index) in coinDrop" :key="index" :label="item.coinName" :value="item.coinName">
          </el-option>
        </el-select>

        <el-select v-model="searchForm.status" filterable clearable @change="fetchWalletGatherStatisticsList()"
          placeholder="全部状态">
          <el-option v-for="(item, index) in statusDrop" :key="index" :label="item.text" :value="item.value">
          </el-option>
        </el-select>

        <el-date-picker v-model="initiateAt" style="width: 260px; margin-right: 20px" type="daterange"
          range-separator="-" start-placeholder="发起时间开始" end-placeholder="发起时间结束" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>

        <el-date-picker v-model="completeAt" style="width: 260px; margin-right: 20px" type="daterange"
          range-separator="-" start-placeholder="完成时间开始" end-placeholder="完成时间结束" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>

        <el-button size="medium" type="primary" icon="el-icon-search"
          @click="fetchWalletGatherStatisticsList">搜索</el-button>

        <el-button size="medium" type="warning" icon="el-icon-download" @click="toExportData">导出</el-button>
      </div>
      <div class="searchRight"></div>
    </div>
    <el-table border :data="gatherStatisticsList" height="73vh" style="width: 99%" @sort-change="sortChange">
      <el-table-column prop="id" label="流水号"></el-table-column>
      <el-table-column prop="hash" label="Hash" min-width="200">
        <template slot-scope="scope">
          <el-link type="primary">{{ scope.row.hash }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="walletAddress" label="归集钱包" show-overflow-tooltip></el-table-column>
      <el-table-column prop="collectedWallet" label="被归集钱包" show-overflow-tooltip></el-table-column>
      <el-table-column prop="businessesName" label="平台"></el-table-column>
      <el-table-column prop="chainName" label="网络"></el-table-column>
      <el-table-column prop="coinName" label="币种"></el-table-column>
      <el-table-column prop="amount" label="数量"></el-table-column>
      <el-table-column prop="gasAmount" label="Gas"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == '1'" style="color: #0E9EFD;">待确认</span>
          <span v-if="scope.row.status == '2'" style="color: #04B000;">完成</span>
          <span v-else-if="scope.row.status == '3'" style="color: #C1C1C1;">失败</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="发起时间" min-width="160">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.createTime, "YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column prop="completeTime" label="完成时间" min-width="160">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.completeTime, "YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column label="查看交易" min-width="120" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="toEdit(scope.row)">查看</el-button>
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
      completeAt: null,
      searchForm: {
        idOrHashOrAddress: null,
        businessesId: null,
        chainName: null,
        coinName: null,
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
      platformDrop: [], // 平台
      networkDrop: [], // 网络
      coinDrop: [], // 币种
      statusDrop: [], // 状态
      gatherStatisticsList: [],
      httpPath: ""
    };
  },
  created() {
    this.fetchPlatformDrop();
    this.fetchNetworkDrop();
    this.fetchCoinDrop();
    this.fetchWalletGatherStatisticsList();
    this.httpPath = config.api;

    this.statusDrop = [
      {
        text: "待确认",
        value: "1"
      },
      {
        text: "成功",
        value: "2"
      },
      {
        text: "失败",
        value: "3"
      }
    ]
  },
  methods: {
    timeForStr: timeForStr,
    searchFun() {
      let { initiateAt, completeAt } = this;
      let createTimeStart, createTimeEnd, completeTimeStart, completeTimeEnd;



      if (initiateAt) {
        // 发起起止时间
        createTimeStart = initiateAt[0];
        createTimeEnd = initiateAt[1];
      }

      if (completeAt) {
        // 完成起止时间
        completeTimeStart = completeAt[0];
        completeTimeEnd = completeAt[1];
      }

      return {
        ...this.searchForm,
        createTimeStart,
        createTimeEnd,
        completeTimeStart,
        completeTimeEnd
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

      this.fetchWalletGatherStatisticsList();
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
    async fetchWalletGatherStatisticsList(isSearch = true) {
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

      const res = await this.$http.getWalletGatherStatisticsList(data);
      if (res) {
        this.gatherStatisticsList = res.records;
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
      this.fetchWalletGatherStatisticsList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchWalletGatherStatisticsList(false);
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
