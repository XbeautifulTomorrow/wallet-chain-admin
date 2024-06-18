<template>
  <div class="content mall-add">
    <el-tabs type="border-card" v-model="active">
      <el-tab-pane name="zh_CN" label="中文">
        <el-row>
          <el-col :span="23">
            <el-form
              ref="ruleForm"
              class="add-form"
              :rules="rules"
              :model="ruleForm"
              label-width="130px"
            >
              <el-form-item label="板块" prop="project">
                <el-select
                  v-model="ruleForm.project"
                  style="width: 300px"
                  @change="changeSection"
                  placeholder="请选择板块"
                  clearable
                >
                  <el-option
                    :label="item.text"
                    :value="item.val"
                    v-for="(item, index) in projectOps"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="标题名称" prop="title">
                <el-input
                  v-model="ruleForm.title"
                  style="width: 300px"
                  placeholder="请输入名称"
                />
              </el-form-item>
              <el-form-item label="公告内容" prop="contentHtml">
                <quill-editor
                  ref="newEditor"
                  v-model="ruleForm.contentHtml"
                  class="ql-editor"
                  @change="onEditorChange($event)"
                  :options="editorOption"
                />
              </el-form-item>

              <el-form-item label="是否强提醒" prop="forcedSwitch">
                <el-radio-group
                  v-model="ruleForm.forcedSwitch"
                  @change="changeForced"
                >
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否是重要公告" prop="importantSwitch">
                <el-radio-group
                  v-model="ruleForm.importantSwitch"
                  @change="changeImportant"
                >
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane name="en_US" label="英文">
        <el-row>
          <el-col :span="23">
            <el-form
              ref="ruleForm2"
              class="add-form"
              :model="ruleForm2"
              label-width="130px"
            >
              <el-form-item label="板块">
                <el-select
                  v-model="ruleForm2.project"
                  style="width: 300px"
                  placeholder="请选择板块"
                  @change="changeSection"
                  clearable
                >
                  <el-option
                    :label="item.text"
                    :value="item.val"
                    v-for="(item, index) in projectOps"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="标题名称">
                <el-input
                  v-model="ruleForm2.title"
                  style="width: 300px"
                  placeholder="请输入名称"
                />
              </el-form-item>

              <el-form-item label="公告内容">
                <quill-editor
                  ref="newEditor"
                  v-model="ruleForm2.contentHtml"
                  @change="onEditorChange2($event)"
                  class="ql-editor"
                  :options="editorOption"
                />
              </el-form-item>
              <el-form-item label="是否强提醒">
                <el-radio-group
                  v-model="ruleForm2.forcedSwitch"
                  @change="changeForced"
                >
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否是重要公告">
                <el-radio-group
                  v-model="ruleForm2.importantSwitch"
                  @change="changeImportant"
                >
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <el-row style="margin-top: 50px">
      <el-button type="primary" plain @click="resetForm()">取消</el-button>
      <el-button type="primary" @click.native.prevent="submitCofirm()"
        >保存</el-button
      >
    </el-row>
  </div>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { Quill, quillEditor } from "vue-quill-editor";
