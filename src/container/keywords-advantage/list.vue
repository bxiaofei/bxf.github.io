<template>
  <div>
    <div v-if="array.length == 0">
      <EmptyPrompt />
    </div>
    <div v-else>
      <div class="eni-s-between">
        <el-button size="small" type="primary" plain @click="handleSort">按字母排序</el-button>
        <el-popover
          popper-class="eni-pop-box"
          width="100"
          placement="left-start"
          trigger="hover"
          visible-arrow="true"
          content="删除列表中所有关键词"
        >
          <el-button
            size="small"
            type="primary"
            style="color: red;background-color: white;border-color: red;padding: 8px 10px;"
            icon="el-icon-delete"
            slot="reference"
            @click="handleDeleteAll()"
          ></el-button>
        </el-popover>
      </div>
      <div class="eni-flex" style="margin-top: 10px; padding: 6px 1.25rem;">
        <p class="menu-title" style="padding-left: 2vw; width:38%">关键词</p>
        <p class="menu-title eni-flex-item eni-text-center">搜索量</p>
        <p class="menu-title eni-flex-item eni-text-center">点击率</p>
        <p class="menu-title eni-flex-item eni-text-center">出现次数</p>
        <p class="menu-title eni-flex-item eni-text-center">使用次数</p>
        <p class="menu-title eni-w20 eni-text-center">出现位置</p>
        <p class="menu-title eni-w5 eni-text-center">操作</p>
      </div>
      <draggable
        class="draggable"
        :list="array"
        @start="drag = true"
        @end="drag = false"
        handle=".handle"
      >
        <div :key="index" class="cell-container" v-for="(e,index) in array">
          <span class="fa fa-align-justify eni-w3 handle" />
          <p
            class="eni-padding-wrap eni-white eni-w35"
            :class="{'menu-title-success':e.isTitleHas || e.isFeatureHas || e.isDescHas}"
            slot="reference"
          >{{e.name}}</p>
          <p class="eni-padding-wrap eni-white eni-flex-item eni-text-center">{{e.search}}</p>
          <p class="eni-padding-wrap eni-white eni-flex-item eni-text-center">{{e.click}}</p>
          <p class="eni-padding-wrap eni-white eni-flex-item eni-text-center">{{e.appear}}</p>
          <p class="eni-padding-wrap eni-white eni-flex-item eni-text-center">{{e.use}}</p>
          <div class="eni-padding-wrap eni-flex eni-w20 eni-j-center">
            <p class="badge-txt badge-light" :class="{'badge-success':e.isTitleHas}">标</p>
            <p class="badge-txt badge-light" :class="{'badge-success':e.isFeatureHas}">词</p>
            <p class="badge-txt badge-light" :class="{'badge-success':e.isDescHas}">描</p>
          </div>
          <div class="eni-flex eni-w5">
            <span
              class="fa fa-clone"
              style="color: white; display: flex; justify-content: center; cursor: pointer;"
              v-clipboard:copy="e.name"
              @click="handleCopyName(e.name)"
            />
            <span
              class="fa fa-trash-o"
              style="margin-left: 10px; color: #F56C6C;display: flex;justify-content: center; cursor: pointer;"
              @click="handleDelete(index)"
            />
          </div>
        </div>
      </draggable>
    </div>

    <div class="add-container">
      <div class="eni-flex-item add-box">
        <el-button
          class="add-item-btn"
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="handleAdd"
        >添加</el-button>
        <textarea class="eni-block eni-textarea" placeholder="将要添加到列表中的关键词填写到这里" v-model="dataTxt" />
      </div>
      <p class="or">或者</p>
      <div class="eni-flex-item">
        <el-button class="add-item-btn" type="primary" icon="el-icon-plus" size="small">
          导入CSV文件
          <input
            type="file"
            ref="refFile"
            style="opacity:0;position:absolute;width:100%;height:100%;top:0;left:0"
            @change="handleAddCSV"
          />
        </el-button>
        <p class="csv-prompt-txt">
          CSV文件头必须为
          <span style="color: red;">关键词，搜索量，点击率，出现次数</span>，其中
          <span style="color: red;">关键词</span> 是必填
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import Papa from "papaparse";
import jschardet from "jschardet";
import EmptyPrompt from "./empty-prompt";

