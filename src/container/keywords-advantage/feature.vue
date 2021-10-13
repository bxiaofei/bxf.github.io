<template>
  <div class="eni-flex">
    <p class="eni-title">{{title}}</p>
    <textarea
      class="eni-textarea"
      :style="{'height': inputHeight}"
      :placeholder="placeHolder"
      :value="value"
      @input="handleInput"
    />
    <span
      class="eni-input eni-normal-count"
      style="border-left: 0px;"
      @click="handleCopy"
      v-clipboard:copy="value"
    >复制</span>
    <el-popover
      popper-class="eni-pop-box"
      placement="left-start"
      width="200"
      trigger="hover"
      visible-arrow="true"
      content="特征值，亚马逊推荐100个字符，但是允许输入更多"
    >
      <div
        class="eni-input eni-normal-count"
        :class="{'eni-warning-count': isToMore}"
        style="border-left: 0px; height: 100%"
        slot="reference"
      >{{count}}</div>
    </el-popover>
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
    },
    inputHeight: {
      type: String,
      default: "6vh"
    },
    placeHolder: {
      type: String,
      default: ""
    }
  },
  data: function() {
    return {
      count: 0,
      isToMore: false
    };
  },
  watch: {
    value(nw) {
      this._updateUI(nw);
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
      const value = vl.target.value.trim();
      this._updateUI(value);
      this.$emit("input", value);
    },
    _updateUI(value) {
      this.isToMore = value.length > 100;
      this.count = value.length;
    }
  }
};
</script>

<style lang="less" scoped>
</style>