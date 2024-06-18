<template>
  <div class="content">
    <div class="addBox">
      <el-input
        class="inner"
        v-model="searchForm.coinName"
        placeholder="请输入币种名称"
        clearable
      ></el-input>

      <el-input
        class="inner"
        v-model="searchForm.chainType"
        placeholder="请输入所在网络"
        clearable
        style="margin-left: 20px"
      ></el-input>

      <el-button
        size="medium"
        type="primary"
        style="margin-left: 20px"
        icon="el-icon-search"
        @click="getTableList(true)"
      >
        搜索
      </el-button>

      <el-button @click="handleAdd" size="medium" type="primary">
        增加
      </el-button>
    </div>
    <br />
    <p style="font-size: 20px; padding-bottom: 4px">
      添加新的提现币种后，请联系技术人员新增校验方式
    </p>
    <el-table border :data="protocolList" style="width: 100%">
      <el-table-column prop="coinName" label="币种" />
      <el-table-column prop="chainType" label="所在网络" />
      <el-table-column prop="minQuantity" label="最小提现额度" />
      <el-table-column prop="withdrawalFee" label="提现手续费" />
      <el-table-column
        label="是否开始自动审核"
        min-width="100"
        prop="checkSwitch"
      >
        <template slot-scope="scope">
          <div @click="changeSwitch(scope.row)">
            <el-switch
              :value="scope.row.checkSwitch == 1 ? false : true"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="是否开启" min-width="100" prop="status">
        <template slot-scope="scope">
          <div @click="changeSwitch2(scope.row)">
            <el-switch
              :value="scope.row.status == 2 ? false : true"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="scope" label="操作" width="220" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEditor(scope.row)"
            >编辑</el-button
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
        :current-page="page"
        :page-sizes="pagination.pageSizes"
        :page-size="size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      v-if="dialogVisible"
      :title="!ruleForm.id ? '添加角色' : '编辑角色'"
      :visible.sync="dialogVisible"
      width="480px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="140px"
        class="demo-ruleForm"
      >
        <el-form-item label="币种" prop="coinName" required>
          <el-select
            filterable
            v-model="ruleForm.coinName"
            @change="changeCoin"
            placeholder="请选择币种"
          >
            <el-option
              v-for="item in roleListone"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在网络" prop="chainType" required>
          <el-select
            filterable
            v-model="ruleForm.chainType"
            placeholder="请选择所在网络"
          >
            <el-option
              v-for="item in roleList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="最小提现额度"
          prop="minQuantity"
          :rules="rules.minQuantity"
          required
        >
          <el-input
            placeholder="请输入最小提现额度"
            v-model="ruleForm.minQuantity"
            oninput="if(value.length > 20)value=value.slice(0, 20)"
            style="width: 220px"
            required
          ></el-input>
        </el-form-item>

        <el-form-item
          label="提现手续费率"
          prop="withdrawalFee"
          :rules="rules.withdrawalFee"
          required
        >
          <el-input
            placeholder="请输入提现手续费率"
            v-model="ruleForm.withdrawalFee"
            oninput="if(value.length > 50)value=value.slice(0, 50)"
            style="width: 220px"
          ></el-input>
        </el-form-item>

        <el-form-item label=" 是否开启自动审核" prop="checkSwitch" required>
          <el-radio-group v-model="ruleForm.checkSwitch">
            <el-radio :label="0">开启</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否禁用此网络" prop="status" required>
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
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
import pagination from "@/mixins/pagination";

