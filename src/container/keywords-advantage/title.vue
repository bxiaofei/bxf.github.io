<template>
  <div class="eni-flex">
    <p class="eni-title">产品标题</p>
    <input class="eni-input eni-stretch" :value="value" placeholder="请输入标题" @input="handleInput" />
    <div
      class="eni-input eni-normal-count"
      style="border-left: 0px"
      @click="handleCopy"
      v-clipboard:copy="value"
    >复制</div>
    <el-popover
      popper-class="eni-pop-box"
      placement="left-start"
      width="200"
      trigger="hover"
      visible-arrow="true"
      content="标题不能超过128个字符"
    >
      <div
        style="border-left: 0px; height: 100%"
        class="eni-input eni-normal-count"
        slot="reference"
        :class="{'eni-warning-count': isToMore}"
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
    }
  },
  data: function() {
    return {
      count: 0,
      isToMore: false
    };
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
      value = value.trim();
      this.count = value.length;
      this.isToMore = value.length > 128;

      value = value.replace(/\s+/g, " ");
      this.$emit("input", value);
    }
  }
};
</script>

<style lang="less">
</style>