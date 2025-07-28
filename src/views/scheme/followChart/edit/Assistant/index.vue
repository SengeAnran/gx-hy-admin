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
      ref="container"
    >
<!--      <EmptyText text="您好！我是智能修井助手，请问有什么可以帮您？" v-if="chatList.length === 0"/>-->
      <div class="chat-list-item" v-for="(item,index) in chatList" :key="index">
        <!--       问  -->
        <div class="question-item" v-if="item.type === 'question'">
          <div class="question-info">
<!--            <div class="copy" @click="copyText(item.content)">-->
<!--              <i class="el-icon-copy-document"></i> 复制-->
<!--            </div>-->
            <div class="question-text">{{ item.content }}</div>
<!--            <div class="question-base-info">-->
<!--              <div class="copy" @click="copyText(item.content)">-->
<!--                <i class="el-icon-copy-document"></i> 复制-->
<!--              </div>-->
<!--&lt;!&ndash;              <i class="refresh el-icon-refresh-right" @click="refresh(item)"></i>&ndash;&gt;-->
<!--            </div>-->
          </div>
        </div>
        <!--        答-->
        <div class="res-item" v-if="item.type === 'res'">
          <div class="res-top">
            <div class="header-img">
<!--              <img src="./img/logo.jpg" alt="">-->
              <img src="./img/res_header_01.png" alt="">
            </div>
            <div class="res-text">
              <v-md-preview :text="item.content"></v-md-preview>
<!--              <template v-for="(item2, index2) in item.messages" >-->
<!--                <span  v-if="item2.content" class="recall-text-item"  :key="index2">{{item2.showContent}}</span>-->
<!--              </template>-->
              <div class="res-base-info">
<!--                <div class="time">{{ item.time }}</div>-->
                <div class="copy" @click="copyText(item.content)">
                  <i class="el-icon-copy-document" ></i> 复制
                </div>
<!--                <div class="delete" @click="deleteOne(item,index)">-->
<!--                  <i class="refresh el-icon-delete"></i>删除-->
<!--                </div>-->
              </div>
            </div>
          </div>

        </div>
      </div>
      <div v-show="loading" class="loading" v-loading="loading"  ></div>
    </div>
    <!--  提问框-->
    <div class="input-section">

      <div class="input-box">
        <div class="clear-box">
          <div class="clear" @click="current_input = ''">
<!--            <img src="./img/clear.png" alt="" >-->
            清空
          </div>
          <upload-file v-model="fileListData" />
          <file-list :list-data="fileListData" @removeOne="removeOne"/>
        </div>
        <div class="voice-input">
          <el-input
            v-model.trim="current_input"
            type="textarea"
            rows="5"
            resize="none"
            placeholder="请输入内容，shift+enter换行"
            v-on:keydown.enter.native.prevent="handleEnter"></el-input>
          <div class="bottom-btns">
            <div class="submit-btn" @click="() => uploadQuery()"></div>

          </div>
        </div>


      </div>

    </div>
  </div>
</template>
<script>
import {fetchEventSource} from "@microsoft/fetch-event-source";

