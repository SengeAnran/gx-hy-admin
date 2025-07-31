
<template>
<div class="detail">
  <div class="detail-title">方案详情</div>
  <div class="bottom-content">
    <followChart ref="followChart" :code="flowchart" />
  </div>

</div>
</template>

<script>
import {getPlanById} from "@/api/followchart";
import followChart from "./followChart/index.vue";
import {handleCellJson, ports} from "@/views/scheme/followChart/edit/followChart/Graph/methods";

export default {
  name: "index",
  components: {followChart},
  data() {
    return {
      flowchart: '',
      id: undefined,
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const {id} = this.$route.query;
      this.id = id;
      this.setContent();
    },
    /**
     *  设置富文本文本内容
     */
    setContent() {
      getPlanById(this.id).then(res => {
        const {nodes, edges} = res.data;
        const cells = handleCellJson(nodes, edges);
        this.flowchart = {
          cells,
        };
        // let htmlStr =  marked(res.data.content);
        //
        // htmlStr = ((htmlStr.replace(/<\/?thead>/gi, ''))
        //   .replace(/<\/?tbody>/gi, ''))
        //   .replace(/<th>/gi, '<td>').replace(/<\/th>/gi, '<\/td>');
        // this.flowchart = res.data.content;
      })
    },
  }
}
</script>

<style scoped lang="scss">
.detail {
  height: calc(100vh - 118px);
  margin: 30px;
  overflow-y: auto;
  border-radius: 12px;
  background: #FFF;
  padding: 30px 0;
  .detail-title {
    font-size: 36px;
    font-weight: bold;
    padding-left: 32px;
    margin-bottom: 22px;
  }
  .bottom-content {
    height: calc(100% - 70px);
  }
}
</style>
