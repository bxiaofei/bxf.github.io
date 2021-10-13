<template>
  <div class="main">
    <div class="common-page-head">
      <!-- <p class="common-page-head-title">阿里国际站产品标题助手v1.0</p> -->
      <p class="common-page-head-title">标题</p>
    </div>
    <div class="row">
      <div class="left">
        <div class="eni-flex">
          <el-button size="small" type="primary" plain @click="handleSort">按字母排序</el-button>
        </div>
        <div class="eni-flex" style="margin-top: 10px; padding-right: 10px">
          <p class="menu-title eni-w35">关键词</p>
          <p class="menu-title eni-flex-item">搜索量</p>
          <p class="menu-title eni-flex-item">点击率</p>
          <p class="menu-title eni-flex-item">出现次数</p>
          <p class="menu-title eni-flex-item">使用次数</p>
          <p class="menu-title eni-w20 eni-text-center">出现位置</p>
          <p class="menu-title eni-w5">操作</p>
        </div>
        <div class="list-container">
          <draggable
            class="draggable"
            :list="keywordsArray"
            @start="drag = true"
            @end="drag = false"
            handle=".handle"
          >
            <div :key="index" class="cell-container" v-for="(e,index) in keywordsArray">
              <span class="fa fa-align-justify handle" />
              <p class="eni-padding-wrap eni-white eni-w35">{{e.name}}</p>
              <p class="eni-padding-wrap eni-white eni-flex-item eni-text-center">{{e.search}}</p>
              <p class="eni-padding-wrap eni-white eni-flex-item eni-text-center">{{e.click}}</p>
              <p class="eni-padding-wrap eni-white eni-flex-item eni-text-center">{{e.appear}}</p>
              <p class="eni-padding-wrap eni-white eni-flex-item eni-text-center">{{e.use}}</p>
              <div class="eni-padding-wrap eni-flex eni-w20 eni-j-center">
                <p class="badge-txt badge-light" :class="{'badge-success':e.isTitleHas}">标</p>
                <p class="badge-txt badge-light" :class="{'badge-success':e.isFeatureHas}">词</p>
                <p class="badge-txt badge-light" :class="{'badge-success':e.isDescHas}">描</p>
              </div>
              <span class="fa fa-trash-o eni-w5" style="color: red;" @click="handleDelete(index)" />
            </div>
          </draggable>
        </div>
        <el-button class="add-item-btn" type="primary" icon="el-icon-plus" size="small">
          导入CSV文件
          <input
            type="file"
            ref="refFile"
            style="opacity:0;position:absolute;width:100%;height:100%;top:0;left:0"
            @change="handleImportCSV"
          />
        </el-button>
      </div>
      <div class="keyword-container">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="TKD" name="tab-first">
            <div class="list-editor">
              <Title class="title" v-model="editor.title" />
              <Feature
                class="feature"
                :key="idx"
                :title="e.title"
                :inputHeight="e.inputHeight"
                :placeHolder="e.placeHolder"
                v-for="(e,idx) in editor.features"
                v-model="e.value"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="关键词预处理" name="tab-second">
            <div>
              <div class="eni-flex">
                <EditorInput v-model="editor.input" title="输入" />
                <div style="width: 30px"></div>
                <EditorInput v-model="editor.out" title="输出" />
              </div>
              <div class="eni-s-between" style="margin-top: 10px">
                <el-button type="primary" icon="el-icon-copy" size="small" @click="handleTidy">整理</el-button>
                <el-button
                  class="import-item-btn"
                  type="primary"
                  icon="el-icon-copy"
                  size="small"
                  @click="addInList"
                >导入到列表中</el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import Title from "./title";
import Feature from "./feature";
import EditorInput from "./editor-input";
import Papa from "papaparse";
import jschardet from "jschardet";

