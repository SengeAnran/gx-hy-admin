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
      <followChart ref="followChart" :json-data="flowchart" />
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
import {ports} from "./followChart/Graph/methods";

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
      flowchart: {},
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
    changeNowPlanId() {
      this.planId = this.id;
      getPlanById(this.planId).then(res => {
        const {nodes, edges} = res.data;
        const cells = this.handleCellJson(nodes, edges);
        this.flowchart = {
          cells,
        };
        console.log(this.flowchart);
      })
    },
    /**
     *  加个cellJson数据
     * @param nodes
     * @param edges
     * @returns {*[]}
     */
    handleCellJson(nodes, edges ) {
      const nodeArr = nodes.map(i => {
        return {
          ...i,
          ports,
        }
      })
      nodeArr.forEach(i => {
        if (i.shape === 'polygon')  {
          i.attrs.label.textWrap = {
            width: -50,
            height: '70%',
            ellipsis: true
          }
          i.attrs.body.refPoints = "0,10 10,0 20,10 10,20";
        } else if (i.shape === 'ellipse')  {
          i.attrs.label.textWrap = {
            width: -20,
            height: -10,
            ellipsis: true
          }
        } else {
          i.attrs.label.textWrap = {
            width: -10,
            height: -10,
            ellipsis: true
          }
        }
      })
      let edgeArr = [];
      if (edges && edges.length > 0) {
        edgeArr = edges.map(i => {
          const edge = {
            ...i,
          }
          edge.attrs.line = {
            ...edge.attrs.line,
            "targetMarker": {
              "name": "classic",
              "size": 8
            },
            "strokeDasharray": 0,
            "style": {
              "animation": "ant-line 30s infinite linear"
            }
          }
          return edge
        })
      }

      return [...nodeArr, ...edgeArr];
    },
    // 保存
    clickSave() {
      const json = this.followChart.getChartJson();
      const nodes = [];
      const edges = [];
      json.cells.forEach((i) => {
        i.shape === 'edge'? edges.push(i) : nodes.push(i);
      })
      // this.followChart.saveToJson();
      const data = {
        planId: this.planId,
        nodes,
        edges,
      }
      saveFlow(data).then(() => {
        this.$message.success('保存成功！');
      })
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
