<template>
<!--  <div class="">-->
  <div class="assistant container-box">
<!--    <el-button-group>-->
<!--      <el-button v-for="(item,index) in btnList" :key="index" :class="{ 'el-button--primary':activeIndex === index}"-->
<!--                 @click="changeActive(index)">{{ item }}-->
<!--      </el-button>-->
<!--    </el-button-group>-->
    <!--  消息问道记录-->
    <div
      class="chat-list"
      v-loading="getListLoading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      ref="container"
    >
      <EmptyText text="您好！我是智能修井助手，请问有什么可以帮您？" v-if="chatList.length === 0"/>
      <div class="chat-list-item" v-for="(item,index) in chatList" :key="index">
        <!--       问  -->
        <div class="question-item" v-if="item.type === 'question'">
          <div class="header-img">
            <img src="./img/question_header.png" alt="">
          </div>
          <div class="question-info">
            <div class="question-text">{{ item.content }}</div>
            <div class="question-base-info">
              <div class="time">{{ item.time }}</div>
              <div class="copy" @click="copyText(item.content)">
                <i class="el-icon-copy-document"></i> 复制
              </div>
              <i class="refresh el-icon-refresh-right" @click="refresh(item)"></i>
            </div>
          </div>
        </div>
        <!--        答-->
        <div class="res-item" v-if="item.type === 'res'">
          <div class="res-top">
            <div class="header-img">
<!--              <img src="./img/logo.jpg" alt="">-->
              <img src="./img/res_header.png" alt="">
            </div>
            <div class="res-text">
              <v-md-preview :text="item.content"></v-md-preview>
<!--              <template v-for="(item2, index2) in item.messages" >-->
<!--                <span  v-if="item2.content" class="recall-text-item"  :key="index2">{{item2.showContent}}</span>-->
<!--              </template>-->
            </div>
          </div>
<!--          <div v-if="item.references.length > 0" class="book-list">-->
<!--            <div class="tip">-->
<!--              参考资料-->
<!--              <span @click="item.showReferences = !item.showReferences">收起/展开</span>-->
<!--            </div>-->
<!--            <div v-show="item.showReferences" class="book-list-item" v-for="(item2, index2) in item.references"-->
<!--                 :key="index2">-->
<!--              <div class="book-title">{{ item2.doc_name }}</div>-->
<!--              <div class="book-text">-->
<!--                {{ item2.chunk_text }}-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
          <div class="res-base-info">
<!--            <div class="time">{{ item.time }}</div>-->
            <div class="copy" @click="copyText(item.content)">
              <i class="el-icon-copy-document"></i> 复制
            </div>
            <div class="delete" @click="deleteOne(index)">
              <i class="refresh el-icon-delete"></i>删除
            </div>
          </div>
        </div>
      </div>
      <div v-show="loading" class="loading" v-loading="loading"  element-loading-background="rgba(0, 0, 0, 0.8)"></div>
    </div>
    <!--  提问框-->
    <div class="input-section">
      <div class="input-box">
        <div class="clear-box">
          <div class="clear" @click="current_input = ''"><img src="./img/clear.png" alt="" >清空</div>
<!--          <div @click="importReport" class="clear"><img src="./img/book.png" alt="" >引用灾情快报</div>-->
          <el-tag v-if="importItem && importItem.id" size="small" closable @close="importItem = null" >{{importItem.title}}</el-tag>
        </div>
        <div class="voice-input">
<!--          <img src="./img/fi_mic.png" alt="">-->
          <voice-com :upload-method="voiceMethod" @voiceData="setVoiceData"/>
          <el-input v-model.trim="current_input"   placeholder="请输入内容"  v-on:keyup.enter.native="() => uploadQuery()"></el-input>
        </div>

        <div class="submit-btn" @click="() => uploadQuery()"></div>
      </div>

    </div>
<!--    <import-report ref="importReport" @importData="importData"></import-report>-->
  </div>
</template>
<script>
import {fetchEventSource} from "@microsoft/fetch-event-source";

