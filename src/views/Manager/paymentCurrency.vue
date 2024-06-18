<template>
  <div>
    <div class="searchRight">
      <!-- <el-button
        size="medium"
        type="warning"
        icon="el-icon-plus"
        @click="addVisible = true"
        >新增</el-button
      > -->
    </div>
    <el-table border :data="tableData" height="73vh" style="width: 99%">
      <el-table-column prop="coinCode" label="币种名称"></el-table-column>

      <el-table-column label="是否开始自动审核" min-width="100">
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
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      typeOptions: [],
      tableData: [],
    };
  },
  created() {
    this.getTableList();
  },
  methods: {
    changeSwitch(row) {
      this.$http
        .changeWithDrawal({
          coinCode: row.coinCode,
          checkSwitch: row.checkSwitch == 1 ? 0 : 1,
        })
        .then((res) => {
          this.getTableList();
          this.$message.success("操作成功！");
        });
    },
    toDelete(id) {
      this.deleteVisible = true;
    },
    showTableDialog() {
      this.dialogTableVisible = true;
    },
    toEdit(id) {
      //编辑
      this.addVisible = true;
    },

    async getTableList(val) {
      let res = await this.$http.getWithdrawalconfigList();
      if (res) {
        this.tableData = res;
      }
    },
  },
};
</script>

<style scoped>
</style>
