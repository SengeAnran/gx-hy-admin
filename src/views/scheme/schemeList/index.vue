
<template>
<div class="app-container page">
  <Crud
      ref="crud"
      :get-method="getMethod"
      :before-get-method-set-query="beforeGetMethodSetQuery"
      :delete-method="deleteMethod"
      :delete-all-method="deleteAllMethod"
      :add-method="addMethod"
      :update-method="updateMethod"
      :before-edit-method="beforeEdit"
      :before-save-method="beforeSave"
      :query.sync="query"
      :form.sync="form"
      @selectionChange="selectionChange"
      addText="新建方案"
      title="方案"
      hide-view
      hide-edit
      hide-delete
      selection
      multipleDelete
      id-key="id"
      :showOrder="false"
      deleteText="是否确认删除？"
      labelWidth="100px"
      dialogWidth="600px"
      :permission-add="['*:*:*']"
      :permission-edit="['*:*:*']"
      :permission-delete="['*:*:*']"
  >
    <template v-slot:search>
      <div class="search-item">
<!--        <span class="label">方案名称</span>-->
        <el-input size="small" v-model="query.name" placeholder="请输入方案名称"></el-input>
      </div>
<!--      <div class="search-item">-->
<!--        <span class="label">井号</span>-->
<!--        <el-input size="small" v-model="query.number" placeholder="请输入"></el-input>-->
<!--      </div>-->
<!--      <div class="search-item">-->
<!--&lt;!&ndash;        <span class="label">方案作者</span>&ndash;&gt;-->
<!--        <el-input size="small" v-model="query.author" placeholder="请输入"></el-input>-->
<!--      </div>-->
      <div class="search-item">
<!--        <span class="label">方案状态</span>-->
        <el-select
          v-model="query.status"
          size="small"
          placeholder="请选择方案状态"
          clearable
          style="width: 240px"
        >
          <!--            <el-option-->
          <!--                v-for="dict in dict.type.sys_common_status"-->
          <!--                :key="dict.value"-->
          <!--                :label="dict.label"-->
          <!--                :value="dict.value"-->
          <!--            />-->
          <el-option
            v-for="dict in statusOption"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </div>
<!--      <div class="search-item">-->
<!--        <span class="label">创建时间</span>-->
<!--        <el-date-picker-->
<!--          size="small"-->
<!--          v-model="query.createTime"-->
<!--          value-format="yyyy-MM-dd"-->
<!--          type="daterange"-->
<!--          range-separator="至"-->
<!--          start-placeholder="开始日期"-->
<!--          end-placeholder="结束日期"-->
<!--        ></el-date-picker>-->
<!--      </div>-->
<!--      <div class="search-item">-->
<!--        <span class="label">完稿时间</span>-->
<!--        <el-date-picker-->
<!--          size="small"-->
<!--          v-model="query.finishTime"-->
<!--          value-format="yyyy-MM-dd"-->
<!--          type="daterange"-->
<!--          range-separator="至"-->
<!--          start-placeholder="开始日期"-->
<!--          end-placeholder="结束日期"-->
<!--        ></el-date-picker>-->
<!--      </div>-->
<!--      <div class="inline-flex mb-6 pl-0">-->
<!--        -->
<!--      </div>-->
    </template>
    <template v-slot:crudAction>
<!--      <el-link @click="toEditPage" type="primary">编辑</el-link>-->
<!--      <el-button :disabled="selections.length !== 1" icon="el-icon-document-copy" type="success" size="mini" plain @click="copyItem" class="" >复制</el-button>-->
    </template>
    <template v-slot:table>
      <el-table-column label="方案名称" prop="name" align="left" min-width="100px"></el-table-column>
      <el-table-column label="井号" prop="number" align="left" min-width="100px"></el-table-column>
      <el-table-column label="方案作者" prop="author" align="left" min-width="50px"></el-table-column>
      <el-table-column label="方案状态"  align="center">
        <template v-slot="{row}">
<!--          <el-tag :type="row.status === 2 ? 'success': ''">{{row.statusName}}</el-tag>-->
          {{row.statusName}}
        </template>
      </el-table-column>
