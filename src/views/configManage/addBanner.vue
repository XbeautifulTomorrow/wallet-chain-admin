<template>
  <div class="content mall-add">
    <el-row>
      <el-col :span="12">
        <el-form ref="ruleForm" class="add-form" :rules="rules" :model="ruleForm" label-width="130px">
          <el-form-item label="标题名称" prop="name">
            <el-input v-model="ruleForm.name" style="width: 300px" placeholder="请输入名称"
              oninput="if(value.length > 50)value=value.slice(0, 50)" />
          </el-form-item>
          <el-form-item label="语言类型" prop="language" :rules="rules.select">
            <el-select v-model="ruleForm.language" style="width: 300px">
              <el-option v-for="item in langList" :key="item.type" :label="item.text" :value="item.type" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属项目" prop="project" :rules="rules.select">
            <el-select v-model="ruleForm.project" style="width: 300px">
              <el-option v-for="item in addressList" :key="item.type" :label="item.text" :value="item.type" />
            </el-select>
          </el-form-item>
          <el-form-item label="选择时间">
            <div style="display: flex">
              <el-form-item prop="startTime" :rules="rules.select">
                <el-date-picker v-model="ruleForm.startTime" placeholder="选择开始日期" value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime" />
              </el-form-item>
              <div style="padding: 0 10px">—</div>
              <el-form-item prop="endTime" :rules="rules.select">
                <el-date-picker v-model="ruleForm.endTime" placeholder="选择结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime" />
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item label="Banner图片" required>
            <el-upload :action="uploadUrl" :on-success="handleUpload" :file-list="fileImg" :multiple="false" :limit="1"
              accept="image/png,image/jpg,image/jpeg" list-type="picture-card" :before-upload="handleBefore"
              :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-exceed="handExceed"
              :headers="uploadHeader" :data="{ imageType: 'coinImage' }">
              <i class="el-icon-plus" />
            </el-upload>
          </el-form-item>
          <el-form-item label="跳转地址">
            <el-input v-model="ruleForm.jumpUrl" style="width: 300px" placeholder="请输入跳转地址" />
          </el-form-item>
          <el-form-item label="是否显示" prop="isShow" :rules="rules.select">
            <el-select v-model="ruleForm.isShow" style="width: 300px">
              <el-option v-for="items in showList" :key="items.type" :label="items.text" :value="items.type" />
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="sort" :rules="rules.blur">
            <el-input v-model="ruleForm.sort" style="width: 300px" oninput="if(value.length > 3)value=value.slice(0, 3)"
              placeholder="请输入排序，数字大的靠前且小于三位数" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row style="margin-top: 100px">
      <el-col :offset="7" :span="4">
        <el-button :loading="loading" type="primary" style="width: 100%; margin-bottom: 30px"
          @click.native.prevent="submitCofirm()">保存</el-button>
      </el-col>
    </el-row>
    <el-dialog title="矿机图片查看" :visible.sync="dialogVisible" width="60%">
      <div>
        <img width="100%" :src="dialogImageUrl" alt />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import config from "@/config/env";
export default {
  name: "AddBanner",
  data() {
    var checkIntNumMaxThree = (rule, value, callback) => {
      const reg = /^\d{0,3}$/;
      if (!value) {
        return callback(new Error("请输入"));
      } else if (reg.test(value)) {
        callback();
      } else {
        callback("请输入不超过3位数的整数");
      }
    };
    return {
      ruleForm: {
        id: "",
        language: "",
        name: "",
        position: "",
        imageUrl: "",
        jumpUrl: "",
        startTime: "",
        endTime: "",
        sort: "",
        isShow: "",
      },
      fileImg: [], // 图片
      langList: [
        {
          text: "中文",
          type: "zh_CN",
        },
        {
          text: "英文",
          type: "en_US",
        },
      ],
      addressList: [
        {
          text: "POW",
          type: "x_pool_pow",
        },
        {
          text: "云算力",
          type: "cloud_fil",
        },
      ],
      showList: [
        { type: 0, text: "显示" },
        { type: 1, text: "不显示" },
      ],
      dialogImageUrl: "",
      dialogVisible: false,
      uploadHeader: {
        certificate: sessionStorage.getItem("token"),
      },
      loading: false,
      uploadUrl: "",
      rules: {
        name: [{ required: true, message: "请输入标题名称", trigger: "blur" }],
        select: [{ required: true, message: "请选择", trigger: "change" }],
        blur: [
          { required: true, validator: checkIntNumMaxThree, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.uploadUrl = config.api + "/upload/image";
    // 获取协议id
    const { id } = this.$route.query;
    if (id) {
      this.getBannerInfo(id);
      this.id = id;
    }
  },
  methods: {
    async getBannerInfo(id) {
      let res = await this.$http.bannerQueryOne({ bannerId: id });
      if (res) {
        this.ruleForm = res;
        this.fileImg.push({ url: this.ruleForm.imageUrl });
      }
    },
    // 平台相册
    handleUpload(res) {
      if (res.status == 200) {
        this.fileImg.push({ url: res.data });
        return;
      }
      this.$message.error("上传失败");
    },
    // 预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleBefore(file) {
      const _this = this;
      const is1M = file.size / 1024 / 1024 < 2; // 限制小于2M
      if (!is1M) {
        _this.$message.error("图片过大，文件大小小于2M");
      }
      return is1M;
    },
    handleRemove(file, fileList) {
      this.fileImg = [];
    },
    handExceed(fiel) {
      this.$message.error("Banner图片只能上传一张");
    },
    submitCofirm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          if (this.fileImg.length == 0) {
            this.$message.error("请上传图片！");
            return;
          }
          let ruleForm = { ...this.ruleForm };
          ruleForm.imageUrl = this.fileImg[0].url;
          let res = null;
          if (this.ruleForm.id) {
            res = await this.$http.updateBanner({ ...ruleForm });
            this.$router.go(-1);
          } else {
            res = await this.$http.saveBanner({ ...ruleForm });
            this.$router.go(-1);
          }
          if (res) {
            this.$refs["ruleForm"].resetFields();
            this.$message.success("操作成功！");
            this.fileImg = [];
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    foramtImgs(imgs) {
      let fileList = [];
      if (Array.isArray(imgs) && imgs.length > 0) {
        fileList = imgs.map((d, i) => ({ name: i, url: d || "" }));
      }
      return fileList;
    },
    async onSubmit(para) {
      if (this.id === "0") {
        // 添加
        await banner.add(para).then((res) => {
          this.$router.push("/mill-mall/bannerConfig");
          this.$message({
            type: "success",
            message: "操作成功",
          });
        });
      } else {
        // 修改
        para.id = this.id;
        await banner.update(para).then((res) => {
          this.$router.push("/mill-mall/bannerConfig");
          this.$message({
            type: "success",
            message: "操作成功",
          });
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.mall-add {

  .el-form-item .el-upload--picture-card,
  .el-upload-list__item {
    width: 80px;
    height: 80px;
    line-height: 88px;
  }
}

.file-imgs {
  /deep/.el-tabs__header {
    display: none;
  }
}

.price-box {
  margin: 0;
}

.editor {
  height: 583px;

  >>>.ql-container {
    height: calc(100% - 83px);
  }
}

.editor-container {
  padding-left: 20px;
}
</style>
