<template>
  <div class="content">
    <div class="searchBox">
      <div class="searchLeft">
        <el-input clearable v-model="coinName" placeholder="请输入币种名称" maxlength="20"></el-input>
        <el-select v-model="miningTechnology" placeholder="请选择挖矿技术" clearable>
          <el-option label="自研挖矿" value="1"> </el-option>
          <el-option label="中转挖矿" value="2"> </el-option>
        </el-select>
        <el-button size="medium" type="primary" icon="el-icon-search" @click="handleSearch()">
          搜索
        </el-button>
        <el-button size="medium" type="primary" @click="handleAdd">
          新增
        </el-button>
      </div>
      <div class="searchRight"></div>
    </div>
    <el-table border :data="chainList" style="width: 100%">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="coinCode" label="币种名称" />
      <el-table-column prop="miningTechnology" label="挖矿技术">
        <template slot-scope="scope">
          {{ scope.row.miningTechnology == 1 ? "自研挖矿" : "中转挖矿" }}
        </template>
      </el-table-column>
      <el-table-column prop="arithmetic" label="算法" />
      <el-table-column prop="incomeModel" label="收益模式" />
      <el-table-column prop="incomeModel" label="起付额范围">
        <template slot-scope="scope">
          {{
            `${scope.row.minimumTransferLimit}~${scope.row.maxTransferLimit}`
          }}
        </template>
      </el-table-column>
      <el-table-column prop="rateModel" label="费率">
        <template slot-scope="scope">{{ scope.row.rateModel }}%</template>
      </el-table-column>
      <el-table-column prop="whetherDisplay">
        <template slot="header">
          <span>是否显示</span>
          <el-tooltip effect="dark" content="关闭后不显示的地方：首页、创新币种、新增子账户选择币种、收益计算器" placement="top">
            <i class="el-icon-info" style="margin-left: 8px" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <div style="height: 22px">
            <el-switch style="display: block" v-model="scope.row.whetherDisplay" :active-value="1" :inactive-value="2"
              @change="changeSwitch(scope.row)" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="navDisplay">
        <template slot="header">
          <span>导航栏是否显示</span>
          <el-tooltip effect="dark" content="选择否不展示的地方：观察者链接选择币种" placement="top">
            <i class="el-icon-info" style="margin-left: 8px" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <div style="height: 22px">
            <el-switch style="display: block" v-model="scope.row.navDisplay" :active-value="1" :inactive-value="2"
              @change="onNavDisplay(scope.row)" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="arithmetic" label="算法" />
      <el-table-column label="挖矿服务地址" min-width="300px">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.addressVOS" :key="index">
            {{ `(${formatStatus(item)})${item.address}` }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="scope" label="操作" width="220" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleModify(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageBox">
      <el-pagination style="margin-top: 12px" layout="total, sizes, prev, pager, next, jumper" background
        :total="pagination.total" :current-page="page" :page-sizes="pagination.pageSizes" :page-size="size"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog :title="!ruleForm.id ? '新增' : '编辑'" :visible.sync="showDialog" width="540px" :close-on-click-modal="false"
      :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="排序" prop="sort">
          <el-input placeholder="数字越小排在越前面" v-model="ruleForm.sort" type="number" min="0" style="width: 340px"></el-input>
        </el-form-item>
        <el-form-item label="币种" prop="coinCode">
          <el-select v-model="ruleForm.coinCode" style="width: 340px" placeholder="请选择币种" clearable>
            <el-option v-for="(item, index) in coinList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="挖矿技术" prop="miningTechnology">
          <el-select v-model="ruleForm.miningTechnology" style="width: 340px" placeholder="请选择挖矿技术" clearable>
            <el-option label="自研挖矿" :value="1"></el-option>
            <el-option label="中转挖矿" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="算法" prop="arithmetic">
          <el-input placeholder="请输入算法" v-model="ruleForm.arithmetic" maxlength="50" style="width: 340px"></el-input>
        </el-form-item>
        <el-form-item label="收益模式" prop="incomeModel">
          <el-input placeholder="请输入收益模式" v-model="ruleForm.incomeModel" maxlength="50" style="width: 340px"></el-input>
        </el-form-item>
        <el-form-item label="起付额范围" required>
          <div class="scope-box">
            <el-form-item prop="minimumTransferLimit">
              <el-input placeholder="最小值" v-model="ruleForm.minimumTransferLimit" type="number"></el-input>
            </el-form-item>
            <div style="width: 30px; flex: none">—</div>
            <el-form-item prop="maxTransferLimit">
              <el-input placeholder="最大值" v-model="ruleForm.maxTransferLimit" type="number"></el-input>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="费率" prop="rateModel">
          <el-input placeholder="请输入费率" v-model="ruleForm.rateModel" type="number" style="width: 340px">
            <div slot="append">%</div>
          </el-input>
        </el-form-item>
        <el-form-item label="挖矿服务地址">
          <div class="service-box" v-for="(config, index) in conifgList" :key="index">
            <div class="service-l">
              <el-select v-model="config.type" placeholder="类型" clearable style="width: 160px">
                <el-option v-for="item in typeOps" :key="item.type" :label="item.label" :value="item.type"></el-option>
              </el-select>
              <el-input placeholder="地址" v-model="config.address"> </el-input>
            </div>
            <el-button @click="addServe" v-if="index == 0" icon="el-icon-plus" class="service-r"></el-button>
            <el-button @click="delServe(index)" v-else icon="el-icon-minus" class="service-r"></el-button>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import pagination from "@/mixins/pagination";
import { deepClone, accurateDecimal } from "@/utils/index";

export default {
  name: "NoticeList",
  mixins: [pagination],
  data() {
    return {
      coinName: null,
      miningTechnology: null,
      coinList: [],
      ruleForm: {
        sort: null, //排序
        coinCode: null, //币种名称
        arithmetic: null, //算法
        miningTechnology: null, // 挖矿技术
        incomeModel: null, //收益模式
        minimumTransferLimit: null, //起付额最小值
        maxTransferLimit: null, //起付额最大值
        rateModel: null, //费率
      },
      showDialog: false,
      chainList: [],
      typeOps: [],
      conifgList: [{ type: null, address: null }],
      rules: {},
      minTimer: null,
      maxTimer: null,
      rateTimer: null,
      page: 1,
      size: 10,
    };
  },
  watch: {
    "ruleForm.minimumTransferLimit": function (newV, oldV) {
      if (this.minTimer) {
        clearTimeout(this.minTimer);
        this.minTimer = null;
      }

      if (!newV) return;

      this.minTimer = setTimeout(() => {
        this.ruleForm.minimumTransferLimit = accurateDecimal(newV, 4);
        this.$forceUpdate();
      }, 300);
    },
    "ruleForm.maxTransferLimit": function (newV, oldV) {
      if (this.maxTimer) {
        clearTimeout(this.maxTimer);
        this.maxTimer = null;
      }

      if (!newV) return;

      this.maxTimer = setTimeout(() => {
        this.ruleForm.maxTransferLimit = accurateDecimal(newV, 4);
        this.$forceUpdate();
      }, 300);
    },
    "ruleForm.rateModel": function (newV, oldV) {
      if (this.rateTimer) {
        clearTimeout(this.rateTimer);
        this.rateTimer = null;
      }
      if (newV < 0) {
        this.rateTimer = setTimeout(() => {
          this.ruleForm.rateModel = 0;
        }, 300);
      } else if (newV > 100) {
        this.rateTimer = setTimeout(() => {
          this.ruleForm.rateModel = 100;
        }, 300);
      } else {
        this.rateTimer = setTimeout(() => {
          this.ruleForm.rateModel = accurateDecimal(newV, 2);
        }, 300);
      }
    },
  },
  methods: {
    timeFormate(date, str) {
      return timeForStr(date, str);
    },
    // 获取币种
    async fetchPoolCoin() {
      this.chainList = [];
      let res = await this.$http.coinDownBox({ coinName: "" });

      if (res) {
        this.coinList = res;
      }
    },
    /**
     * @description: 开始查询
     */
    handleSearch() {
      this.page = 1;
      this.fetchPoolCoinList();
    },
    // 获取 list
    async fetchPoolCoinList() {
      this.chainList = [];
      let res = await this.$http.getPoolCoinList({
        coinCode: this.coinName,
        miningTechnology: this.miningTechnology,
        page: this.page,
        size: this.size,
      });

      if (res) {
        this.chainList = res.list;
        this.pagination.total = res.total;
      }
    },
    handleAdd() {
      this.showDialog = true;
    },
    handleModify(event) {
      this.ruleForm = {
        ...event,
      };
      delete this.ruleForm["addressVOS"];
      if (event.addressVOS.length > 0) {
        console.log(event.addressVOS)
        this.conifgList = deepClone(event.addressVOS);
      }
      this.showDialog = true;
    },
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate(async (valid) => {
        if (!valid) return;
        let res = null;
        const { ruleForm, conifgList } = this;

        let isPass = false;
        for (let i = 0; i < conifgList.length; i++) {
          const element = conifgList[i];

          if (!element.type) {
            this.$message.warning("挖矿服务类型未选择!");
            isPass = true;
            return;
          } else if (!element.address) {
            this.$message.warning("挖矿服务地址未填写!");
            isPass = true;
            return;
          }
        }

        if (isPass) return;

        // 数据组装

        const params = {
          ...ruleForm,
          addressList: conifgList,
        };

        res = await this.$http.saveConfig({ ...params });
        if (res) {
          this.$message.success("操作成功！");
          this.handleClose();
          this.fetchPoolCoinList();
        }
      });
    },
    addServe() {
      this.conifgList.push({
        type: null,
        address: null,
      });
    },
    delServe(index) {
      this.conifgList.splice(index, 1);
    },
    handleClose() {
      this.conifgList = [
        {
          type: null,
          address: null,
        },
      ];

      this.ruleForm = {
        sort: null, //排序
        coinCode: null, //币种名称
        arithmetic: null, //算法
        incomeModel: null, //收益模式
        miningTechnology: null, // 挖矿技术
        minimumTransferLimit: null, //起付额最小值
        maxTransferLimit: null, //起付额最大值
        rateModel: null, //费率
      };
      this.showDialog = false;
    },
    async changeSwitch(event) {
      const { id, whetherDisplay } = event;
      const res = await this.$http.whetherDisplayUpdate({
        poolCoinId: id,
        whetherDisplay: whetherDisplay,
      });
      if (res) {
        this.$message.success("操作成功！");
      }
    },
    async onNavDisplay(event) {
      const { id, navDisplay } = event;
      const res = await this.$http.navDisplayUpdate({
        poolCoinId: id,
        navDisplay: navDisplay,
      });
      if (res) {
        this.$message.success("操作成功！");
      }
    },

    handleSizeChange(size) {
      this.size = size;
      this.fetchPoolCoinList();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchPoolCoinList();
    },
    /**
     * @description: 格式化状态
     */
    formatStatus(row) {
      if (row.type == "1") {
        return "显卡";
      } else if (row.type == "2") {
        return "芯片";
      } else if (row.type == "3") {
        return "CPU";
      } else {
        return "内存";
      }
    },
  },
  created() {
    this.fetchPoolCoin();
    this.fetchPoolCoinList();

    this.rules = {
      sort: [
        {
          required: true,
          message: "请输入排序数字",
          trigger: ["blur", "change"],
        },
      ], //排序
      coinCode: [
        {
          required: true,
          message: "请选择币种",
          trigger: ["blur", "change"],
        },
      ], //币种名称
      arithmetic: [
        {
          required: true,
          message: "请输入算法",
          trigger: ["blur", "change"],
        },
      ],
      //挖矿技术
      miningTechnology: [
        {
          required: true,
          message: "请选择挖矿技术",
          trigger: ["blur", "change"],
        },
      ],
      incomeModel: [
        {
          required: true,
          message: "请输入收益模式",
          trigger: ["blur", "change"],
        },
      ], //收益模式
      minimumTransferLimit: [
        {
          required: true,
          message: "请输入最小值",
          trigger: ["blur", "change"],
        },
      ], //起付额最小值
      maxTransferLimit: [
        {
          required: true,
          message: "请输入最大值",
          trigger: ["blur", "change"],
        }, {
          validator: (rule, value, callback) => {
            if (Number(this.ruleForm.minimumTransferLimit) > Number(value)) {
              callback(new Error('最大值必须大于最小值'));
            } else {
              callback();
            }
          },
          trigger: ["blur", "change"],
        }
      ], //起付额最大值
      rateModel: [
        {
          required: true,
          message: "请输入费率",
          trigger: ["blur", "change"],
        },
      ], //费率
    };

    this.typeOps = [
      {
        type: 1,
        label: "显卡",
      },
      {
        type: 2,
        label: "芯片",
      },
      {
        type: 3,
        label: "CPU",
      },
      {
        type: 4,
        label: "内存",
      },
    ];
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

.scope-box {
  width: 340px;
  display: flex;
  align-items: flex-start;
  text-align: center;

  &>div {
    flex: 1;
  }
}

.service-box {
  display: flex;
  align-items: center;
  text-align: center;

  .service-l {
    width: 340px;
    display: flex;
    align-items: flex-start;

    &>div+div {
      margin-left: 8px;
    }
  }

  .service-r {
    margin-left: 10px;
    padding: 0;
    width: 40px;
    height: 40px;
    line-height: 40px;
  }
}

.service-box+.service-box {
  margin-top: 10px;
}

/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

/deep/ input[type="number"] {
  -moz-appearance: textfield;
}
</style>