export default {
  components: { draggable, Title, Feature, EditorInput },
  data() {
    return {
      activeTab: "tab-first",
      keywordsArray: [],
      editor: {
        title: "",
        input: "",
        out: "",
        features: [
          {
            title: "关键词1",
            value: "",
            placeHolder: "请输入关键词"
          },
          {
            title: "关键词2",
            value: "",
            placeHolder: "请输入关键词"
          },
          {
            title: "关键词3",
            value: "",
            placeHolder: "请输入关键词"
          },
          {
            title: "产品描述",
            value: "",
            inputHeight: "25vh",
            placeHolder: "请输入产品描述"
          }
        ]
      }
    };
  },
  watch: {
    editor: {
      handler: function(val) {
        //FIXME: 输入、输出不进行下面的代码
        this._countRefer(val);
      },
      deep: true
    }
  },
  methods: {
    handleImportCSV() {
      let selectedFile = null;
      selectedFile = this.$refs.refFile.files[0];
      if (selectedFile === undefined) {
        return;
      }
      var reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = evt => {
        // 检查编码
        let encoding = this._checkEncoding(evt.target.result);
        // 将csv转换成二维数组
        Papa.parse(selectedFile, {
          encoding: encoding,
          complete: res => {
            // UTF8 \r\n与\n混用时有可能会出问题
            let data = res.data;
            if (data[data.length - 1] == "") {
              //去除最后的空行
              data.pop();
            }
            this._parseCSVData(data);
          }
        });
      };
    },
    handleDelete(index) {
      this.keywordsArray.splice(index, 1);
    },
    addInList() {
      if (this.editor.out) {
        let out = this.editor.out.replace(/\n+/g, "\n");
        let outArr = out.split("\n");
        outArr.forEach(e => {
          this.keywordsArray.push({
            name: e,
            use: 0,
            click: 0,
            search: 0,
            appear: 0,
            isTitleHas: false,
            isFeatureHas: false,
            isDescHas: false
          });
        });
        this._countRefer(this.editor);
      }
    },
    handleSort() {
      if (this.keywordsArray.length == 0) return;
      var s = this.keywordsArray.sort(this._sortKeysArray);
      this.keywordsArray = s;
    },
    added() {
      console.log("added");
    },
    removed() {
      console.log("removed");
    },
    moved() {
      console.log("moved");
    },
    handleFeatureInput(title) {
      this.myArray.forEach(e => {
        const match = this._match(title, e.name);
        e.isFeatureHas = match != null;
      });
    },
    handleTidy() {
      // remove line breaks
      let out = this.editor.input;
      out = out.trim();
      // convert to lowercase
      out = out.toLowerCase();
      // remove peculiars
      out = out.replace(/[^a-zA-Z0-9äöüß]/g, " ");
      out = out.replace(/\s+/g, " ");
      out = out.replace(/\s/g, "\n");
      this.$set(this.editor, "out", out);
    },
    _match(s, re) {
      let newRe = re
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)")
        .replace(/\?/g, "\\?")
        .replace(/\//g, "////");
      newRe = eval("/" + newRe + "/ig");
      return s.match(newRe);
    },
    _sortKeysArray(x, y) {
      let a = x.name.toLowerCase();
      let b = y.name.toLowerCase();
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    },
    _parseCSVData(data) {
      console.log(data);
      var titleDic = {
        关键词: "name",
        搜索量: "search",
        点击率: "click",
        出现次数: "appear"
      };
      var titleArr = [];
      data[0].forEach(e => {
        titleArr.push(titleDic[e]);
      });
      data.splice(0, 1);
      var newList = [];
      data.forEach(e => {
        var model = {
          name: "",
          use: 0,
          click: 0,
          search: 0,
          appear: 0,
          isTitleHas: false,
          isFeatureHas: false,
          isDescHas: false
        };
        e.forEach((m, idx) => {
          model[titleArr[idx]] = m;
        });
        newList.push(model);
      });
      this.keywordsArray = newList;
    },
    _checkEncoding(base64Str) {
      // 这种方式得到的是一种二进制串
      let str = atob(base64Str.split(";base64,")[1]);
      // 要用二进制格式
      let encoding = jschardet.detect(str);
      encoding = encoding.encoding;
      if (encoding == "windows-1252") {
        // 有时会识别错误（如UTF8的中文二字）
        encoding = "ANSI";
      }
      return encoding;
    },
    _countRefer(val) {
      this.keywordsArray.forEach(e => {
        let match = this._match(val.title, e.name);
        let titleCount = match ? match.length : 0;
        e.isTitleHas = match != null;

        let featureCount = 0;
        let descCount = 0;
        val.features.forEach((fe, idx) => {
          match = this._match(fe.value, e.name);
          if (idx != val.features.length - 1) {
            if (match) {
              featureCount += match.length;
            }
          } else {
            if (match) {
              descCount = match.length;
            }
          }
        });
        e.isFeatureHas = featureCount != 0;
        e.isDescHas = descCount != 0;
        e.use = titleCount + featureCount + descCount;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.handle {
  color: white;
  cursor: move;
}
.row {
  display: flex;
}
.import-item-btn {
  margin-right: 40px;
}
.list-editor {
  .title,
  .feature {
    margin-bottom: 10px !important;
  }
}
.menu-title {
  color: #111;
  font-size: 12px;
}
.main {
  font-size: 14px;
  padding-right: 15px;
  padding-left: 15px;
  height: 100%;
  overflow: auto;

  .left {
    flex: 1 1 50%;
    margin-top: 40px;

    .list-container {
      background-color: #fff;
      margin-top: 4px;
      min-height: 200px;
      overflow: auto;

      .draggable {
        border: 1px solid #ced4da;
      }

      .cell-container {
        height: 46px;
        background-color: #212529;
        display: flex;
        align-items: center;
        border-top: 0.5px solid #32383e;
        padding: 0.75rem 1.25rem;

        .title {
          text-align: left;
          margin-left: 10px;
          margin-right: 8px;
          font-size: 14px;
          color: #fff;
        }
        .badge-txt {
          margin-left: 3px;
          padding: 3px;
          font-size: 12px;
        }
        .badge-light {
          color: #111;
          background-color: #f8f9fa;
        }
        .badge-success {
          color: #fff;
          background-color: #28a745;
        }
      }
    }
    .add-item-btn {
      margin-top: 12px;
      margin-bottom: 12px;
      position: relative;
    }
  }

  .keyword-container {
    padding-left: 15px;
    flex: 1 1 50%;
    margin-bottom: 20px;
  }
  @media (min-height: 400px) {
    .list-container {
      max-height: 275px;
    }
  }
  @media (min-height: 575px) {
    .list-container {
      max-height: 375px;
    }
  }
  @media (min-height: 767px) {
    .list-container {
      max-height: 575px;
    }
  }
  @media (min-height: 850px) {
    .list-container {
      max-height: 675px;
    }
  }
  @media (min-height: 900px) {
    .list-container {
      max-height: 775px;
    }
  }
  @media (max-width: 980px) {
    .row {
      display: block;
    }
  }
}
</style>