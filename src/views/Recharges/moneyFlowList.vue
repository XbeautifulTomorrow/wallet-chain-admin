<template>
  <div>
    <div class="searchBox">
      <div class="searchLeft">
        <el-input @keyup.enter.native="fetchAssetFlowList" clearable v-model="searchForm.flowIdOrdHash"
          placeholder="输入流水号/hash"></el-input>

        <el-input @keyup.enter.native="fetchAssetFlowList" clearable v-model="searchForm.userIdOrWalletAddress"
          placeholder="输入用户ID/钱包地址/闪兑ID"></el-input>

        <el-select v-model="searchForm.flowType" filterable clearable @change="fetchAssetFlowList()"
          placeholder="全部金流类型">
          <el-option v-for="(item, index) in assetFlowDrop" :key="index" :label="item.text" :value="item.value">
          </el-option>
        </el-select>

        <el-select v-model="searchForm.flowSource" filterable clearable @change="fetchAssetFlowList()"
          placeholder="全部渠道">
          <el-option v-for="(item, index) in channelDrop" :key="index" :label="item.text" :value="item.value">
          </el-option>
        </el-select>

        <el-select v-model="searchForm.businessesId" filterable clearable @change="fetchAssetFlowList()"
          placeholder="全部平台">
          <el-option v-for="(item, index) in platformDrop" :key="index" :label="item.businessesName" :value="item.id">
          </el-option>
        </el-select>

        <el-select v-model="searchForm.chainName" filterable clearable @change="fetchAssetFlowList()"
          placeholder="所有网络">
          <el-option v-for="(item, index) in networkDrop" :key="index" :label="item.chainName" :value="item.chainName">
          </el-option>
        </el-select>

        <el-select v-model="searchForm.coinName" filterable clearable @change="fetchAssetFlowList()" placeholder="所有币种">
          <el-option v-for="(item, index) in coinDrop" :key="index" :label="item.coinName" :value="item.coinName">
          </el-option>
        </el-select>

        <el-date-picker v-model="rangeAt" style="width: 260px; margin-right: 20px" type="daterange" range-separator="-"
          start-placeholder="账变时间开始" end-placeholder="账变时间结束" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>

        <el-button size="medium" type="primary" icon="el-icon-search" @click="fetchAssetFlowList">搜索</el-button>

        <el-button size="medium" type="warning" icon="el-icon-download" @click="toExportData">导出</el-button>
      </div>
      <div class="searchRight"></div>
    </div>
    <el-table border :data="assetFlowList" height="73vh" style="width: 99%" @sort-change="sortChange">
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
      <el-table-column prop="flowType" label="金流类型">
        <template slot-scope="scope">
          <span v-if="scope.row.flowType == 'RECHARGE'">充值</span>
          <span v-if="scope.row.flowType == 'CONSUME'">消费</span>
        </template>
      </el-table-column>
      <el-table-column prop="flowSource" label="渠道">
        <template slot-scope="scope">
          <span v-if="scope.row.flowSource == 'RECHARGE'">充值</span>
          <span v-if="scope.row.flowSource == 'WITHDRAWALS'">提款</span>
          <span v-if="scope.row.flowSource == 'CONSUME'">消费</span>
          <span v-if="scope.row.flowSource == 'CONVERT'">闪兑</span>
          <span v-if="scope.row.flowSource == 'EXCHANGE'">兑换</span>
        </template>
      </el-table-column>
      <el-table-column prop="businessesName" label="平台"></el-table-column>
      <el-table-column prop="coinName" label="金流币种"></el-table-column>
      <el-table-column prop="chainName" label="网络"></el-table-column>
      <el-table-column prop="remark" label="闪兑ID">
        <template slot-scope="scope">
          <span v-if="scope.row.flowSource == 'CONVERT'">{{ scope.row.remark }}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="hash" label="Hash" min-width="200">
        <template slot-scope="scope">
          <el-link type="primary">{{ scope.row.hash }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="walletAddress" label="钱包地址" show-overflow-tooltip></el-table-column>
      <el-table-column prop="remark" label="订单号">
        <template slot-scope="scope">
          <span v-if="scope.row.flowSource != 'CONVERT'">{{ scope.row.remark }}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="traAmount" label="币种金额" fixed="right">
        <template slot-scope="scope">
          <span v-if="scope.row.traAmount > 0" style="color: #21AE04;">+{{ scope.row.traAmount }}</span>
          <span v-else style="color: #FF0707;">{{ scope.row.traAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="changeAmount" label="余额变化" fixed="right">
        <template slot-scope="scope">
          <span v-if="scope.row.traAmount > 0" style="color: #21AE04;">+{{ scope.row.changeAmount }}</span>
          <span v-else style="color: #FF0707;">{{ scope.row.changeAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="assetBalance" label="余额" fixed="right"></el-table-column>
      <el-table-column prop="accountChangeTime" label="账变时间" min-width="160" fixed="right">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.accountChangeTime, "YYYY-MM-DD HH:mm:ss") }}
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
      rangeAt: null,
      searchForm: {
        flowIdOrdHash: null,
        userIdOrWalletAddress: null,
        flowType: null,
        flowSource: null,
        businessesId: null,
        chainName: null,
        coinName: null,
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
      assetFlowDrop: [], // 金流类型
      channelDrop: [], // 渠道
      platformDrop: [], // 平台
      networkDrop: [], // 网络
      coinDrop: [], // 币种
      assetFlowList: [],
      httpPath: ""
    };
  },
  created() {
    this.fetchPlatformDrop();
    this.fetchNetworkDrop();
    this.fetchCoinDrop();
    this.fetchAssetFlowList();
    this.httpPath = config.api;

    this.assetFlowDrop = [
      { text: "充值", value: "RECHARGE" },
      { text: "消费", value: "CONSUME" },
    ]

    this.channelDrop = [
      { text: "充值", value: "RECHARGE" },
      { text: "消费", value: "CONSUME" },
      { text: "提款", value: "WITHDRAWALS" },
      { text: "闪兑", value: "CONVERT" },
      { text: "兑换", value: "EXCHANGE" }
    ]
  },
  methods: {
    timeForStr: timeForStr,
    searchFun() {
      let { rangeAt } = this;
      let accountChangeTimeStart, accountChangeTimeEnd;



      if (rangeAt) {
        // 账变起止时间
        accountChangeTimeStart = rangeAt[0];
        accountChangeTimeEnd = rangeAt[1];
      }

      return {
        ...this.searchForm,
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

      this.fetchAssetFlowList();
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
    async fetchAssetFlowList(isSearch = true) {
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

      const res = await this.$http.getAssetFlowList(data);
      if (res) {
        this.assetFlowList = res.records;
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
      this.fetchAssetFlowList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchAssetFlowList(false);
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
