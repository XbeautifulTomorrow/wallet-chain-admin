<template>
  <div>
    <div class="searchBox">
      <div class="searchLeft">
        <!-- <el-input size="medium" v-model="searchForm.name" placeholder="请输入角色名称"  @keyup.enter.native="getTableList"></el-input>
      <el-button size="medium" type="primary" icon="el-icon-search" @click="getTableList">搜索</el-button> -->
      </div>
      <div class="searchRight">
        <el-button
          size="medium"
          type="primary"
          icon="el-icon-plus"
          @click="addFunc"
          >增加</el-button
        >
      </div>
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="{
        'background-color': '#F6F6F6',
        'font-weight': '600',
        color: '#333',
        height: '20px',
      }"
      height="73vh"
    >
      <el-table-column prop="roleName" label="角色名称"> </el-table-column>
      <el-table-column prop="remark" label="角色备注"> </el-table-column>
      <el-table-column prop="roleStatus" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.roleStatus == "1" ? "启用" : "禁用" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="way" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editType(scope.row)"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-if="dialogVisible"
      :title="!ruleForm.id ? '添加角色' : '编辑角色'"
      :visible.sync="dialogVisible"
      width="440px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName" :rules="rules.roleName">
          <el-input
            placeholder="请输入角色名称"
            v-model="ruleForm.roleName"
            oninput="if(value.length > 20)value=value.slice(0, 20)"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色备注" prop="remark" :rules="rules.remark">
          <el-input
            placeholder="请输入角色备注"
            v-model="ruleForm.remark"
            oninput="if(value.length > 50)value=value.slice(0, 50)"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色状态" prop="roleStatus">
          <el-radio-group v-model="ruleForm.roleStatus">
            <el-radio :label="1">启用</el-radio>
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
export default {
  data() {
    var checkName = (rule, value, callback) => {
      let reg = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+$");
      if (!value) {
        return callback(new Error("请输入角色名称"));
      } else if (!reg.test(value)) {
        return callback(new Error("只支持中文、英文、数字"));
      } else if (value.length < 2 || value.length > 20) {
        return callback(new Error("长度在 2 到 20 个字符"));
      } else {
        callback();
      }
    };
    var checkremark = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入英文标识"));
      } else {
        const reg = /^[0-9a-zA-Z]+$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("只能输入英文、数字"));
        }
      }
    };
    return {
      searchForm: {
        name: "",
      },
      tableData: [],
      dialogVisible: false,
      ruleForm: {
        id: "",
        roleName: "",
        remark: "",
        roleStatus: 1,
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称！", trigger: "blur" },
        ],
        remark: [
          { required: true, message: "请输入角色备注！", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getTableList();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.ruleForm.id) {
            res = await this.$http.roleUpdate({ ...this.ruleForm });
          } else {
            res = await this.$http.roleAdd({ ...this.ruleForm });
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
    deleteType(row) {
      this.$confirm(`确定要删除 ${row.roleName} 角色吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$http.roleDelete({ rid: row.id });
          if (res) {
            this.$message.success("操作成功！");
            this.getTableList();
          }
        })
        .catch(() => {});
    },
    editType(row) {
      this.ruleForm = { ...row };
      // this.ruleForm.id=row.id;
      // this.ruleForm.name=row.name;
      // this.ruleForm.remark=row.remark;
      this.dialogVisible = true;
    },

    addFunc() {
      this.ruleForm.id = "";
      this.ruleForm.roleName = "";
      this.ruleForm.remark = "";
      this.ruleForm.roleStatus = 1;
      this.dialogVisible = true;
    },
    async getTableList() {
      let res = await this.$http.roleList();
      if (res) {
        this.tableData = res;
      }
    },
  },
};
</script>

<style scoped>
.el-table {
  width: calc(100% - 10px);
}
</style>
