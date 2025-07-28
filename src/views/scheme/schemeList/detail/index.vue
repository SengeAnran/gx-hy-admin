
<template>
<div class="detail">
  <div class="title">智能修井实施方案</div>
  <v-md-preview :text="content"></v-md-preview>
</div>
</template>

<script>
import {getPlanById} from "@/api/schemeList";
import {marked} from "marked";

export default {
  name: "index",
  data() {
    return {
      content: '',
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
        // let htmlStr =  marked(res.data.content);
        //
        // htmlStr = ((htmlStr.replace(/<\/?thead>/gi, ''))
        //   .replace(/<\/?tbody>/gi, ''))
        //   .replace(/<th>/gi, '<td>').replace(/<\/th>/gi, '<\/td>');
        this.content = res.data.content;
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
  .title {
    font-size: 36px;
    font-weight: bold;
    padding-left: 32px;
  }
}
</style>