export default {
  name: "NoticeList",
  mixins: [pagination],
  data() {
    return {
      value: "flase",
      ruleForm: {
        id: "",
        coinName: "",
        chainType: "",
        minQuantity: "",
        checkSwitch: "",
        status: "",
        withdrawalFee: "",
      },
      region: "",
      dialogVisible: false,
      protocolList: [],

      searchForm: {
        coinName: "",
        chainType: "",
      },
      roleList: [],
      roleListone: [],
      page: 1,
      size: 10,

      rules: {
        roleName: [
          { required: true, message: "请输入最小提现额度！", trigger: "blur" },
        ],
        remark: [
          { required: true, message: "请输入提现手续费率", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.fetchGetBanner();
    this.getRoleListone();
  },
  methods: {
    // timeFormate(date, str) {
    //   return timeForStr(date, str);
    // },
    // 获取 list
    async fetchGetBanner() {
      this.protocolList = [];
      let res = await this.$http.withdrawalList({
        page: this.page,
        size: this.size,
      });
      if (res) {
        this.protocolList = res.list;
        this.pagination.total = res.total;
      }
    },

    //搜索
    async getTableList(val) {
      if (val) {
        this.searchForm.page = 1;
      }
      let searchForm = { ...this.searchForm };

      let res = await this.$http.withdrawalList({ ...searchForm });
      if (res) {
        this.protocolList = res.list;
        this.totalNum = res.total;
      }
    },

    //是否开始自动审核
    changeSwitch(row) {
      let coinWithdrawalId = row.id;
      let checkSwitch = row.checkSwitch;
      this.$http
        .coinCheckSwitch({
          coinWithdrawalId: coinWithdrawalId,
          checkSwitch: checkSwitch == 0 ? 1 : 0,
        })
        .then((res) => {
          this.getTableList();
          //  this.$message.success('操作成功！')
        });
    },
    //是否禁用
    changeSwitch2(row) {
      let coinWithdrawalId = row.id;
      let status = row.status;
      this.$http
        .coinUpdateStatus({
          coinWithdrawalId: coinWithdrawalId,
          status: status == 1 ? 2 : 1,
        })
        .then((res) => {
          this.getTableList();
          //  this.$message.success('操作成功！')
        });
    },

    //保存
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.ruleForm.id) {
            res = await this.$http.withdrawalUpdate({ ...this.ruleForm });
          } else {
            res = await this.$http.withdrawalSave({ ...this.ruleForm });
          }
          if (res) {
            this.$message.success("操作成功！");
            this.dialogVisible = false;
            this.getTableList();
          }
        } else {
          this.$message.error("没有权限访问");
          // console.log("error submit!!");
          return false;
        }
      });
    },
    //币种下拉框
    async getRoleListone() {
      let res = await this.$http.coinDownBox({
        coinName: "",
      });
      if (res) {
        this.roleListone = res;
      }
    },
    async changeCoin(event) {
      this.ruleForm.coinName = event;
      this.getRoleList();
    },
    // 所在网络下拉
    async getRoleList() {
      const { coinName, chainType } = this.ruleForm;
      let res = await this.$http.coinDownBoxTwo({
        coinName: coinName,
        chainType: chainType,
      });
      if (res) {
        this.roleList = res;
      }
    },

    handleAdd() {
      this.dialogVisible = true;
      this.ruleForm.id = "";
      this.ruleForm.coinName = "";
      this.ruleForm.chainType = "";
      this.ruleForm.minQuantity = "";
      this.ruleForm.withdrawalFee = "";
      this.ruleForm.checkSwitch = "";
      this.ruleForm.status = "";
    },
    handleEditor(row) {
      this.ruleForm = row;
      this.dialogVisible = true;
      this.getRoleList();
    },

    handleDel(row) {
      this.$confirm("确定要执行此操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(async () => {
          const res = await this.$http.annOnOff({
            annId: row.id,
            status: row.status == 0 ? 1 : 0,
          });
          if (res) {
            this.fetchGetBanner();
            this.$message.success("操作成功");
          }
        })
        .catch((err) => {
          // console.error(err);
        });
    },
    handleSizeChange(size) {
      this.size = size;
      this.fetchGetBanner();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchGetBanner();
    },
  },
};
</script>
<style lang="scss" scoped>
.inner {
  width: 15% !important;
}
.addBox {
  padding: 10px 0;
  display: flex;
}
</style>