export default {
  components: { draggable, EmptyPrompt },
  props: {
    editor: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dataTxt: "",
      array: []
    };
  },
  watch: {
    editor: {
      handler: function(val) {
        this._computedRefer(this.array, val);
        // 数组去重
        this.array = this._unique(this.array);
      },
      deep: true
    }
  },
  methods: {
    handleSort() {
      if (this.array.length == 0) return;
      this.array = this.array.sort(this._sortKeysArray);
    },
    handleDelete(index) {
      this.array.splice(index, 1);
    },
    handleDeleteAll() {
      this.$confirm("删除列表中所有关键字, 是否继续?", "删除关键词", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.array = [];
        })
        .catch(() => {});
    },
    handleCopyName(name) {
      if (name) {
        this.$message({
          message: "复制成功",
          type: "success"
        });
      }
    },
    handleAdd() {
      if (!this.dataTxt) return;
      let dataArr = this._txtToListArr(this.dataTxt);
      this._computedRefer(dataArr, this.editor);
      let newArr = this.array.concat(dataArr);
      // 数组去重
      this.array = this._unique(newArr);
      this.dataTxt = "";
    },
    handleAddCSV() {
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
            let s = this._parseCSVData(data);
            this.array = s;
          }
        });
      };
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
      return newList;
    },
    _sortKeysArray(x, y) {
      let a = x.name.toLowerCase();
      let b = y.name.toLowerCase();
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    },
    _txtToListArr(value) {
      let newArr = [];
      let out = value.replace(/\n+/g, "\n");
      let outArr = out.split("\n");
      outArr.forEach(e => {
        newArr.push({
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
      return newArr;
    },
    _computedRefer(array, editor) {
      array.forEach(e => {
        let match = this._match(editor.title, e.name);
        let titleCount = match ? match.length : 0;
        e.isTitleHas = match != null;

        let featureCount = 0;
        let descCount = 0;
        editor.features.forEach((fe, idx) => {
          match = this._match(fe.value, e.name);
          if (idx != editor.features.length - 1) {
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

      return array;
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
    _unique(arr) {
      const res = new Map();
      return arr.filter(arr => !res.has(arr.name) && res.set(arr.name, 1));
    }
  }
};
</script>

<style lang="less" scoped>
.menu-title {
  color: black;
  font-size: 12px;
  font-weight: 700;
}
.menu-title-success {
  color: #4cd964;
}
.draggable {
  border: 1px solid #ced4da;
  background-color: #fff;
  min-height: 1;
  overflow: auto;
}
.cell-container {
  height: 46px;
  background-color: #212529;
  display: flex;
  align-items: center;
  border-top: 0.5px solid #32383e;
  padding: 0.75rem 1.25rem;

  .handle {
    color: white;
    cursor: move;
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
.add-container {
  display: flex;
  margin: 30px 0px 20px;

  .add-item-btn {
    width: 100%;
    height: 32px;
    margin-top: 12px;
    position: relative;
  }
  .or {
    margin: 20px 50px;
  }
  .csv-prompt-txt {
    margin-top: 5px;
    font-size: 12px;
  }
}

@media (min-height: 400px) {
  .draggable {
    max-height: 275px;
  }
}
@media (min-height: 575px) {
  .draggable {
    max-height: 375px;
  }
}
@media (min-height: 767px) {
  .draggable {
    max-height: 575px;
  }
}
@media (min-height: 850px) {
  .draggable {
    max-height: 675px;
  }
}
@media (min-height: 900px) {
  .draggable {
    max-height: 775px;
  }
}
</style>