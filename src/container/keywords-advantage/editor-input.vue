<template>
  <div class="eni-flex-item">
    <strong>{{title}}</strong>
    <textarea class="eni-textarea textarea" :value="value" @input="handleInput" />
    <div class="eni-s-between">
      <p class="countTxt">{{countTxt}}</p>
      <el-button
        class="add-item-btn"
        type="primary"
        size="mini"
        icon="el-icon-copy-document"
        v-clipboard:copy="value"
        @click="handleCopy"
      >复制</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    }
  },
  data: function() {
    return {
      inputTxt: "",
      countTxt: "0 个字符, 0 个单词"
    };
  },
  watch: {
    value(val) {
      this._updateUI(val);
    }
  },
  methods: {
    handleCopy() {
      if (this.value) {
        this.$message({
          message: "复制成功",
          type: "success"
        });
      }
    },
    handleInput(vl) {
      let value = vl.target.value;
      this._updateUI(value);
      this.$emit("input", value);
    },
    _updateUI(vl) {
      let value = vl.trim();
      value = value.replace(/\n/g, " ");
      let characterCount = value.length;
      value = value.replace(/\s+/g, " ");
      let words = value ? value.split(" ").length : 0;
      this.countTxt = `${characterCount} 个字符，${words} 个单词`;
    }
  }
};
</script>

<style lang="less" scoped>
.textarea {
  margin-top: 8px;
  margin-bottom: 4px;
  width: 100%;
  height: 50vh;
}
.countTxt {
  font-size: 12px;
}
</style>