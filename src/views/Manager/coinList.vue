<template>
  <div class="content">
    <div class="addBox">
      <el-button type="primary" @click="handleAdd">增加</el-button>
    </div>
    <br />
    <el-table border :data="coinList" style="width: 100%">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="coinName" label="币种" />
      <el-table-column prop="fullName" label="币种全称" />
      <el-table-column prop="coinUrl" label="币种图标">
        <template slot-scope="scope">
          <div style="background-color: #000; width: 30px; height: 30px;">
            <img width="30px" :src="scope.row.coinUrl" alt="" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="homeCoinUrl" label="币种首页图标">
        <template slot-scope="scope">
          <div style="background-color: #000; width: 30px; height: 30px;">
            <img width="30px" :src="scope.row.homeCoinUrl" alt="" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="chainType" label="拥有网络" />
      <el-table-column prop="scope" label="操作" width="220" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEditor(scope.row)">编辑</el-button>
          <!-- <el-button size="mini" type="danger" @click="deleteType(scope.row)"
            >删除</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>
    <div class="pageBox">
      <el-pagination style="margin-top: 12px" layout="total, sizes, prev, pager, next, jumper" background
        :total="pagination.total" :current-page="pagination.page" :page-sizes="pagination.pageSizes"
        :page-size="pagination.size" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog :title="!ruleForm.id ? '新增' : '编辑'" :visible.sync="showDialog" width="440px"
      :close-on-click-modal="false" :before-close="dialogClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
        v-loading="loading">
        <el-form-item label="币种名称" prop="coinName">
          <el-input placeholder="请输入币种名称" v-model="ruleForm.coinName" style="width: 216px"></el-input>
        </el-form-item>

        <el-form-item label="币种全称" prop="fullName">
          <el-input placeholder="请输入币种全称" v-model="ruleForm.fullName" style="width: 216px"></el-input>
        </el-form-item>

        <el-form-item label="币种图标" prop="coinUrl">
          <el-upload v-model="ruleForm.coinUrl" class="avatar-uploader" :action="updateAddr" :show-file-list="false"
            :on-success="handleSuccess" :on-error="handleError" :before-upload="beforeUpload"
            accept="image/png,image/jpg,image/jpeg,image/svg+xml">
            <el-image v-if="ruleForm.coinUrl" :src="ruleForm.coinUrl" class="avatar" @click="uploadType = 1">
            </el-image>
            <i v-else @click="uploadType = 1" class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="币种首页图标" prop="homeCoinUrl">
          <el-upload v-model="ruleForm.homeCoinUrl" class="avatar-uploader" :action="updateAddr" :show-file-list="false"
            :on-success="handleSuccess" :on-error="handleError" :before-upload="beforeUpload"
            accept="image/png,image/jpg,image/jpeg,image/svg+xml">
            <el-image v-if="ruleForm.homeCoinUrl" :src="ruleForm.homeCoinUrl" class="avatar" @click="uploadType = 2">
            </el-image>
            <i v-else @click="uploadType = 2" class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item class="el-for-item" label="拥有网络">
          <el-select v-model="ruleForm.chainType" multiple filterable :collapse-tags="true" placeholder="请选择">
            <el-option v-for="(item, index) in roleListone" :key="index" :label="item.chainType" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose()">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import pagination from "@/mixins/pagination";
import config from "@/config/env";
import { imgUrlToBase64, readImgToBase64 } from "@/utils";

