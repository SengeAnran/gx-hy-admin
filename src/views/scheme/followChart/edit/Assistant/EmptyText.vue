<template>
  <div class="empty-wrp" ref="empty">
    <div class="text-top">
      <span class="txt">{{text}}</span>
<!--      <img src="./img/logo.jpg" alt="">-->
      <img src="./img/header_log.png" alt="">
    </div>
<!--    <div class="tip">我可以帮你做这些事情</div>-->
<!--    <div class="empty-bg">-->
<!--      <img src="./img/empty_bg.png" alt="">-->
<!--    </div>-->
  </div>
</template>
<script>
export default {
  props: {
    // scale: {
    //   type: Number,
    //   default: 1,
    // },
    text: {
      type: String,
      default: '暂无数据'
    },
  },
  mounted() {
    // if (this.scale !== 1) {
    //   this.$refs.empty.style = `transform:scale(${this.scale});`;
    // }
  },
};
</script>
<style lang="scss" scoped>
.empty-wrp {
  position: relative;
  //width: 100%;
  //height: 100%;
  //display: flex;
  //flex-direction: column;
  //justify-content: center;
  //align-items: center;
  //transform-origin: top left;

  .txt {
    color: black;
    //position: absolute;
    //color: grey;
    font-size: 30px;
    ////margin-top: 8px;
    //bottom: 30px;
    //letter-spacing: 0.5px;
  }
  .text-top {
    display: flex;
    align-items: center;
  }
  .tip {
    margin-top: 4px;
    color: rgba(31, 35, 41, 0.50);
    font-family: "PingFang SC";
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;

  }
  .empty-bg {
    margin-top: 27px;
  }
}
</style>
