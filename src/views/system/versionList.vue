<template>
  <div class="content">
    <div class="addBox">
      <el-button type="primary" @click="handleAdd()">添加版本更新</el-button>
    </div>
    <br />
    <el-table border :data="versionList" style="width: 100%">
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="appVersion" label="版本号" />
      <el-table-column prop="statusStr" label="版本状态" />
      <el-table-column prop="contentZh" label="更新描述(CN)" />
      <el-table-column prop="contentUs" label="更新描述(US)" />
      <el-table-column prop="downloadLinkAndroid" label="Android下载地址" />
      <el-table-column prop="downloadLinkIos" label="iOS下载地址" />
      <el-table-column prop="downloadLinkHot" label="增量更新地址" />
      <el-table-column prop="forceUpdate" label="是否强制更新" min-width="100">
        <template slot-scope="scope">
          <div @click="changeSwitch(scope.row)">
            <el-switch
              v-model="scope.row.forceUpdate"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="0"
              :inactive-value="1"
            >
            </el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column prop="scope" label="操作" width="220" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEditor(scope.row)"
          >
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDel(scope.row)">
            删除
          </el-button>
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
      v-if="showAddDialog"
      :title="!ruleForm.id ? '添加版本更新' : '编辑版本更新'"
      :visible.sync="showAddDialog"
      width="600px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="140px"
        class="demo-ruleForm"
        v-loading="loading"
      >
        <el-form-item label="名称" prop="name" required>
          <el-input
            placeholder="请输入名称"
            v-model="ruleForm.name"
            oninput="if(value.length > 20)value=value.slice(0, 20)"
            style="width: 340px"
            required
          ></el-input>
        </el-form-item>
        <el-form-item label="版本号" prop="appVersion" required>
          <el-input
            placeholder="请输入版本号"
            v-model="ruleForm.appVersion"
            style="width: 340px"
            required
          ></el-input>
        </el-form-item>

        <el-form-item label="版本状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="0">有效</el-radio>
            <el-radio :label="1">无效</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否强制更新" prop="forceUpdate">
          <el-radio-group v-model="ruleForm.forceUpdate">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="iOS下载地址" prop="downloadLinkIos" required>
          <el-input
            placeholder="请输入iOS下载地址"
            v-model="ruleForm.downloadLinkIos"
            style="width: 340px"
            required
          ></el-input>
        </el-form-item>
        <el-form-item
          label="Android下载地址"
          prop="downloadLinkAndroid"
          required
        >
          <el-input
            placeholder="请上传Android应用包"
            readonly
            v-model="ruleForm.downloadLinkAndroid"
            style="width: 340px"
            required
          >
            <el-upload
              class="upload-android"
              name="file"
              :data="{
                name: `deepool-${ruleForm.appVersion || 'v1.0.0'}`,
              }"
              slot="append"
              :show-file-list="false"
              :action="uploadUrl"
              :multiple="false"
              :on-success="handleSuccess"
              :before-upload="handleBefore"
              :on-error="handleError"
              :file-list="fileList"
            >
              <div @click="uploadType = 1">点击上传</div>
            </el-upload>
          </el-input>
        </el-form-item>
        <el-form-item label="增量更新下载地址" prop="downloadLinkHot" required>
          <el-input
            placeholder="请上传增量更新wgt包"
            readonly
            v-model="ruleForm.downloadLinkHot"
            style="width: 340px"
            required
          >
            <el-upload
              class="upload-wgt"
              name="file"
              slot="append"
              :show-file-list="false"
              :action="uploadUrl"
              :multiple="false"
              :on-success="handleSuccess"
              :on-error="handleError"
              :file-list="fileList"
            >
              <div @click="uploadType = 2">点击上传</div>
            </el-upload>
          </el-input>
        </el-form-item>

        <el-form-item label="中文更新描述" prop="contentZh" required>
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6 }"
            v-model="ruleForm.contentZh"
            style="width: 340px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="英文更新描述" prop="contentUs" required>
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6 }"
            v-model="ruleForm.contentUs"
            style="width: 340px"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="handleSave('ruleForm')">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import pagination from "@/mixins/pagination";
import config from "@/config/env";