import quillConfig from "@/utils/quill-config";
// 设置字体大小
const fontSizeStyle = Quill.import('attributors/style/size') // 引入这个后会把样式写在style上
fontSizeStyle.whitelist = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px']
Quill.register(fontSizeStyle, true)
// 设置字体样式
const Font = Quill.import('attributors/style/font') // 引入这个后会把样式写在style上
const fonts = [
  'SimSun',
  'SimHei',
  'Microsoft-YaHei',
  'KaiTi',
  'FangSong'
]
Font.whitelist = fonts // 将字体加入到白名单
Quill.register(Font, true)
// 工具栏
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
  [{ align: [] }], // 对齐方式-----[{ align: [] }]
  [{ size: fontSizeStyle.whitelist }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
  [{ font: fonts }], // 字体种类-----[{ font: [] }]
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  [{ direction: 'ltl' }], // 文本方向-----[{'direction': 'rtl'}]
  [{ direction: 'rtl' }], // 文本方向-----[{'direction': 'rtl'}]
  [{ indent: '-1' }, { indent: '+1' }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
  [{ script: 'sub' }, { script: 'super' }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
  ['blockquote', 'code-block'], // 引用  代码块-----['blockquote', 'code-block']
  ['clean'], // 清除文本格式-----['clean']
  ['link', 'image', 'video'] // 链接、图片、视频-----['link', 'image', 'video']
]

export default {
  name: "AddNotice",
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
      active: "zh_CN",
      projectOps: [
        {
          text: "云算力",
          val: "cloud_fil",
        },
        {
          text: "POW",
          val: "x_pool_pow",
        },
      ],
      ruleForm: {
        language: "zh_CN",
        title: "",
        project: "",
        content: "",
        contentHtml: "",
        forcedSwitch: 0,
        importantSwitch: 0,
      },
      ruleForm2: {
        language: "en_US",
        title: "",
        project: "",
        content: "",
        contentHtml: "",
        forcedSwitch: 0,
        importantSwitch: 0,
      },
      editorOption: {
        ...quillConfig,
        modules: {
          toolbar: {
            container: toolbarOptions
          }
        }
      },
      rules: {
        title: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            min: 1,
            max: 30,
            message: "长度在 1 到 30 个字符",
            trigger: "blur",
          },
        ],
        project: [{ required: true, message: "请选择板块", trigger: "blur" }],
        contentHtml: [
          { required: true, message: "请输入公告内容", trigger: "blur" },
        ],
        forcedSwitch: [{ required: true, trigger: "blur" }],
        importantSwitch: [{ required: true, trigger: "blur" }],
      },
      timer: null,
      timer2: null,
    };
  },
  components: { quillEditor },

  created() {
    const { id } = this.$route.query;
    if (id) {
      this.getBannerInfo(id);
      this.id = id;
    }
  },
  methods: {
    async getBannerInfo(id) {
      let res = await this.$http.queryAnnouncement({ annId: id });
      if (res) {
        res.forEach((element) => {
          if (element.language == "zh_CN") {
            this.ruleForm = element;
          }
          if (element.language == "en_US") {
            this.ruleForm2 = element;
          }
        });
      }
    },
    changeSection(event) {
      this.ruleForm.project = event;
      this.ruleForm2.project = event;
    },
    changeForced(event) {
      this.ruleForm.forcedSwitch = event;
      this.ruleForm2.forcedSwitch = event;
    },
    changeImportant(event) {
      this.ruleForm.importantSwitch = event;
      this.ruleForm2.importantSwitch = event;
    },
    resetForm() {
      this.$router.push({ name: "noticeList" });
    },
    onEditorChange({ quill, html, text }) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.ruleForm.content = text;
      }, 300);
    },
    onEditorChange2({ quill, html, text }) {
      clearTimeout(this.timer2);
      this.timer2 = setTimeout(() => {
        this.ruleForm2.content = text;
      }, 300);
    },
    //保存
    async submitCofirm() {
      //表单1验证
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return;

        let ruleForm1 = [this.ruleForm];

        if (this.ruleForm2.title != "") {
          ruleForm1.push(this.ruleForm2);
        }

        let isEbit = false;

        //判断有没有id传进来，有就是修改
        console.log(ruleForm1);
        ruleForm1.forEach((event) => {
          if (event.id) {
            isEbit = true;
          }
        });

        if (isEbit) {
          let res = await this.$http.updateAnnouncement(ruleForm1);
          this.$router.push({ name: "noticeList" });
          if (res) {
            this.$message.success("操作成功！");
          }
        } else {
          let res = await this.$http.saveAnnouncement(ruleForm1);
          if (res) {
            this.$message.success("操作成功！");
            this.$router.push({ name: "noticeList" });
          }
        }
      });
    },

    save() {
      var obj = {};
      obj = this.arrayList.map((index) => {
        return { ...this.$ref.cond[index].onsubmint() };
      });
      console.log(obj);
    },

    foramtImgs(imgs) {
      let fileList = [];
      if (Array.isArray(imgs) && imgs.length > 0) {
        fileList = imgs.map((d, i) => ({ name: i, url: d || "" }));
      }
      return fileList;
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
/deep/.ql-container {
  height: 140px;
}

.price-box {
  margin: 0;
}

.ql-editor {
  padding: 0;
  >>> .ql-container {
    height: calc(100% - 83px);
  }
}

// .el-form-item:nth-child(4) {
//   margin-top: 100px;
// }
.el-textarea__inner {
  min-height: 100px !important;
}
.ql-editor-container {
  padding-left: 20px;
}
.el-row:nth-child(2) {
  text-align: center;
}
</style>
<style>
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}

.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "默认";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="SimSun"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="SimSun"]::before {
  content: "宋体";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="Microsoft-YaHei"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="Microsoft-YaHei"]::before {
  content: "微软雅黑";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="KaiTi"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="KaiTi"]::before {
  content: "楷体";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="FangSong"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="FangSong"]::before {
  content: "仿宋";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="SimHei"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="SimHei"]::before {
  content: "黑体";
}

.ql-toolbar.ql-snow+.ql-container.ql-snow {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.ql-toolbar.ql-snow {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.ql-snow .ql-stroke,
.ql-snow .ql-picker {
  color: #999;
  stroke: #999;
}

.ql-snow .ql-fill,
.ql-snow .ql-stroke.ql-fill {
  fill: #999;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before {
  content: "12px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before {
  content: "14px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before {
  content: "16px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before {
  content: "20px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before {
  content: "24px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="36px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="36px"]::before {
  content: "36px";
}

.ql-container {
  font-size: 14px;
}
</style>