<!--      <el-table-column label="提示词说明" prop="comment" align="center"></el-table-column>-->
<!--      <el-table-column label="状态" prop="status" align="center" >-->
<!--        <template v-slot="{row}">-->
<!--&lt;!&ndash;          {{row.status === 1? '启用' :'停用'}}&ndash;&gt;-->
<!--          <el-switch-->
<!--              @change="val => changeStatus(val, row.id)"-->
<!--              v-model="row.status"-->
<!--              :active-value="1"-->
<!--              :inactive-value="0"-->
<!--          >-->
<!--          </el-switch>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
      <el-table-column label="完稿时间" prop="finishTime" align="center"></el-table-column>
    </template>
    <template v-slot:tableAction="scope">
      <el-link  @click="toDetailPage(scope.data.id)" type="primary">查看</el-link>
      <el-link
        v-if="scope.data.status === 1 ||scope.data.status === 2 ||
                 scope.data.status === 3"
        @click=" handleCommand('scheme', scope.data.id)"
        type="primary"
      >编辑</el-link>
      <el-link  v-if="scope.data.status === 4"  @click=" showReview( scope.data.id)" type="primary">审核</el-link>
      <el-link   v-hasRole="['admin']" v-if="scope.data.status === 2 || scope.data.status === 3"  @click="commit( scope.data.id)" type="primary">提交</el-link>
      <!--      <el-dropdown v-if="scope.data.status === 1" size="" @command="(command) => handleCommand(command, scope.data.id)" v-hasPermi="['system:role:edit']">-->
      <!--        <el-button size="" type="text" >编辑 <i class="el-icon-arrow-down"></i></el-button>-->
      <!--        <el-dropdown-menu slot="dropdown">-->
      <!--          <el-dropdown-item command="scheme">方案</el-dropdown-item>-->
      <!--          <el-dropdown-item command="instruction">指令</el-dropdown-item>-->
      <!--          <el-dropdown-item command="mbom">物料清单</el-dropdown-item>-->
      <!--        </el-dropdown-menu>-->
      <!--      </el-dropdown>-->
      <el-link  v-if="scope.data.status === 2" @click="showDetail(scope.data)" type="success">导出</el-link>
    </template>
    <template v-slot:form>
      <el-form-item label="方案名称" :rules="rule.input" prop="name">
        <el-input  placeholder="请输入名称"  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="井号" :rules="rule.input" prop="number">
        <el-input  placeholder="请输入井号"  v-model="form.number"></el-input>
      </el-form-item>
      <el-form-item label="作业流程图" :rules="rule.input" prop="number">
        <el-select v-model="form.flowId" placeholder="请选择">
          <el-option
            v-for="item in chartOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

    </template>
  </Crud>
  <DetailDialog
      :dialog-visible.sync="showDetailDialog"
      :form="detailForm"
  />
  <ReviewDialog
      :dialog-visible.sync="showReviewDialog"
      :review-id="reviewId"
      @getList="$refs.crud.getItems()"
  />