export default {
  name: "VersionList",
  mixins: [pagination],
  data() {
    return {
      appVersion: null,
      versionList: [],
      page: 1,
      size: 10,
      showAddDialog: false,
      fileList: [],
      uploadType: 1,
      ruleForm: {
        name: null, //名称
        appVersion: null, //版本号
        status: 0, //版本状态（0：有效，1：无效）
        forceUpdate: 1, //强制更新（0：强制，1：非强制）
        downloadLinkIos: null, //ios客户端下载链接
        downloadLinkAndroid: null, //安卓apk下载链接
        downloadLinkHot: null, //安卓增量更新地址
        contentZh: null, //中文更新版本内容
        contentUs: null, //英文更新版本内容
      },
      uploadUrl: "/upload/package",
      loading: false,
      rules: {
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: ["blur", "change"],
          },
        ], //名称
        appVersion: [
          {
            required: true,
            message: "请输入版本号",
            trigger: ["blur", "change"],
          },
        ], //版本号
        downloadLinkIos: [
          {
            required: true,
            message: "请输入iOS下载地址",
            trigger: ["blur", "change"],
          },
        ], //ios客户端下载链接
        downloadLinkAndroid: [
          {
            required: true,
            message: "请上传Android应用包",
            trigger: ["blur", "change"],
          },
        ], //安卓apk下载链接
        downloadLinkHot: [
          {
            required: true,
            message: "请上传增量更新wgt包",
            trigger: ["blur", "change"],
          },
        ], //安卓增量更新地址
        contentZh: [
          {
            required: true,
            message: "请输入中文更新内容",
            trigger: ["blur", "change"],
          },
        ], //中文更新版本内容
        contentUs: [
          {
            required: true,
            message: "请输入英文更新内容",
            trigger: ["blur", "change"],
          },
        ], //英文更新版本内容
      },
    };
  },
  created() {
    this.uploadUrl = config.api + "/upload/package";
    this.fetchVersionList();
  },
  methods: {
    async changeSwitch(row) {
      const res = await this.$http.forcedSwitch({
        versionId: row.id,
        isForced: row.forceUpdate,
      });
      if (res) {
        this.fetchVersionList();
        this.$message.success("操作成功");
      }
    },
    // 获取 list
    async fetchVersionList() {
      let res = await this.$http.getVersionList({
        page: this.page,
        size: this.size,
      });
      if (res) {
        this.versionList = res.list;
        this.pagination.total = res.total;
      }
    },
    /**
     * @description: 开始查询
     */
    handleSearch() {
      this.page = 1;
      this.fetchVersionList();
    },
    handleAdd() {
      this.showAddDialog = true;
    },
    handleEditor(row) {
      this.ruleForm = { ...row };
      this.showAddDialog = true;
    },
    handleSave(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let res = await this.$http.saveVersion({ ...this.ruleForm });
          if (res) {
            this.$message.success("操作成功！");
            this.showAddDialog = false;
            this.fetchVersionList();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleDel(row) {
      this.$confirm("确定要执行此操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(async () => {
          const res = await this.$http.deleteVersion({
            versionId: row.id,
          });
          if (res) {
            this.fetchVersionList();
            this.$message.success("操作成功");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    /**
     * @description: 值改变事件
     */
    handleChange(file, fileList) {
      console.log(fileList);
    },
    handleBefore(file) {
      this.loading = true;
      if (!this.ruleForm.appVersion) {
        this.$message.error("请输入版本号");
        this.loading = false;
        return false;
      }

      return true;
    },
    /**
     * @description:上传成功事件
     */
    handleSuccess(esponse, file, fileList) {
      this.loading = false;
      if (esponse.status == 200) {
        if (this.uploadType == 1) {
          this.ruleForm.downloadLinkAndroid = esponse.data;
        } else {
          this.ruleForm.downloadLinkHot = esponse.data;
        }

        this.$message.success("上传成功");
      } else {
        console.log(esponse);
        this.$message.success("上传失败");
      }
    },
    /**
     * @description:上传失败事件
     */
    handleError(err, file, fileList) {
      this.loading = false;
      console.log(err);
    },
    handleClose(done) {
      this.ruleForm = {
        name: null, //名称
        appVersion: null, //版本号
        status: 0, //版本状态（0：有效，1：无效）
        forceUpdate: 1, //强制更新（0：强制，1：非强制）
        downloadLinkIos: null, //ios客户端下载链接
        downloadLinkAndroid: null, //安卓apk下载链接
        downloadLinkHot: null, //安卓增量更新地址
        contentZh: null, //中文更新版本内容
        contentUs: null, //英文更新版本内容
      };
      if (!done) return;
      done();
    },
    handleSizeChange(size) {
      this.size = size;
      this.fetchVersionList();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchVersionList();
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