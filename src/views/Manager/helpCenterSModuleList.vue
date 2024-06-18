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
    <el-table border :data="menuList" style="width: 100%" :span-method="objectSpanMethod">
      <el-table-column prop="primaryNameCn" align="center" label="一级模块"></el-table-column>
      <el-table-column prop="orderBy" align="center" label="排序" />
      <el-table-column prop="nameCn" align="center" label="二级模块(中文)" />
      <el-table-column prop="nameEn" align="center" label="二级模块(英文)" />
      <el-table-column prop="scope" align="center" label="操作" width="220" fixed="right">
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
        <el-form-item label="所属父类" prop="primaryModuleId">
          <el-select v-model="ruleForm.primaryModuleId" style="width: 340px" placeholder="请选择所属父类" clearable>
            <el-option :label="item.nameCn" :value="item.id" v-for="(item, index) in menuDown" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="orderBy">
          <el-input placeholder="数字越小排在越前面" v-model="ruleForm.orderBy" type="number" min="0"
            style="width: 340px"></el-input>
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
        orderBy: null, //排序号
        nameCn: null, //一级模块中文名称
        nameEn: null //一级模块英文名称
      },
      menuList: [],
      menuDown: [],
      rules: [],
      showDialog: false,
      page: 1,
      size: 10,
      loading: false,

      //合并表格
      columnArr: ["primaryNameCn"],
      spanArr: [], //临时组
      spanData: [], // 组合的合并组
    };
  },
  methods: {
    timeFormate(date, str) {
      return timeForStr(date, str);
    },
    async fetchFModulDown() {
      this.menuList = [];
      let res = await this.$http.getHelpCenterFModulDown();
      if (res) {
        this.menuDown = res;
      }
    },
    // 获取 list
    async fetchSModuleList() {
      this.menuList = [];
      let res = await this.$http.getHelpCenterSModuleList({
        page: this.page,
        size: this.size,
      });
      if (res) {
        this.menuList = res.list;
        this.pagination.total = res.total;
        this.$forceUpdate();
        this.getSpanData(this.menuList)
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
          let res = await this.$http.getHelpCenterSModulDel({ sModuleId: row.secondaryModuleId });
          if (res) {
            this.fetchSModuleList();
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
        const res = await that.$http.getHelpCenterSModulSave({ ...ruleForm });
        if (res) {
          that.fetchSModuleList();
          this.handleClose();
          that.$message({
            type: "success",
            message: "操作成功!",
          });
        }
      });
    },
    // 计算需要合并的单元格
    getSpanData(data) {
      this.spanData = [];
      this.columnArr.forEach((element) => {
        let contactDot = 0;
        this.spanArr = [];
        data.forEach((item, index) => {
          if (index === 0) {
            this.spanArr.push(1);
          } else {
            if (item[element] === data[index - 1][element]) {
              this.spanArr[contactDot] += 1;
              this.spanArr.push(0);
            } else {
              contactDot = index;
              this.spanArr.push(1);
            }
          }
        });
        this.spanData.push(this.spanArr);
      });
    },
    // 合并的单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.columnArr.includes(column.property)) {
        if (this.spanData[columnIndex][rowIndex]) {
          return {
            rowspan: this.spanData[columnIndex][rowIndex],
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    handleClose() {
      this.ruleForm = {
        orderBy: null, //排序号
        nameCn: null, //一级模块中文名称
        nameEn: null //一级模块英文名称
      }; 
      this.$refs["ruleForm"].clearValidate();
      this.showDialog = false;
    },
    handleSizeChange(size) {
      this.size = size;
      this.fetchSModuleList();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchSModuleList();
    },
  },
  created() {
    this.fetchFModulDown();
    this.fetchSModuleList();
    this.rules = {
      primaryModuleId: [
        {
          required: true,
          message: "请选择所属父类",
          trigger: ["blur", "change"],
        },
      ],
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

