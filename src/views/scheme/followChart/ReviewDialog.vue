<template>
  <el-dialog
    v-if="dialogVisible"
    :title="titleText"
    :visible="dialogVisible"
    width="800px"
    @close="closeView"
    :close-on-click-modal="false"
  >
    <el-form :model="form" ref="form" :rules="rule" label-position="top" >
      <el-form-item label="审核结论" :rules="rule.select" prop="approval">
        <el-radio-group v-model="form.approval">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="0">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="意见" prop="comment">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="form.comment">
        </el-input>
      </el-form-item>
      <el-form-item label="审核记录" >
        <div class="review-list">
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="createTime"
              label="时间"
              width="180">
            </el-table-column>
            <el-table-column
              prop="approvalContent"
              label="审核结论"
              width="180">
            </el-table-column>
            <el-table-column
              prop="comment"
              label="意见">
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button  type="" @click="closeView">关闭</el-button>
      <el-button  type="primary" @click="upReview">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getComment, review} from "@/api/followchart";
import rule from "@/mixins/rule";

export default {
  name: "ReviewDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    reviewMethod: {
      type: Function,
    },
    // 弹窗标题
    titleText: {
      type: String,
      default: "审核方案",
    },
    reviewId: {
      type: Number,
    },
  },
  mixins: [rule],
  data() {
    return {
      form: {
        id: undefined,
        approval: undefined, //0-不通过 1-通过
        comment: '', // 意见
      },
      tableData: []
    };
  },
  mounted() {

  },
  watch: {
    reviewId(val) {
      if (val) {
        this.form.id = this.reviewId;
      }
    },
    dialogVisible(val) {
      this.initData();
      this.form.id = this.reviewId;
    }
  },
  methods: {
    initData() {
      getComment(this.reviewId).then(res => {
        this.tableData = res.data;
      })
    },
    closeView() {
      this.resetForm();
      this.$emit("update:dialogVisible", false);
    },
    // 审核
    upReview() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const data = {
            ...this.form,
          }
          review(data).then(() => {
            this.$message.success('提交审核成功！')
            this.$emit('getList');
            this.closeView();
          })
        }
      });

    },
    // 重置表单
    resetForm() {
      this.$refs.form.resetFields();
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
