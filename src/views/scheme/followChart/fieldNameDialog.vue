<template>
  <el-dialog
      v-if="dialogVisible"
      :title="titleText"
      :visible="dialogVisible"
      width="800px"
      @close="closeView"
      :close-on-click-modal="false"
  >
    <el-form :model="form" ref="form" label-position="top">
      <el-form-item label="字段名称" :rules="rule.input"  prop="inputData">
        <el-input placeholder="请输入" v-model="form.inputData"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSave">确定</el-button>
      <el-button type="primary" @click="closeView">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import rule from "@/mixins/rule";
// import {reCreate} from "@/api/SpecialReport";
export default {
  name: "addSpecialReport",
  mixins: [rule],
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    // 弹窗标题
    titleText: {
      type: String,
      default: "基本情况重新解析",
    },
    // 第一名称
    firstName: {
      type: String,
      default: "本情况参考信息",
    },
    contentId: {
      type: Number,
      // default: false,
    }
  },
  data() {
    return {
      form: {
        inputData : '',
      },
    };
  },
  methods: {
    closeView() {
      this.resetForm();
      this.$emit("update:dialogVisible", false);
    },
    // 重置表单
    resetForm() {
      this.$refs.form.resetFields();
    },


    //  保存
    onSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            contentId: this.contentId,
            inputData: this.form.inputData,
          }
          // reCreate(data).then(((res) => {
          //   if ( res ) {
          //     this.$message.success('提交成功');
          //     this.closeView();
          //     this.$emit('getDetail');
          //   }
          //
          //   // this.$message.success(res);
          //   // this.getDetailInfo();
          // }))
        }
      });

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

.editor {
  margin-top: 15px;
  width: 100%;

  ::v-deep .ql-editor {
    min-height: 200px;
  }
}

.tips {
  margin-top: 23px;
  display: flex;
  flex-wrap: wrap;

  .tips-item {
    margin-right: 18px;
    margin-bottom: 16px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 312px;
    height: 56px;
    flex-shrink: 0;
    border-radius: 4px;
    border: 1px solid #DEE0E3;
    line-height: normal;

    img {
      cursor: pointer;
    }
  }
}
</style>
