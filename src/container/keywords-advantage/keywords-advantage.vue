<template>
  <div class="main">
    <div class="common-page-head">
      <p class="common-page-head-title">阿里国际站产品标题助手v1.0</p>
    </div>
    <div class="row">
      <div class="left">
        <List v-model="keywordsArray" :editor="editor" />
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
                <EditorInput v-model="input" title="输入" />
                <div style="width: 30px"></div>
                <EditorInput v-model="out" title="输出" />
              </div>
              <div class="eni-s-between" style="margin-top: 10px">
                <el-button type="primary" icon="el-icon-copy" size="small" @click="handleTidy">整理</el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "./title";
import Feature from "./feature";
import EditorInput from "./editor-input";
import List from "./list";

export default {
  components: { Title, Feature, EditorInput, List },
  data() {
    return {
      activeTab: "tab-first",
      keywordsArray: [],
      input: "",
      out: "",
      editor: {
        title: "",

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
            inputHeight: "300px",
            placeHolder: "请输入产品描述"
          }
        ]
      }
    };
  },

  methods: {
    handleFeatureInput(title) {
      this.keywordsArray.forEach(e => {
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
    }
  }
};
</script>

<style lang="less" scoped>
.row {
  display: flex;
}
.list-editor {
  .title,
  .feature {
    margin-bottom: 10px !important;
  }
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
  }
  .keyword-container {
    padding-left: 40px;
    flex: 1 1 50%;
    margin-bottom: 20px;
  }

  @media (max-width: 980px) {
    .row {
      display: block;
    }
    .keyword-container {
      padding-left: 0px;
    }
  }
}
</style>