import EmptyText from "./EmptyText.vue";
import moment from 'moment';
import { getHistoryList} from '@/api/followchart'
import UploadFile from "@/views/questionAnswering/components/Assistant/uploadFile.vue";
import FileList from "@/views/questionAnswering/components/Assistant/fileList.vue";
import {getToken} from "@/utils/auth";
// import {chatBot} from "@/api/missionPlan";
export default {
  name: "index",
  components: {
    FileList,
    UploadFile,
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
      fileListData: [],
      history: [],
      chatList: [
        {
          type: 'res',
          content: '您好！我是您的方案编辑助手。您可以通过对话的方式告诉我您想要如何修改方案，我会帮您实现。',
          time: moment().format('yyyy-MM-DD HH:mm:ss'),
          id: undefined,
          // showReferences: false,
          // references: []
        }
      ],
      importItem: null,
      modelOption: [],
      currentModel: '',
      planId: undefined,
    }
  },
  mounted() {
    this.container = this.$refs.container;
    const voice = this.$refs.voice;
    this.planId = this.$route.query.id;
    this.getHistoryListData();
  },
  destroyed() {
  },
  methods: {
    removeOne(item) {
      const index = this.fileListData.findIndex(i => i.url === item.url);
      if (index !== -1) {
        this.fileListData.splice(index, 1);
      }
    },
    importData(row) {
      this.importItem = row;
    },
    //  语音识别后返回内容设置
    setVoiceData(value) {
      this.current_input = value;
    },
    getHistoryListData() {
      this.getListLoading = true;
      const data = {
        planId: this.planId,
        // pageSize: 10,
        // pageNum: 1,
      }
      getHistoryList(data).then(res => {
        const listData = [];
        res.rows.forEach(i => {
          listData.push( {
            type: 'question',
            content:  i.question,
            // history: [],
            time: i.createTime,
          });
          listData.push( {
              type: 'res',
              id: i.id,
              content: i.answer,
              time: i.createTime,
            });
        })
        this.chatList.push(...listData);
        this.setNewId();
        this.getListLoading = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        })
      }).catch(() => {
        this.getListLoading = false;
      })
    },
    //  设置最新版本id
    setNewId(){
      const length = this.chatList.length;
      if (this.chatList[length-1].type === 'res' &&  this.chatList[length-1].id ) {
        this.$emit('changeNowPlanId', this.chatList[length-1].id)
      }
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
    deleteOne(item, index) {
      if (item.id) {
        const data = {
          id: item.id,
        }
        deleteRecord(data).then(() => {
          this.chatList.splice(index, 1);
        })
      }
      // this.that.resIndex
    },
    // 重新提问
    refresh(item) {
      this.uploadQuery(item.content);
    },
    handleEnter(e) {
      if (!e.shiftKey) {
        // 如果按的是纯 Enter，可以在这里处理提交逻辑
        this.uploadQuery();
      } else {
        // Shift + Enter 换行（默认行为，无需额外处理）
        // 或者手动插入换行符
        this.current_input += "\n";
      }
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
      if (this.fileListData.length > 0) {
        this.chatList.push( {
          type: 'question',
          content:  '已上传文件：' + this.fileListData.map(i => i.name).join(','),
          fileList: this.fileListData.map(i => i.name),
          // history: [],
          time: moment().format('yyyy-MM-DD HH:mm:ss'),
        })
      }
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
        planId: this.planId, // 会话id
        question: data.query, // 问题
        filePaths: this.fileListData.map(i => i.url), // 文件
        // reportId: this.importItem? this.importItem.id : null, //灾情报告id
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

      fetchEventSource(process.env.VUE_APP_BASE_API +'/flow/conversation', {
        method: 'POST',
        openWhenHidden: true, // //页面退至后台保持连接
        // mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          // 'Authorization': 'Bearer app-T8BrBSHytcyqcayrlqAT3mNk',
          'X-Client-OS': 'linux',  // 通知服务端适配
          'Cache-Control': 'no-store',
          'authorization': 'Bearer ' + getToken(),
        },
        body: JSON.stringify(obj),
        signal: ctrl.signal,
        onopen() {
          // 成功连接时回调
          that.loading = false;
          that.fileListData = [];
          if (that.chatList.length !== that.resIndex) { // 不是切换页面或者隐藏显示浏览器页面导致的请求
            that.chatList.push( {
              type: 'res',
              content: '',
              // messages: [],
              // resStr: '',
              // time: moment().format('yyyy-MM-DD HH:mm:ss'),
              time: '',
              id: undefined,
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
            console.log('result', result);
            const currentObj = that.chatList[that.chatList.length -1]; // 当前聊天数组元素对象
            //  返回时间和相关文档
            if ( result.time) {
              currentObj.time = result.time;
              that.scrollToBottom();
            }
            if ( result.id) {
              that.notUseGetHistory = true;
              currentObj.id = result.id;

              // that.$emit('setMeetId', result.id)
            }
            // 将需要展示的数据更新到vue的data中,当然如下this.showData肯定赋值不上，需要将this 指向一个变量，用变量接受数据即可，以下只是展示
            // const index = that.chatList[that.chatList.length -1].messages.length; // 将元素长度作为当前id；
            // currentObj.messages.push({...result, showContent: '', id: index});
            // currentObj.messages.connect();
            if (result.text !== undefined) { // 流式展示文字
            // if (result !== undefined) { // 流式展示文字
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
          that.setNewId();
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
  flex: 1;
  color: #000;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-width: 0;
}

.chat-list {
  //height: calc(100% - 192px);
  //border-radius: 4px;
  //border: 1px solid #409EFF;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  //margin-bottom: 29px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  //padding: 30px 36px 96px 46px;
  ///*  */
  .loading {
    height: 100px;
  }
  .chat-list-item {
    // 提问
    .question-item {
      display: flex;
      justify-content: right;
      align-items: center;
      margin-bottom: 32px;
      //margin-right: 20px;

      .header-img {
        height: 41px;
        width: 41px;
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
        display: flex;

        .copy {
          color: #000;
          margin-top: 12px;
          margin-right: 8px;
          cursor: pointer;
        }
        .question-text {
          max-width: 400px;
          padding: 12px 23px;
          border-radius: 12px;
          background: #0061A7;
          color: #FFF;
          font-family: "PingFang SC";
          font-size: 18px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          //height: 45px;

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
      //padding: 42px 43px 39px ;
      margin-bottom: 30px;
      border-radius: 4px;
      //border: 1px solid #409EFF;

      .res-top {
        display: flex;
        //border-bottom: 1px solid #DDDCE9;
        padding-bottom: 15px;

        .header-img {
          //flex-shrink: ;
          flex-grow: 0;
          flex-shrink: 0;
          height: 58px;
          width: 58px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 16px;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .res-text {
          //white-space: pre-wrap;
          flex: 1;
          //width: 949px;
          font-family: "PingFang SC";
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: 26px; /* 162.5% */
          .v-md-editor-preview {
            background: #F1F9FF;
            color: #333;
            padding: 12px 16px 0;
            border-radius: 8px;
          }
          ::v-deep .github-markdown-body {
            padding: 0;
            p {
              margin-bottom: 12px;
            }
            code {
              white-space: pre-wrap;
            }
          }
          .res-base-info {
            //margin-top: 17px;
            margin-top: 10px;
            display: flex;
            align-items: center;
            font-size: 16px;
            line-height: 22px;
            //color: #fff;

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
              color: #0061A7;
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



    }

  }
}
/* 自定义滚动条整体样式 */
.chat-list::-webkit-scrollbar {
  //width: 6px; /* 滚动条宽度 */
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
  position: relative;
  //border-top: 1px solid #eee;
  .input-box {
    position: relative;
    //height: 136px;
    padding: 20px 24px;
    border-radius: 9px;
    //border: 1px solid #579DFF;
    .top-able {

    }
    .clear-box {
      padding-bottom: 15px;
      //border-bottom: 1px solid rgba(64, 158, 255, 0.10);
      display: flex;
    }
    .clear {
      margin-right: 9px;
      cursor: pointer;
      //width: 67px;
      height: 25px;
      padding: 0 11px;
      line-height: 25px;
      text-align: center;
      border-radius: 12.5px;
      //background:  linear-gradient(180deg, #579DFF 0%, #A27AFF 100%);
      background:  #F5F7FA;
      font-size: 14px;
      color: #1F2329;
      img {
        width: 13.506px;
        height: 14px;
        margin-right: 4px;
        //vertical-align: middle;
      }
    }
    .voice-input {
      //display: flex;
      //align-items: center;
      position: relative;
      height: 190px;
      border-radius: 12px;
      border: 1px solid #0061A7;
      overflow: hidden;
      background: #FFF;
      padding: 15px 10px;
      .el-textarea {
        //margin-right: 8px;
        ::v-deep .el-textarea__inner {
          border: 0;
          resize: none; // 去除右下角图标
        }
      }
      .bottom-btns {
        //display: flex;
        position: absolute;
        right: 14px;
        bottom: 14px;
      }
      .submit-btn {
        cursor: pointer;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        background: url("./img/submit_btn.png") left top no-repeat;
        background-size: 100% 100%;
        margin-right: 6px;
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

  }

  .el-button {
    margin-top: 20px;
    float: right;
    width: 120px;
  }
}
</style>
