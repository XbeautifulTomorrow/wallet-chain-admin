<template>
  <div class="headerBox">
    <div class="headerL">
      <el-breadcrumb separator="/" v-if="subNav && subNav.length > 0" class="breadcrumbBox">
        <template v-for="(item, index) in subNav">
          <el-breadcrumb-item :key="index" v-if="item.path">
            <span @click="toPage(item.path)">
              {{ item.name }}
            </span>
          </el-breadcrumb-item>
          <el-breadcrumb-item :key="index + 'else'" v-else>
            {{ item.name }}
          </el-breadcrumb-item>
        </template>
      </el-breadcrumb>
    </div>
    <div class="headerR">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          基本操作<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">修改密码</el-dropdown-item>
          <el-dropdown-item command="b">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="440px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type="password" placeholder="请输入旧密码" v-model="ruleForm.oldPassword" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" placeholder="请输入新密码" v-model="ruleForm.newPassword" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmpass">
          <el-input type="password" placeholder="请输入确认密码" v-model="ruleForm.confirmpass"
            style="width: 240px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="resetPassWord('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["subNav"],
  data() {
    var passCheck = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("输入不能为空"));
      } else if (value.length < 6 || value.length > 20) {
        return callback(new Error("密码长度必须是6到20位"));
      } else if (this.ruleForm.newPassword != this.ruleForm.confirmpass) {
        return callback(new Error("两次输入密码不一致"));
      } else {
        return callback();
      }
    };
    return {
      dialogVisible: false,
      ruleForm: {
        oldPassword: "",
        newPassword: "",
        confirmpass: "",
      },
      rules: {
        oldPassword: [
          { required: true, message: "输入不能为空", trigger: ["change", "blur"] },
          {
            min: 6,
            max: 20,
            message: "密码长度必须是6到20位",
            trigger: ["change", "blur"]
          },
        ],
        newPassword: [
          { required: true, message: "输入不能为空", trigger: ["change", "blur"] },
          {
            min: 6,
            max: 20,
            message: "密码长度必须是6到20位",
            trigger: ["change", "blur"]
          },
        ],
        confirmpass: [
          { required: true, validator: passCheck, trigger: ["change", "blur"] },
        ],
      },
    };
  },
  created() { },
  methods: {
    userInfoFunc() {
      this.$router.push({ name: "index" });
    },
    exit() {
      sessionStorage.clear();
      localStorage.clear();
      this.$router.push({ name: "login" });
    },
    async resetPassWord(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let res = await this.$http.updatePassword({ ...this.ruleForm });
          if (res) {
            this.dialogVisible = false;
            this.$message.success("操作成功！");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCommand(command) {
      if (command == "a") {
        this.dialogVisible = true;
        this.ruleForm.oldPassword = "";
        this.ruleForm.newPassword = "";
        this.ruleForm.confirmpass = "";
      } else if (command == "b") {
        this.exit();
      }
    },
    toPage(name) {
      //路由的name
      this.$router.push({
        name,
      });
    },
  },
};
</script>

<style lang="scss">
.headerBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .headerL {
    position: relative;
    z-index: 1;
    // width: 200px;
    height: 100%;
    line-height: 56px;
    font-size: 18px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .headerR {
    padding-right: 24px;
    line-height: 32px;
    display: flex;
    align-items: center;

    .el-dropdown-link {
      cursor: pointer;
    }
  }
}
</style>
