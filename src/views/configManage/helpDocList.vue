<template>
  <div class="content">
    <div class="addBox">
      <el-select clearable v-model="searchForm.primaryModuleId" placeholder="请选择" @change="fetchSModulDown()">
        <el-option :label="item.nameCn" :value="item.id" v-for="(item, index) in menuFDown" :key="index"></el-option>
      </el-select>
      <el-select style="margin-left: 20px" :disabled="!searchForm.primaryModuleId" clearable
        v-model="searchForm.secondaryModuleId" placeholder="请选择">
        <el-option :label="item.nameCn" :value="item.secondaryModuleId" v-for="(item, index) in menuSDown"
          :key="index"></el-option>
      </el-select>
      <el-button size="medium" type="primary" style="margin-left: 20px" icon="el-icon-search"
        @click="getTableList">搜索</el-button>

      <el-button type="primary" @click="handleAdd()">添加文档</el-button>
    </div>
    <br />
    <el-table border :data="helpDocList" style="width: 100%">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="primaryNameCn" label="一级模块" />
      <el-table-column prop="secondaryNameCn" label="二级模块" />
      <el-table-column prop="orderBy" label="排序" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column prop="isShow" label="是否展示" min-width="100">
        <template slot-scope="scope">
          <div>
            <el-switch v-model="scope.row.isShow" @change="changeSwitch(scope.row)" :active-value="1"
              :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="scope" label="操作" width="220" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEditor(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDel(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageBox">
      <el-pagination style="margin-top: 12px" layout="total, sizes, prev, pager, next, jumper" background
        :total="pagination.total" :current-page="pagination.page" :page-sizes="pagination.pageSizes"
        :page-size="pagination.size" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>
<script>
import pagination from "@/mixins/pagination";

export default {
  name: "NoticeList",
  mixins: [pagination],
  data() {
    return {
      helpDocList: [],
      menuFDown: [],
      menuSDown: [],
      searchForm: { primaryModuleId: null, secondaryModuleId: null },
      ruleForm: {
        language: "",
        title: "",
        content: "",
        contentHtml: "",
      },
      pagination: {
        page: 1,
        size: 10,
        pageSizes: [10, 20, 40, 60],
        total: 0,
      },
    };
  },
  created() {
    this.getTableList();
    this.fetchFModulDown();
  },
  methods: {
    timeFormate(date, str) {
      return timeForStr(date, str);
    },
    //一级菜单下拉
    async fetchFModulDown() {
      let res = await this.$http.getHelpCenterFModulDown();
      if (res) {
        this.menuFDown = res;
      }
    },
    //二级菜单下拉
    async fetchSModulDown() {
      this.searchForm.secondaryModuleId = null;
      this.menuSDown = [];
      let res = await this.$http.getHelpCenterSModulDown({
        fModuleId: this.searchForm.primaryModuleId
      });
      if (res) {
        this.menuSDown = res;
      }
    },
    // 获取 list
    async fetchHelpDocList() {
      this.helpDocList = [];
      let res = await this.$http.getHelpDocList({
        ...this.searchForm,
        page: this.pagination.page,
        size: this.pagination.size,
      });
      if (res) {
        this.helpDocList = res.list;
        this.pagination.total = res.total;
      }
    },
    //搜索
    async getTableList(val) {
      if (val) {
        this.pagination.page = 1;
      }

      this.fetchHelpDocList();
    },

    //是否展示
    changeSwitch(row) {
      this.$http
        .setHelpDocStatus({
          helpCenterId: row.id,
          isShow: row.isShow
        })
        .then((res) => {
          this.$message.success("操作成功！");
        });
    },

    handleAdd() {
      this.$router.push({ name: "addHelpDoc" });
    },
    handleEditor(row) {
      this.ruleForm = { ...row };
      this.$router.push({ name: "addHelpDoc", query: { id: row.id } });
    },
    handleDel(row) {
      this.$confirm("确定要执行此操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(async () => {
          const res = await this.$http.deleteHelpDoc({
            helpCenterId: row.id
          });
          if (res) {
            this.fetchHelpDocList();
            this.$message.success("操作成功");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    handleSizeChange(size) {
      this.pagination.size = size;
      this.fetchHelpDocList();
    },
    handleCurrentChange(page) {
      this.pagination.page = page;
      this.fetchHelpDocList();
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

.content-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
