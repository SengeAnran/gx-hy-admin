<template>
  <div class="app-container home">
    <div class="top-content">
      <div class="title-tip">
        <div class="title-text">您的方案已经通过审核</div>
        <div class="tip-text">我们为您定制了方案</div>
      </div>
    </div>
    <div class="list-content">
      <div
        class="list-item"
        v-for="(item, index) in listItem"
        :style="{ backgroundColor: item.bgColor}"
        :key="index"
        @click="goPage(item)"
      >
        <div class="item-left">
          <div class="name">{{ item.name }}</div>
          <div class="tip">{{ item.tip }}</div>
          <el-button :style="{background: item.btBgColor} ">去查看</el-button>
        </div>
        <div class="item-right">
          <img :src="item.imgUrl" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      text: '',
      listItem: [
        {
          bgColor: '#EBFFF3',
          btBgColor: '#39D549',
          name: '智能问答',
          tip: 'Intelligent Q&A',
          imgUrl: require('@/assets/images/home_iocn_01.png'),
          path: '/assistant/questionAnswering'
        },
        {
          bgColor: '#FFF9F7',
          btBgColor: '#FF752C',
          name: '方案生成',
          tip: 'Solution generation',
          imgUrl: require('@/assets/images/home_iocn_02.png'),
          path: '/scheme/schemeList'
        },
        {
          bgColor: '#F5FDFF',
          btBgColor: '#0A4EFF',
          name: '逻辑树生成',
          tip: 'Intelligent Q&A',
          imgUrl: require('@/assets/images/home_iocn_03.png'),
          path: '/scheme/followChart'
        },
      ],
    }
  },
  mounted() {
    this.$notify({
      title: '提示',
      message: '您有2个方案已审核通过。',
    });
  },
  methods: {
    goPage(item) {
      // console.log(item);
      this.$router.push({
        path: item.path,
      })
    }
  }
}
</script>

<style scoped lang="scss">
.home {
  height: calc(100vh - 118px);
  padding: 35px;

  .top-content {
    position: relative;
    height: 346px;
    background: url("../assets/images/home_top_bg.png") left top no-repeat;
    background-size: 100% 100%;

    .title-tip {
      position: absolute;
      top: 40%;
      left: 60px;
      transform: translateY(-50%);

      .title-text {
        color: #000;
        font-family: "PingFang SC";
        font-size: 36px;
        font-style: normal;
        font-weight: 400;
        line-height: 46px; /* 127.778% */
      }

      .tip-text {
        color: #4C5B71;
        font-family: "PingFang SC";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 36px; /* 225% */
      }
    }
  }

  .list-content {
    margin-top: 20px;
    display: flex;
    gap: 40px;
    flex-wrap: nowrap;
    justify-content: space-between;
    .list-item {

      display: flex;
      justify-content: space-between;
      flex: 1;
      padding: 45px 38px;
      height: 197px;
      flex-shrink: 0;
      border-radius: 8px;
      .item-left {
        .name {
          color: #000;
          font-family: "PingFang SC";
          font-size: 24px;
          font-style: normal;
          font-weight: 400;
          line-height: 26px; /* 108.333% */
        }
        .tip {
          margin-top: 6px;
          color: #5A717F;
          font-family: "PingFang SC";
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 26px; /* 185.714% */
        }
        .el-button {
          border: none;
          margin-top: 24px;
          color: #FFF;
        }
      }
      .item-right {
        align-self: center;
        width: 96px;
        height: 108px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }

  }
}
</style>

