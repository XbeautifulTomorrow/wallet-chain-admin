<template>
  <div>
    <div class="searchBox">
      <div class="searchLeft">
        <!-- <el-input size="medium" v-model="searchForm.tel" placeholder="请输入用户电话"  @keyup.enter.native="getTableList"></el-input>
      <el-select size="medium" clearable v-model="searchForm.roleId" @change="getTableList" placeholder="请选择角色">
        <el-option
          v-for="item in roleList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select size="medium" clearable v-model="searchForm.flag" @change="getTableList" placeholder="请选择账户状态">
        <el-option label="运行" :value="1"></el-option>
        <el-option label="冻结" :value="2"></el-option>
      </el-select>
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
      height="73vh"
      :header-cell-style="{
        'background-color': '#F6F6F6',
        'font-weight': '600',
        color: '#333',
        height: '20px',
      }"
      style="width: 100%"
    >
      <el-table-column prop="userName" label="用户名"> </el-table-column>
      <el-table-column prop="realName" label="姓名"> </el-table-column>
      <el-table-column prop="phone" label="手机号"> </el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <!-- <el-table-column
      prop="age"
      label="年龄">
    </el-table-column> -->
      <el-table-column prop="roleName" label="角色"> </el-table-column>
      <!-- <el-table-column
      label="运行/禁用">
      <template slot-scope="scope">
        <span>{{scope.row.status=='y'?'运行':'禁用'}}</span>
      </template>
    </el-table-column> -->
      <el-table-column prop="way" width="200px" label="操作">
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="primary" @click="editType(scope.row,1)">授权</el-button> -->
          <el-button size="mini" type="warning" @click="editType(scope.row, 2)"
            >修改信息</el-button
          >
          <!-- <el-button size="mini" type="info" @click="editType(scope.row,3)">修改密码</el-button> -->
          <el-button size="mini" type="danger" @click="deleteType(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pageBox" v-if="totalNum > 0">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.current"
        :page-sizes="[10, 50, 100]"
        :page-size="searchForm.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      >
      </el-pagination>
    </div>
    <el-dialog
      :title="!ruleForm.id ? '添加账户' : '修改账户'"
      :visible.sync="dialogVisible"
      width="430px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="userName" :rules="rules.blurRule">
          <el-input
            placeholder="请输入用户名"
            v-model="ruleForm.userName"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="用户密码"
          prop="passWord"
          :rules="!ruleForm.id ? rules.passWord : rules.passWord2"
        >
          <el-input
            type="passWord"
            placeholder="请输入用户密码"
            v-model="ruleForm.passWord"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" prop="realName" :rules="rules.blurRule">
          <el-input
            placeholder="请输入用户真实姓名"
            v-model="ruleForm.realName"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone" :rules="rules.phoneRule">
          <el-input
            placeholder="请输入手机号"
            v-model.number="ruleForm.phone"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="email"
          label="邮箱"
          :rules="[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change'],
            },
          ]"
        >
          <el-input
            v-model="ruleForm.email"
            placeholder="请输入邮箱地址"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId" :rules="rules.selectRule">
          <el-select
            v-model="ruleForm.roleId"
            placeholder="请选择角色"
            style="width: 240px"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName + '(' + item.remark + ')'"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="账户状态" prop="status">
            <el-radio-group v-model="ruleForm.status">
                <el-radio label="y">运行</el-radio>
                <el-radio label="n">冻结</el-radio>
            </el-radio-group>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="修改密码"
      :visible.sync="passDialogVisible"
      width="440px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="passForm"
        :rules="rules"
        ref="passForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="旧密码" prop="opass">
          <el-input
            type="passWord"
            placeholder="请输入旧密码"
            v-model="passForm.opass"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="npass">
          <el-input
            type="passWord"
            placeholder="请输入新密码"
            v-model="passForm.npass"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="cpass">
          <el-input
            type="passWord"
            placeholder="请输入确认密码"
            v-model="passForm.cpass"
            style="width: 240px"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="resetpassWord('passForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("年龄不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 18) {
            callback(new Error("必须年满18岁"));
          } else {
            callback();
          }
        }
      });
    };
    var phoneRule = (rule, value, callback) => {
      const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
      if (value === "") {
        return callback(new Error("输入不能为空"));
      } else {
        if (!reg.test(value)) {
          callback(new Error("请输入正确的手机号"));
        } else {
          callback();
        }
      }
    };
    var passCheck = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("输入不能为空"));
      } else if (value.length < 8 || value.length > 20) {
        return callback(new Error("密码长度必须是8到20位"));
      } else if (this.passForm.npass != this.passForm.cpass) {
        return callback(new Error("两次输入密码不一致"));
      } else {
        return callback();
      }
    };
    return {
      totalNum: 0,
      searchForm: {
        page: 1,
        size: 10,
      },
      tableData: [],
      dialogVisible: false,
      passDialogVisible: false,
      ruleForm: {
        id: "",
        email: "",
        userName: "",
        passWord: "",
        realName: "",
        phone: "",
        roleId: "",
      },
      passForm: {
        uid: "",
        opass: "",
        npass: "",
        cpass: "",
      },
      rules: {
        passWord: [
          { required: true, message: "请输入密码", trigger: "blur" },
          // { min: 8, max: 20, message: '密码最小为8位-20位', trigger: 'blur' }
        ],
        passWord2: [
          { required: false, message: "请输入密码", trigger: "blur" },
        ],
        blurRule: [{ required: true, message: "请输入", trigger: "blur" }],
        phoneRule: [{ required: true, validator: phoneRule, trigger: "blur" }],
        selectRule: [{ required: true, message: "请选择", trigger: "change" }],
        age: [{ required: true, validator: checkAge, trigger: "blur" }],
        opass: [
          { required: true, message: "输入不能为空", trigger: "blur" },
          // { min: 8, max: 20, message: '密码长度必须是8到20位', trigger: 'blur' }
        ],
        npass: [
          { required: true, message: "输入不能为空", trigger: "blur" },
          {
            min: 8,
            max: 20,
            message: "密码长度必须是8到20位",
            trigger: "blur",
          },
        ],
        cpass: [{ required: true, validator: passCheck, trigger: "blur" }],
      },
      roleList: [],
    };
  },
  created() {
    this.getTableList();
    this.getRoleList();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let ruleForm = { ...this.ruleForm };
          let res = null;
          if (this.ruleForm.id) {
            res = await this.$http.userEdit({ ...ruleForm });
          } else {
            res = await this.$http.userAdd({ ...ruleForm });
          }
          if (res) {
            this.$refs[formName].resetFields();
            this.$message.success("操作成功！");
            this.dialogVisible = false;
            this.getTableList();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetpassWord(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let passForm = { ...this.passForm };
          passForm.cpass = undefined;
          let res = await this.$http.userEditPass({ ...passForm });
          if (res) {
            this.$message.success("操作成功！");
            this.passDialogVisible = false;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    deleteType(row) {
      this.$confirm(`确定要删除 ${row.userName} 账户吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$http.userDelete({ id: row.id });
          if (res) {
            this.$message.success("操作成功！");
            this.getTableList();
          }
        })
        .catch(() => {});
    },
    editType(row, type) {
      // type:1授权2修改信息3修改密码
      if (type == 2) {
        this.ruleForm = { ...row };
        this.dialogVisible = true;
      } else {
        this.passForm.uid = row.id;
        this.passDialogVisible = true;
        setTimeout(() => {
          this.$refs["passForm"].resetFields();
        });
      }
    },

    addFunc() {
      this.dialogVisible = true;
      this.ruleForm.id = "";
      this.ruleForm.email = "";
      this.ruleForm.userName = "";
      this.ruleForm.passWord = "";
      this.ruleForm.realName = "";
      this.ruleForm.phone = "";
    },
    async getTableList(val) {
      let res = await this.$http.userList({ ...this.searchForm });
      if (res) {
        this.tableData = res.list;
        this.totalNum = res.total;
      }
    },
    async getRoleList() {
      let res = await this.$http.roleList();
      if (res) {
        this.roleList = res;
      }
    },
    handleSizeChange(val) {
      this.searchForm.page = 1;
      this.searchForm.size = val;
      this.getTableList();
    },
    handleCurrentChange(val) {
      this.searchForm.page = val;
      this.getTableList();
    },
  },
};
</script>

<style scoped>
</style>
