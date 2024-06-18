<template>
  <div>
    <div class="searchBox">
      <div class="searchLeft">

        <el-select v-model="searchForm.businessesId" filterable clearable @change="fetchWalletGasList()"
          placeholder="全部平台">
          <el-option v-for="(item, index) in platformDrop" :key="index" :label="item.businessesName" :value="item.id">
          </el-option>
        </el-select>

        <el-select v-model="searchForm.chainName" filterable clearable @change="fetchWalletGasList()"
          placeholder="所有网络">
          <el-option v-for="(item, index) in networkDrop" :key="index" :label="item.chainName" :value="item.chainName">
          </el-option>
        </el-select>

        <el-select v-model="searchForm.coinName" filterable clearable @change="fetchWalletRechargeList()"
          placeholder="所有币种">
          <el-option v-for="(item, index) in coinDrop" :key="index" :label="item.coinName" :value="item.coinName">
          </el-option>
        </el-select>

        <el-button size="medium" type="primary" icon="el-icon-search" @click="fetchWalletGasList()">搜索</el-button>
      </div>
      <div class="searchRight"></div>
    </div>
    <el-table border :data="gasList" height="73vh" style="width: 99%" @sort-change="sortChange">
      <el-table-column prop="businessesName" label="平台"></el-table-column>
      <el-table-column prop="walletAddress" label="地址" show-overflow-tooltip></el-table-column>
      <el-table-column prop="chainName" label="网络"></el-table-column>
      <el-table-column prop="coinName" label="币种"></el-table-column>
      <el-table-column prop="balance" label="余额"></el-table-column>
      <el-table-column prop="" label="总转出"></el-table-column>
      <el-table-column prop="" label="总GAS"></el-table-column>
      <el-table-column label="操作" min-width="120">
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
      searchForm: {
        businessesId: null,
        chainName: null,
        coinName: null
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
      gasList: [],
      httpPath: ""
    };
  },
  created() {
    this.fetchPlatformDrop();
    this.fetchNetworkDrop();
    this.fetchCoinDrop();
    this.fetchWalletGasList();
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

      this.fetchWalletGasList();
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
    async fetchWalletGasList(isSearch = true) {
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

      const res = await this.$http.getWalletGasList(data);
      if (res) {
        this.gasList = res.records;
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
      this.fetchWalletGasList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchWalletGasList(false);
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
