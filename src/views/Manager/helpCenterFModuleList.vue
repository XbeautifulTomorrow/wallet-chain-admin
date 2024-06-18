<template>
  <div class="content">
    <div class="searchBox">
      <div class="searchLeft">
        <el-button size="medium" type="primary" @click="handleAdd">
          新增
        </el-button>
      </div>
      <div class="searchRight"></div>
    </div>
    <el-table border :data="menuList" style="width: 100%">
      <el-table-column prop="orderBy" label="排序" />
      <el-table-column prop="selectIcon" label="选中图标">
        <template slot-scope="scope">
          <div style=" width: 30px; height: 30px;">
            <img width="30px" :src="scope.row.selectIcon" alt="" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="非选中图标">
        <template slot-scope="scope">
          <div style=" width: 30px; height: 30px;">
            <img width="30px" :src="scope.row.icon" alt="" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="nameCn" label="一级模块(中文)" />
      <el-table-column prop="nameEn" label="一级模块(英文)" />
      <el-table-column prop="scope" label="操作" width="220" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleModify(scope.row)">
            编辑
          </el-button>
          <el-button size="mini" type="primary" @click="handleDel(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageBox">
      <el-pagination style="margin-top: 12px" layout="total, sizes, prev, pager, next, jumper" background
        :total="pagination.total" :current-page="page" :page-sizes="pagination.pageSizes" :page-size="size"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog :title="!ruleForm.id ? '新增' : '编辑'" :visible.sync="showDialog" width="540px"
      :close-on-click-modal="false" :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
        <el-form-item label="排序" prop="orderBy">
          <el-input placeholder="数字越小排在越前面" v-model="ruleForm.orderBy" type="number" min="0"
            style="width: 340px"></el-input>
        </el-form-item>
        <el-form-item label="选中图标" prop="selectIcon">
          <el-upload v-model="ruleForm.selectIcon" class="avatar-uploader" :action="updateAddr" :show-file-list="false"
            :on-success="handleSuccess" :on-error="handleError" :before-upload="beforeUpload"
            accept="image/png,image/jpg,image/jpeg,image/svg+xml">
            <el-image v-if="ruleForm.selectIcon" :src="ruleForm.selectIcon" class="avatar" @click="uploadType = 1">
            </el-image>
            <i v-else @click="uploadType = 1" class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="非选中图标" prop="icon">
          <el-upload v-model="ruleForm.icon" class="avatar-uploader" :action="updateAddr" :show-file-list="false"
            :on-success="handleSuccess" :on-error="handleError" :before-upload="beforeUpload"
            accept="image/png,image/jpg,image/jpeg,image/svg+xml">
            <el-image v-if="ruleForm.icon" :src="ruleForm.icon" class="avatar" @click="uploadType = 2">
            </el-image>
            <i v-else @click="uploadType = 2" class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="模块名称（中文）" prop="nameCn">
          <el-input placeholder="请输入模块名称（中文）" v-model="ruleForm.nameCn" maxlength="50" style="width: 340px"></el-input>
        </el-form-item>
        <el-form-item label="模块名称（英文）" prop="nameEn">
          <el-input placeholder="请输入模块名称（英文）" v-model="ruleForm.nameEn" maxlength="50" style="width: 340px"></el-input>
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
import config from "@/config/env";
import { imgUrlToBase64, readImgToBase64 } from "@/utils";

export default {
  name: "NoticeList",
  mixins: [pagination],
  data() {
    return {
      ruleForm: {
        "orderBy": null, //排序号
        "selectIcon": null, //选中图标
        "icon": null, //未选中图标
        "nameCn": null, //一级模块中文名称
        "nameEn": null //一级模块英文名称
      },
      menuList: [],
      uploadType: 1,
      rules: [],
      showDialog: false,
      updateAddr: "",
      page: 1,
      size: 10,
      loading: false
    };
  },
  methods: {
    timeFormate(date, str) {
      return timeForStr(date, str);
    },
    handleSuccess(res, file) {
      console.log(this.uploadType)
      if (this.uploadType == 1) {
        this.ruleForm.selectIcon = res.data;
      } else {
        this.ruleForm.icon = res.data;
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
              this.ruleForm.selectIcon = event;
            } else {
              this.ruleForm.icon = event;
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
    // 获取 list
    async fetchFModuleList() {
      this.menuList = [];
      let res = await this.$http.getHelpCenterFModuleList({
        page: this.page,
        size: this.size,
      });
      if (res) {
        this.menuList = res.list;
        this.pagination.total = res.total;
        this.$forceUpdate();
      }
    },
    handleAdd() {
      this.showDialog = true;
    },
    handleModify(event) {
      this.ruleForm = deepClone(event);
      this.showDialog = true;
    },
    handleDel(row) {
      this.$confirm(`确定要删除菜单『${row.nameCn}』吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$http.getHelpCenterFModulDel({ fModuleId: row.id });
          if (res) {
            this.fetchFModuleList();
            this.$message({
              type: "success",
              message: "操作成功!",
            });
          }
        })
    },
    submitForm(ruleForm) {
      let that = this;
      this.$refs[ruleForm].validate(async (valid) => {
        if (!valid) return;
        const { ruleForm } = that;

        // 数据组装
        const res = await that.$http.getHelpCenterFModulSave({ ...ruleForm });
        if (res) {
          that.fetchFModuleList();
          this.handleClose();
          that.$message({
            type: "success",
            message: "操作成功!",
          });
        }
      });
    },
    handleClose() {
      this.ruleForm = {
        orderBy: null, //排序号
        selectIcon: null, //选中图标
        icon: null, //未选中图标
        nameCn: null, //一级模块中文名称
        nameEn: null //一级模块英文名称
      };
      this.$refs["ruleForm"].clearValidate();
      this.showDialog = false;
    },
    handleSizeChange(size) {
      this.size = size;
      this.fetchFModuleList();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchFModuleList();
    },
  },
  created() {
    this.fetchFModuleList();
    this.updateAddr = config.api + "/upload/image";

    this.rules = {
      orderBy: [
        {
          required: true,
          message: "请输入排序数字",
          trigger: ["blur", "change"],
        },
      ],
      icon: [
        {
          required: true,
          message: "请选择非选中图标",
          trigger: ["blur", "change"],
        },
      ],
      selectIcon: [
        {
          required: true,
          message: "请选择选中图标",
          trigger: ["blur", "change"],
        },
      ],
      nameCn: [
        {
          required: true,
          message: "请输入模块名称（中文）",
          trigger: ["blur", "change"],
        },
      ],
      nameEn: [
        {
          required: true,
          message: "请输入模块名称（英文）",
          trigger: ["blur", "change"],
        },
      ],
    };
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
