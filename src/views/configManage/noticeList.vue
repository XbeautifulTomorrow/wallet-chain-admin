<template>
  <div class="content">
    <div class="addBox">
      <el-input
        class="inner"
        v-model="noticeTitle"
        placeholder="请输入公告标题"
        clearable
        oninput="if(value.length > 30)value=value.slice(0, 30)"
        @keyup.enter.native="getTableList"
      ></el-input>

      <el-button
        size="medium"
        type="primary"
        style="margin-left: 20px"
        icon="el-icon-search"
        @click="getTableList"
        >搜索</el-button
      >

      <el-button type="primary" @click="handleAdd">添加公告</el-button>
    </div>
    <br />
    <el-table border :data="protocolList" style="width: 100%">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="title" label="标题" />

      <!-- <el-table-column prop="content" label="公告内容(普通文本)">
        <template slot-scope="scope"> 
          <div class="content-text">
            {{ scope.row.content }}
          </div>
        </template> 
      </el-table-column>

       <el-table-column prop="contentHtml" label="公告内容(HTML文本)">
        <template slot-scope="scope"> 
          <div class="content-text">
            {{ scope.row.contentHtml }}
          </div>
        </template> 
      </el-table-column> -->

      <el-table-column prop="forcedSwitch" label="是否强提醒" min-width="100">
        <template slot-scope="scope">
          <div @click="changeSwitch(scope.row)">
            <el-switch
              :value="scope.row.forcedSwitch == 0 ? false : true"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="importantSwitch"
        label="是否是重要公告"
        min-width="100"
      >
        <template slot-scope="scope">
          <div @click="changeSwitch2(scope.row)">
            <el-switch
              :value="scope.row.importantSwitch == 0 ? false : true"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="project" label="版块">
        <template slot-scope="scope">
          <span> {{ stateFormat(scope.row.project) }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column prop="scope" label="操作" width="220" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEditor(scope.row)"
            >编辑</el-button
          >
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
        :current-page="pagination.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
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
      noticeTitle: null,
      protocolList: [],

      ruleForm: {
        language: "",
        title: "",
        content: "",
        contentHtml: "",
        forcedSwitch: "",
        importantSwitch: "",
      },
      forcedSwitch: "",
      importantSwitch: "",

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
    this.fetchGetBanner();
  },
  methods: {
    stateFormat(event) {
      if (event == "cloud_fil") {
        return "云算力";
      } else {
        return "POW";
      }
    },

    //是否强提醒
    changeSwitch(row) {
      let annId = row.id;
      let isForced = row.forcedSwitch;
      this.$http
        .isForcedSwitch({
          annId: annId,
          isForced: isForced == 0 ? 1 : 0,
        })
        .then((res) => {
          this.getTableList();

          //  this.$message.success('操作成功！')
        });
    },
    //是否重要公告
    changeSwitch2(row) {
      let annId = row.id;
      let isImportant = row.importantSwitch;
      this.$http
        .isImportantSwitch({
          annId: annId,
          isImportant: isImportant == 1 ? 0 : 1,
        })
        .then((res) => {
          this.getTableList();

          //  this.$message.success('操作成功！')
        });
    },
    timeFormate(date, str) {
      return timeForStr(date, str);
    },

    // 获取 list
    async fetchGetBanner() {
      this.protocolList = [];
      let res = await this.$http.getUserLists({
        title: this.noticeTitle,
        page: this.pagination.page,
        size: this.pagination.size,
      });
      if (res) {
        this.protocolList = res.list;
        this.pagination.total = res.total;
      }
    },

    //搜索
    async getTableList(val) {
      if (val) {
        this.pagination.page = 1;
      }

      this.fetchGetBanner();
    },
    handleAdd() {
      this.$router.push({ name: "addNotice" });
    },

    handleEditor(row) {
      this.ruleForm = { ...row };
      this.$router.push({ name: "addNotice", query: { id: row.id } });
    },

    handleDel(row) {
      this.$confirm("确定要执行此操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(async () => {
          const res = await this.$http.annOnOff({
            annId: row.id,
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
      this.pagination.size = size;
      this.fetchGetBanner();
    },
    handleCurrentChange(page) {
      this.pagination.page = page;
      this.fetchGetBanner();
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