import EmptyText from "./EmptyText.vue";
import moment from 'moment';
import { getHistoryList, upVoice } from '@/api/questionAnswering'
// import importReport from './importReport.vue'
// import {chatBot} from "@/api/missionPlan";
export default {
  name: "index",
  props: {
    activeId: { // 会话id
      type: Number
    }
  },
  components: {
    // importReport,
    EmptyText
  },
  data() {
    return {
      container: null,
      loading: false,
      isConnect: false,
      getListLoading: false,
      notUseGetHistory: false,
      resIndex: 0, // 返回项
      activeIndex: 0,
      btnList: ['RAG对话', '多功能对话'],
      dialog_type: '', // general： 通用对话 rag：让对话
      current_input: '', // 提问
      history: [],
      chatList: [
        // {
        //   type: 'question',
        //   content: '航天行业有哪些比较热门的专利?',
        //   time: '2024-7-2 17:26:54',
        // },
        // {
        //   type: 'res',
        //   content: '航天行业最近比较热门的专利获得了中国专利金奖获得了中国专利金奖获得了中国专利金奖获得了中国专利金奖获得了中国专利金奖获得了中国专利金奖获得了中国专利金奖包括"特种超五类电缆结构“、',
        //   messages: [],
        //   time: '2024-7-2 17:26:54',
        //   showReferences: true,
        //   references: [
        //     {
        //       chunk_text: '航天行业最近比较热门的专利获得了中国专利金奖获得了中国专利金奖获得了中国专利金奖获得了中国专利金奖获得了中国专利金奖获得了中国专利金奖获得了中国专利金奖包括。',
        //       doc_name: 'CN00513234234234.txt',
        //     },
        //     {
        //       chunk_text: '航天行业最近比较热门的专利获得了中国专利金奖获得了中国专利金奖获得了中国专利金奖获得了中国专利金奖获得了中国专利金奖获得了中国专利金奖获得了中国专利金奖包括',
        //       doc_name: 'CN00513234234234.txt',
        //     }
        //   ]
        // },
      ],
      voiceMethod: upVoice,
      importItem: null,
    }
  },
  mounted() {
    this.container = this.$refs.container;
    const voice = this.$refs.voice;
  },
  destroyed() {
  },
  watch: {
    activeId(val,oval) {
      // console.log('activeId',val,oval);
      if (val !== oval && oval) {
        // 新会话
        this.chatList = [];
      }
      if (val && !this.notUseGetHistory) {
        this.getHistoryListData();
      }
      this.notUseGetHistory = false;
    }
  },
  methods: {
    importData(row) {
      this.importItem = row;
    },
    // // 打开引用弹框
    // importReport() {
    //   this.$refs.importReport.init();
    // },
    //  语音识别后返回内容设置
    setVoiceData(value) {
      this.current_input = value;
    },
    getHistoryListData() {
      this.getListLoading = true;
      const data = {
        id: this.activeId,
        pageSize: 10,
        pageNum: 1,
      }
      getHistoryList(data).then(res => {
        const listData = [];
        res.data.rows.forEach(i => {
          listData.push( {
            type: 'question',
            content:  i.question,
            // history: [],
            time: i.createTime,
          });
          listData.push( {
              type: 'res',
              content: i.answer,
            });
        })
        this.chatList = listData;
        this.getListLoading = false;
      })
    },
    //  切换对话类型
    changeActive(index) {
      if (this.activeIndex === index) {
        return
      }
      this.activeIndex = index;
      this.dialog_type = '';
      // this.dialog_type = index ? 'general' : 'rag';
      this.chatList = [];
      this.history = [];
    },
    //  复制文本
    copyText(val) {
      if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard 向剪贴板写文本
        this.$message.success('复制成功')
        return navigator.clipboard.writeText(val)
      } else {
        // 创建text area
        const textArea = document.createElement('textarea')
        textArea.value = val
        // 使text area不在viewport，同时设置不可见
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        this.$message.success('复制成功')
        return new Promise((res, rej) => {
          // 执行复制命令并移除文本框
          document.execCommand('copy') ? res() : rej()
          textArea.remove()
        })
        // this.$message.success('复制成功！');
      }
      // await navigator.clipboard.writeText(text);

    },
    // 删除一个聊天项
    deleteOne(index) {
      this.chatList.splice(index, 1);
      // this.that.resIndex
    },
    // 重新提问
    refresh(item) {
      this.uploadQuery(item.content);
    },
    // 提问
    async uploadQuery(query) {
      if (this.isConnect) {
        this.$message.warning('正在回答问题中，请上一问题结束后再提问！');
        return
      }
      // console.log('uploadQuery');
      // console.log(query, this.current_input)
      if (this.current_input === '' && !query) {
        return this.$message.warning('请输入搜索内容');
      }
      this.loading = true;
      this.isConnect = true;
      // const history = this.history;
      const data = {
        query: (query ? query : this.current_input),
        user: "abc-123",
        inputs: {},
        response_mode: "streaming", // 流式返回
        conversation_id: ""
        // dialog_type: this.dialog_type, // 对话类型
        // dialog_type: '', // 对话类型
        // history: history,
      }
      this.chatList.push( {
        type: 'question',
        content:  (query? query : this.current_input),
        // history: [],
        time: moment().format('yyyy-MM-DD HH:mm:ss'),
      })
      this.current_input ='';
      this.$nextTick(() => {
        this.scrollToBottom();
      })
      this.resIndex = this.chatList.length + 1; // 连接设置返回项序号
      this.connectSse(data);
      // await this.startStreaming(data);
      // await this.getSearchRes(data);
    },
    // 提问发起请求
    connectSse(data) {
      this.loading =true;
      const ctrl = new AbortController();
      const that = this;
      const obj = {
        id: this.activeId, // 会话id
        question: data.query, // 问题
        reportId: this.importItem? this.importItem.id : null, //灾情报告id
      }
      // chatBot(obj).then(res => {
      //   that.loading = false;
      //   that.chatList.push( {
      //     type: 'res',
      //     content: res.response_data,
      //     messages: [],
      //     resStr: '',
      //     time: '',
      //     showReferences: false,
      //     references: []
      //   })
      // }).catch(() => {
      //   that.loading = false;
      // })

      fetchEventSource(process.env.VUE_APP_BASE_API +'/assistant/conversation', {
        method: 'POST',
        openWhenHidden: true, // //页面退至后台保持连接
        // mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'Authorization': 'Bearer app-T8BrBSHytcyqcayrlqAT3mNk',
          'X-Client-OS': 'linux',  // 通知服务端适配
          'Cache-Control': 'no-store'
        },
        body: JSON.stringify(obj),
        signal: ctrl.signal,
        onopen() {
          // 成功连接时回调
          that.loading = false;
          if (that.chatList.length !== that.resIndex) { // 不是切换页面或者隐藏显示浏览器页面导致的请求
            that.chatList.push( {
              type: 'res',
              content: '',
              // messages: [],
              // resStr: '',
              // time: '',
              // showReferences: false,
              // references: []
            })
          }

        },
        async onmessage(msg) {
          // console.log('onmessage',msg);
          // 服务器返回消息回调 返回{ data,event,id,retry } ，data即服务器返回数据
          if (msg.event === '') {
            // 进行连接正常的操作流程
            let result = JSON.parse(msg.data);
            const currentObj = that.chatList[that.chatList.length -1]; // 当前聊天数组元素对象
            //  返回时间和相关文档
            if ( result.time) {
              currentObj.time = result.time;
              that.scrollToBottom();
            }
            if ( result.id) {
              that.notUseGetHistory = true;
              that.$emit('setMeetId', result.id)
            }
            // 将需要展示的数据更新到vue的data中,当然如下this.showData肯定赋值不上，需要将this 指向一个变量，用变量接受数据即可，以下只是展示
            // const index = that.chatList[that.chatList.length -1].messages.length; // 将元素长度作为当前id；
            // currentObj.messages.push({...result, showContent: '', id: index});
            // currentObj.messages.connect();
            if (result.text !== undefined) { // 流式展示文字
              currentObj.content = currentObj.content.concat(result.text); // 返回内容连接
              that.scrollToBottom();
              // that.showResStr(result.content, index);
            }
          }
          if (msg.event === 'close') {
            ctrl.abort()
          }
        },

        onclose() {
          that.isConnect = false;
          // that['home/SET_QUESTION_RES'](that.messages);
        },
        onerror(err) {
          that.isConnect = false;
          throw new err(err)
        }
      })
    },
    showResStr(resStr, index) {
      const showObj = this.chatList[this.chatList.length -1]; // 对话最后一个元素
      if (showObj.messages[index].showContent.length >= resStr.length) {
        return
      }
      setTimeout(() => {
        showObj.messages[index].showContent += resStr.charAt(showObj.messages[index].showContent.length);
        this.showResStr(resStr, index);
      },50)
    },
    // 滚动到底部
    scrollToBottom() {
      this.container.scrollTo(0,this.container.scrollHeight);
    }
  },
}
</script>


