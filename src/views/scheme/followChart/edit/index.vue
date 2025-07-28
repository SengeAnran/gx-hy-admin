<template>
  <div class="edit-page">
    <div class="left-content">
      <div class="edit-header">
        <div class="edit-title">编辑{{ typeName }}</div>
        <div class="header-btns">
          <el-button type="primary" @click="clickSave">保存</el-button>
        </div>
      </div>
<!--      <MermaidChart :code="flowchart" />-->
      <followChart ref="followChart" :code="flowchart" />
    </div>
    <assistant @changeNowPlanId="changeNowPlanId" class="right-content">
    </assistant>
  </div>

</template>

<script>

// import MermaidChart from './MermaidChart.vue';
import assistant from './Assistant'
import followChart from './followChart/index.vue'
import {saveFlow, getPlanById} from "@/api/followchart";


export default {
  components: {
    followChart,
    assistant,
    // MermaidChart,
  },
  data() {
    return {
      id: undefined,
      planId: undefined,
      followChart: null,
      typeName: '方案',
      content: "Hello quill",
      flowchart: '',
    }
  },
  mounted() {
    this.init();

  },
  methods: {
    /**
     * 初始化数据
     */
    init() {
      this.followChart = this.$refs.followChart;
      const {id} = this.$route.query;
      this.id = id;
    },

    // 设置方案id
    changeNowPlanId(id) {
      this.planId = id;
      getPlanById(this.planId).then(res => {
        // this.flowchart = res.data.content;
        this.flowchart = '';

      })
    },
    // 保存
    clickSave() {
      console.log('clickSave');
      // const json = this.followChart.getChartJson();
      this.followChart.saveToJson();
      // const data = {
      //   id: this.planId,
      //   content: json,
      // }
      // saveFlow(data).then(() => {
      //   this.$message.success('保存成功！');
      // })
    }
  }
}
</script>


<style scoped lang="scss">

.edit-page {
  background: rgb(245, 245, 245);
  height: calc(100vh - 74px);
  gap: 20px;
  display: flex;
  padding: 20px;

  .left-content {
    background: #FFF;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    height: 100%;
    //flex: 2.8;
    max-width: 1200px;
    min-width: 800px;
    gap: 20px;

    .edit-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      //background: white;
      padding: 34px 34px 20px 38px;
      //border-radius: 8px;
      //box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      //margin-bottom: 20px;
      .edit-title {
        color: #000;
        font-family: "PingFang SC";
        font-size: 26px;
        font-style: normal;
        font-weight: 400;
        line-height: 46px; /* 176.923% */
      }
    }

    .quill-editor {
      flex: 1;
      background: white;
      //border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;

      ::v-deep .ql-container {
        //height: calc(100% - 66px);
        //border: none;
      }
    }
  }

  .right-content {
    flex: 1;
    min-width: 250px;
  }
}
</style>