export default {
  name: "NoticeList",
  mixins: [pagination],
  data() {
    return {
      region: "",
      ruleForm: {
        id: null,
        coinName: null,
        coinUrl: null,
        chainType: null,
      },
      chainType: [
        {
          id: "",
          chainType: "",
        },
      ],
      updateAddr: "",
      roleListone: [],
      region: "",
      showDialog: false,
      value: "",
      coinList: [],
      rules: {
        coinName: [
          {
            required: true,
            message: "请输入币种名称",
            trigger: ["blur", "change"],
          },
        ],
        fullName: [
          {
            required: true,
            message: "请输入币种全称",
            trigger: ["blur", "change"],
          },
        ],
        coinUrl: [
          {
            required: true,
            message: "请选择币种图片",
            trigger: ["blur", "change"],
          },
        ],
        homeCoinUrl: [
          {
            required: true,
            message: "请选择币种图片",
            trigger: ["blur", "change"],
          },
        ],
      },
      uploadType: 1,
      loading: false,
    };
  },
  created() {
    this.fetchCoinList();
    this.getRoleListone();
    this.updateAddr = config.api + "/upload/image";
  },
  methods: {
    //所在网络下拉框
    async getRoleListone() {
      let res = await this.$http.coinDown({
        chainType: "",
      });
      if (res) {
        this.roleListone = res;
      }
    },
    handleSuccess(res, file) {
      if (this.uploadType == 1) {
        this.ruleForm.coinUrl = res.data;
      } else {
        this.ruleForm.homeCoinUrl = res.data;
      }
      this.loading = false;
    },
    handleError(err, file, fileList) {
      console.log(err);
      this.loading = false;
    },
    beforeUpload(file) {
      this.loading = true;
      const isLt2M = file.size / 1024 / 1024 < 0.5;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 500KB!");
        this.loading = false;
        return false;
      }

      if (file.type == "image/svg+xml") {
        readImgToBase64(file)
          .then((event) => {
            if (this.uploadType == 1) {
              this.ruleForm.coinUrl = event;
            } else {
              this.ruleForm.homeCoinUrl = event;
            }
            this.loading = false;
          })
          .catch((error) => {
            console.log(error);
            this.loading = false;
            this.$message.error("图片转化失败，请重试！");
          });

        return false;
      }

      return isLt2M;
    },
    timeFormate(date, str) {
      return timeForStr(date, str);
    },
    // 获取 list
    async fetchCoinList() {
      this.coinList = [];
      let res = await this.$http.coinList({
        page: this.pagination.page,
        size: this.pagination.size,
      });
      if (res) {
        this.coinList = res.list;
        this.pagination.total = res.total;
      }
    },

    handleAdd() {
      this.showDialog = true;
    },
    handleEditor(row) {
      this.ruleForm = { ...row, chainType: row.chainTypes };
      this.showDialog = true;
    },
    //删除
    deleteType(row) {
      this.$confirm(`确定要删除吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$http.coinDelete({ coinId: row.id });
          if (res) {
            this.$message.success("操作成功！");
            this.fetchCoinList();
          }
        })
        .catch(() => { });
    },
    dialogClose() {
      this.ruleForm = {
        id: null,
        coinName: null,
        coinUrl: null,
        chainType: null,
      };
      this.showDialog = false;
      setTimeout(() => {
        this.$refs["ruleForm"].clearValidate();
      }, 10);
    },
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate(async (valid) => {
        if (!valid) return;
        let res = null;
        if (this.ruleForm.id) {
          res = await this.$http.coinUpdate({
            id: this.ruleForm.id,
            coinName: this.ruleForm.coinName,
            fullName: this.ruleForm.fullName,
            coinUrl: this.ruleForm.coinUrl,
            homeCoinUrl: this.ruleForm.homeCoinUrl,
            chainTypes: this.ruleForm.chainType,
          });
        } else {
          res = await this.$http.coinSave({
            ...this.ruleForm,
            chainTypes: this.ruleForm.chainType,
          });
        }

        if (res) {
          this.$message.success("操作成功！");
          this.dialogClose();
          this.fetchCoinList();
        }
      });
    },
    handleSizeChange(size) {
      this.pagination.size = size;
      this.fetchCoinList();
    },
    handleCurrentChange(page) {
      this.pagination.page = page;
      this.fetchCoinList();
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

.el-tag {
  margin-left: 2px;
  background-color: rgb(255, 255, 255) !important;
  border-radius: 15px;
}

.el-form-item:nth-child(3) {
  width: 320px !important;
}

//上传图标
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