<style scoped lang="scss">
.el-button-group {
  .el-button {
    background: #F5F6F7;
    border: none;
  }

  .el-button--primary {
    background-color: #409EFF;
  }
}

.assistant {
  width: calc(100% - 330px);
  color: black;
  //margin-top: 48px;
  //height: 100%;
  height: calc(100vh - 160px);
  //width: 1200px;
  padding: 20px 42px 20px 9px;
  //border-radius: 12px;
  //background: #FFF;
}

.chat-list {
  height: calc(100% - 192px);
  border-radius: 4px;
  border: 1px solid #409EFF;
  overflow-y: auto;
  overflow-x: hidden;
  //will-change: scroll-position;
  //margin-top: 38px;
  margin-bottom: 29px;
  padding: 30px 36px 96px 46px;
  ///*  */
  .loading {
    height: 100px;
  }
  .chat-list-item {
    // 提问
    .question-item {
      display: flex;
      align-items: center;
      margin-bottom: 32px;

      .header-img {
        height: 73px;
        width: 73px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 14px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .question-info {
        .question-text {
          font-family: "PingFang SC";
          font-size: 18px;
          font-style: normal;
          font-weight: 400;
          line-height: 22px; /* 122.222% */
          margin-bottom: 6px;
        }

        .question-base-info {
          display: flex;
          align-items: center;
          font-size: 16px;
          line-height: 22px;

          i {
            font-size: 18px;
          }

          .time {
            margin-right: 21px;
          }

          .copy {
            margin-right: 16px;
            cursor: pointer;
          }

          .refresh {
            cursor: pointer;
          }
        }
      }
    }

    //   回答
    .res-item {
      padding: 42px 43px 39px ;
      margin-bottom: 30px;
      border-radius: 4px;
      border: 1px solid #409EFF;

      .res-top {
        display: flex;
        //border-bottom: 1px solid #DDDCE9;
        padding-bottom: 15px;

        .header-img {
          height: 58px;
          width: 58px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 24px;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .res-text {
          //white-space: pre-wrap;
          width: 949px;
          font-family: "PingFang SC";
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: 26px; /* 162.5% */
          ::v-deep .github-markdown-body {
            padding: 0;
          }
        }
      }

      .book-list {
        border-top: 1px solid #DDDCE9;
        padding-top: 29px;
        margin-bottom: 17px;

        .tip {
          font-size: 14px;

          span {
            margin-left: 8px;
            color: #0A9FFD;
            cursor: pointer;
          }
        }

        .book-list-item {
          &:nth-child(n + 3) {
            margin-top: 30px;
          }

          .book-title {
            margin-top: 8px;
            margin-bottom: 9px;
            color: #0A9FFD;
            font-size: 18px;
            line-height: 22px; /* 122.222% */
          }

          .book-text {
            color: #7D7D7D;
            font-size: 16px;
            line-height: 26px; /* 162.5% */
          }
        }
      }

      .res-base-info {
        //margin-top: 17px;
        display: flex;
        align-items: center;
        font-size: 16px;
        line-height: 22px;
        color: #fff;

        i {
          font-size: 18px;
        }

        .time {
          margin-right: 21px;
          width: 158px;
        }

        .copy {
          margin-right: 16px;
          cursor: pointer;
        }

        .delete {
          i {
            margin-right: 4px;
          }

          cursor: pointer;
        }
      }

    }

  }
}
/* 自定义滚动条整体样式 */
.chat-list::-webkit-scrollbar {
  width: 6px; /* 滚动条宽度 */
}

/* 定义滚动条轨道 */
.chat-list::-webkit-scrollbar-track {
  //background: #f1f1f1; /* 轨道背景颜色 */
}

/* 定义滑块手柄 */
.chat-list::-webkit-scrollbar-thumb {
  //background: #888; /* 滑块颜色 */
}

/* 滑块手柄hover状态 */
.chat-list::-webkit-scrollbar-thumb:hover {
  //background: #555; /* hover时滑块颜色 */
}
.input-section {
  overflow: hidden;

  .input-box {
    position: relative;
    //height: 136px;
    padding: 20px 24px;
    border-radius: 9px;
    border: 1px solid #409EFF;
    .top-able {

    }
    .clear-box {
      padding-bottom: 15px;
      border-bottom: 1px solid rgba(64, 158, 255, 0.10);
      display: flex;
    }
    .clear {
      margin-right: 12px;
      cursor: pointer;
      //width: 67px;
      height: 25px;
      padding: 0 11px;
      line-height: 25px;
      text-align: center;
      border-radius: 12.5px;
      background: #19426F;
      font-size: 14px;
      img {
        margin-right: 4px;
        vertical-align: middle;
      }
    }
    .voice-input {
      display: flex;
      i {
        cursor: pointer;
        margin-top: 15px;
        font-size: 24px;
      }
      img{
        cursor: pointer;
        margin-top: 15px;
        width: 24px;
        height: 24px;
      }
    }
    .el-input {
      height: 98px;
      ::v-deep input {
        margin-top: 12px;
        border: none;
        font-size: 18px;
      }

      ::v-deep.el-input__inner {
        //height: 90px;
        padding: 0;
        background: none;
        border-radius: 0
      }
    }
    .submit-btn {
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-radius: 15px;
      position: absolute;
      right: 20px;
      bottom: 20px;
      background: url("./img/submit_btn.png") left top no-repeat;
      background-size: 100% 100%;
    }
  }

  .el-button {
    margin-top: 20px;
    float: right;
    width: 120px;

  }
}
</style>
