<template>
  <el-dialog
    v-if="dialogVisible"
    :title="titleText"
    :visible="dialogVisible"
    width="800px"
    @close="closeView"
    :close-on-click-modal="false"
  >
    <el-form :model="form" label-position="top" >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="提示词名称" prop="templateName">
            <div class="base-item-box">  {{form.templateName}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类型" prop="typ">
            <div class="base-item-box">  {{form.typ === 1? '舆情分析' :( form.typ === 2? '': '')}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="提示词说明" prop="comment">
        <div class="base-item-box">  {{form.comment}}</div>
      </el-form-item>
      <el-form-item label="抽取内容背景" prop="extractContentBg">
        <div class="base-item-box">  {{form.extractContentBg}}</div>
       </el-form-item>
      <div style="font-weight: 600; font-size: 18px">抽取字段</div>
      <el-form-item v-for="(item, index) in form.extractFields" :key="index" :label="item.extractField">
        <div class="base-item-box">  {{item.extractSample}}</div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="closeView">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "DetailDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    reviewMethod: {
      type: Function,
    },
    form: Object,
    // 弹窗标题
    titleText: {
      type: String,
      default: "详情",
    },
    editAbilityList: {
      type: Array,
    },
    defaultAbilityCheckedKeys: {
      type: Array,
    },
  },
  data() {
    return {

    };
  },
  methods: {
    closeView() {
      this.$emit("update:dialogVisible", false);
    },
  },
};
</script>

<style lang="scss" scoped>

.base-item-box {
  border: 1px solid #DEE0E3;
  border-radius: 4px;
  padding: 19px 20px 15px;
  font-size: 16px;
  line-height: 26px;
  white-space: pre-line;

}
.el-button {
  border-radius: 4px;
}
.el-dialog ::v-deep .el-form-item__label {
  line-height: 34px;
}
</style>
