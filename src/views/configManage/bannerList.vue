<template>
  <div class="content">
    <div class="searchBox">
      <div class="searchLeft"></div>
      <div class="searchRight">
        <el-button
          size="medium"
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
          >添加Banner</el-button
        >
      </div>
    </div>
    <el-table border :data="protocolList" style="width: 100%">
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="startTime" label="开始时间"> </el-table-column>
      <el-table-column prop="endTime" label="结束时间"> </el-table-column>
      <el-table-column prop="language" label="语言">
        <template slot-scope="scope">
          {{ scope.row.language == "zh_CN" ? "中文" : "英文" }}
        </template>
      </el-table-column>
      <el-table-column prop="project" label="所属项目">
        <template slot-scope="scope">
          {{ scope.row.project == "x_pool_pow" ? "POW" : "云算力" }}
        </template>
      </el-table-column>
      <el-table-column prop="isShow" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.isShow == "1" ? "不显示" : "显示" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" />

      <el-table-column prop="imageUrl" label="图片">
        <template slot-scope="scope">
          <el-image
            style="height: 60px"
            :src="scope.row.imageUrl"
            fit="contain "
          ></el-image>
        </template>
      </el-table-column>

      <el-table-column prop="scope" label="操作" width="220" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEditor(scope.row)"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" @click="handleDel(scope.row)">{{
            scope.row.status == "1" ? "上架" : "下架"
          }}</el-button>
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
  </div>
</template>
<script>
import pagination from "@/mixins/pagination";
export default {
  mixins: [pagination],
  data() {
    return {
      protocolList: [],
      page: 1,
      size: 10,
    };
  },
  created() {
    this.fetchGetBanner();
  },
  methods: {
    // 获取banner list
    async fetchGetBanner() {
      this.protocolList = [];
      let res = await this.$http.bannerList({
        page: this.page,
        size: this.size,
      });
      if (res) {
        this.protocolList = res.list;
        this.pagination.total = res.total;
      }
    },
    handleAdd() {
      this.$router.push({ name: "addBanner" });
    },
    handleEditor(row) {
      this.$router.push({ name: "addBanner", query: { id: row.id } });
    },
    handleDel(row) {
      this.$confirm("确定要执行此操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(async () => {
          const res = await this.$http.bannerOnOff({
            bannerId: row.id,
            status: row.status == 0 ? 1 : 0,
          });
          if (res) {
            this.fetchGetBanner();
            this.$message.success("操作成功");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    handleSizeChange(size) {
      console.log(size);
      this.size = size;
      this.fetchGetBanner();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchGetBanner();
    },
  },
};
</script>
<style lang="scss" scoped>
.addBox {
  padding: 10px 0;
  display: flex;
  justify-content: flex-end;
}
</style>
