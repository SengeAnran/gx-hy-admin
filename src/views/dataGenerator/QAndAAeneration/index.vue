

<template>
<div class="app-container q-a-a">
  <h4>已生成QA对</h4>
  <Crud
    ref="crud"
    :get-method="getMethod"
    hideEdit
    hide-search
    hide-tabel
    hide-add
    hide-delete
    hide-table
    hideView
    selection
    id-key="id"
    :showOrder="false"
    deleteText="是否确认删除？"
    labelWidth="100px"
    actionWidth="180px"
    dialogWidth="1000px"
    :permission-add="['*:*:*']"
    :permission-edit="['*:*:*']"
    :permission-delete="['*:*:*']"
  >
    <template v-slot:data="{data}">
      <div class="qa-list">
        <div class="qa-list-item" v-for="(item, index) in data" :key="index" >
          <div class="question">{{item.question}}</div>
<!--          <div class="res">{{item.answer}}</div>-->

          <v-md-preview :text="item.answer"></v-md-preview>
          <div class="btns">
            <el-button type="success" icon="el-icon-check"  v-if="item.status === 1 "></el-button>
            <el-button type="info" icon="el-icon-close"  v-if="item.status === 2 "></el-button>
            <el-button type="primary" v-if="item.status === 0" @click="onSure(item,1)">确定</el-button>
            <el-button type="danger"  v-if="item.status === 0" @click="onSure(item,2)">取消</el-button>
          </div>
        </div>
      </div>
    </template>
  </Crud>

</div>
</template>
<script>
import {confirm, getList} from "@/api/qAndA";

export default {
  name: "index",
  data() {
    return {
      getMethod: getList,
      toolbar: {
        customToolbar: {
          icon: 'toolbar图标类名',
          title: 'hover时显示的标题',
          action(editor) {
            // toolbar点击时触发的函数
          },
        },
      },
    }
  },
  methods: {
   onSure(item, status){
     this.$confirm('确定执行此项操作?','提示',{
       confirmButtonText: '确定',
       cancelButtonText: '取消',
       type: 'warning'
     }).then(() => {
       const data = {
         id: item.id,
         status,
       }
       confirm(data).then(res => {
         console.log(res)
         this.$refs.crud.getItems();
       })
     })

   }
  },
}
</script>
<style scoped lang="scss">
.q-a-a {
padding: 35px 40px;
  h4 {
    margin: 0;
    font-weight: bold;
  }
  .qa-list {
    .qa-list-item {
      border: 1px solid #eee;
      border-radius: 4px;
      padding: 20px;
      margin-bottom: 16px;
      .question {
        font-weight: bold;
        margin-bottom: 8px;
      }
      .res {
        color: #666;
        margin-bottom: 12px;

      }
      .btns {
        display: flex;
        justify-content: right;
      }
      ::v-deep .github-markdown-body {
        padding: 0;
      }
    }
  }
}
</style>