</div>
</template>
<script>
import rule from "@/mixins/rule";
import {
  deleteAll,
  deleteOne,
  editOne,
  getList,
  addOne,
  queryById,
  updateStatus,
  promptCopy,
  getStatus,
  getCommit, getFlow
} from "@/api/schemeList";
import DetailDialog from "./DetailDialog.vue";
import {patentArr, specialReportArr} from "./constant";
import ReviewDialog from "@/views/scheme/schemeList/ReviewDialog.vue";
export default {
  name: "index",
  components: {ReviewDialog, DetailDialog},
  mixins: [rule],
  data() {
    return {
      selections: [], // 选中项
      showDetailDialog: false,
      showReviewDialog: false,
      reviewId: undefined, // 审核id
      activeIndex: 0,
      inputVisible: false,
      inputValue: '',
      query: {
        name: '',
        number: '',
        status: undefined,
        finishTime: [],
        createTime: [],
        createTimeStart: '',
        createTimeEnd: '',
        finishTimeStart: '',
        finishTimeEnd: '',
      },
      form: {
        name: '', // 提示词名称
        number: '', // 提示词名称
        flowId: undefined, // 流程图id
      },
      detailForm: {},//详情
      chartOptions: [],
      statusOption: [],
      // localRule: {
      //   patentRule: [
      //     {required: true, validator: patentRule, trigger: "blur"},
      //   ],
      // },
      currentRow: null,
      getMethod: getList,
      deleteMethod: deleteOne,
      deleteAllMethod: deleteAll,
      addMethod: addOne,
      updateMethod: editOne,
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      getStatus().then(res => {
        this.statusOption = res.data.map( i => {
          return {
            label: i.statusName,
            value: i.status,
          }
        })
      })
      getFlow({name: '', number: ''}).then(res => {
        this.chartOptions = res.data.map( i => {
          return {
            label: i.name,
            value: i.flowId,
          }
        })
      })
    },
    // 更多操作触发
    handleCommand(command, id) {
      const query = {
        id: id,
        type: command,
      }
      this.toEditPage(query);
    },
    beforeGetMethodSetQuery(params) {
      const data = {
        ...params,
      }
      if (params.finishTime && params.finishTime.length === 2) {
        data.finishTimeStart = params.finishTime[0];
        data.finishTimeEnd = params.finishTime[1];
      }
      if (params.createTime && params.createTime.length === 2) {
        data.createTimeStart = params.createTime[0];
        data.createTimeEnd = params.createTime[1];
      }
      delete data.finishTime;
      delete data.createTime;
      return data;
    },
    toEditPage(query) {
      this.$router.push({
        path: '/scheme/edit',
        query,
      })
    },
    toDetailPage(id) {
      this.$router.push({
        path: '/scheme/schemeDetail',
        query: {
          id,
        }
      })
    },
    // 选中发生改变
    selectionChange(val) {
      this.selections = val;
    },
    // 复制
    copyItem() {
      const data = {
        id: this.selections[0].id,
      }
      promptCopy(data).then(() => {
        this.$message.success('复制成功！');
        this.$refs.crud.getItems();
      })
    },
    addField() {
      this.$prompt('请输入字段名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\S{1,6}$/,
        inputErrorMessage: '请输入最多6个字符的字段名称'
      }).then(({ value }) => {
        this.form.extractFields.push({
          extractField: value,
          extractSample: '',
        })
        // this.$message({
        //   type: 'success',
        //   message: '你的邮箱是: ' + value
        // });
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '取消输入'
        // });
      });
    },
    //  查看详情
    showDetail(row) {
      queryById(row.id).then(res => {
        this.detailForm = {
          ...res,
        }
        this.showDetailDialog = true;
      })
      // this.detailForm = {
      //   ...row,
      //   tips: row.extractField ? row.extractField.split(',') : [],
      // }

    },
    //  审核
    showReview(id) {
      this.reviewId = id;
      this.showReviewDialog = true;
      // this.detailForm = {
      //   ...row,
      //   tips: row.extractField ? row.extractField.split(',') : [],
      // }

    },
    //  提交
    commit(id) {
      this.reviewId = id;
      getCommit(id).then(() => {
        this.$message.success('提交成功！');
        this.$refs.crud.getItems();
      }).catch( () => {
        // this.$message.warning('提交成功！');
      })

    },
    // 改变状态
    changeStatus(val, id) {
      const data = {
        status: val,
        id,
      }
      updateStatus(data).then(() => {
        this.$refs.crud.getItems();
      })
    },
    //  编辑前
    beforeEdit(item) {
      queryById(item.id).then(res => {
        this.form = {
          ...res,
          // tips: item.extractField ? item.extractField.split(',') : [],
        }
      })

    },
    //  保存前
    beforeSave() {
      const data = {
        ...this.form,
        // extractField: this.form.tips.join(','),
      }
      return data;
    },
    removeOne(item,index) {
      this.form.patents.splice(index, 1);
    },
    goLayCode() {

    },
    changePro(val) {
      if (val) {
        // const obj = this.promptOption.filter(i => i.value === val)[0];
        // this.form.prompt = obj.text;
        this.form.extractFields = val === 1? patentArr.map(i => {return {...i}}): specialReportArr.map(i => {return {...i}});
      }

    },
    handleClose(index) {
      // this.form.tips.splice(this.form.tips.indexOf(tag), 1);
      this.form.extractFields.splice(index, 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.form.tips.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    }
  }
}
</script>


<style scoped lang="scss">
.btnActive {
  border: 1px solid #0A9FFD;
  color: #0A9FFD;
}
.search-item {
  margin-right: 10px;
  margin-bottom: 18px;
  .label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-weight: 700;
  }
  .el-input {
    //width: 150px;
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
    img {
      cursor: pointer;
    }
  }
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.el-tag {
  margin-right: 10px;
}
::v-deep .el-form-item__content {
  position: relative;

  .add-title-btn {
    position: absolute;
    max-width: 70px !important;
    min-width: auto;
    top: 45px;
    left: -74px;
    border: 1px solid #0B5AC7;
  }
  .field-item {
    display: flex;
    margin-bottom: 20px;
    .tag-box {
      padding-top: 8px;
      width: 200px;
      .el-tag {
        position: relative;
        text-align: left;
        min-height: 32px;
        height: auto;
        display: inline-block;
        width: 130px;
        //width: 100%;
        padding: 6px 12px;
        line-height: 20px;
        //max-width: 180px;
        white-space: pre-wrap;
        .el-icon-close {
          position: absolute;
          right: 10px;
          top: 8px;
        }
      }
    }
  }
}
.el-form-item {
  .el-button {
    border-radius: 4px;
  }
}

.el-form-item {
  ::v-deep .el-input__inner {
    border-radius: 4px;
  }
}
.el-link {
  margin: 0 10px;
}
</style>
