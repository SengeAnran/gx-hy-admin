<template>
  <div class="container">
    <div class="box-content">
      <div class="meet">
<!--        <div class="new-meet" @click="startNewMeet">-->
<!--          <img src="./img/notification-message.png" alt="">开启新对话-->
<!--        </div>-->
        <div class="new-meet" @click="startNewMeet">
                    <img src="./img/notification-message.png" alt="">开启新对话
        </div>
        <div class="meet-list today">
          <div class="meet-list-box">
            <div class="meet-list-item"
                 v-for="(item, index) in todayMeetList"
                 :key="index"
                 :class="{active: activeId === item.id}"
                 @click="changeActive(item)"
            >
              <div class="text">
                {{item.title}}
              </div>
<!--              <div class="history-item-time">{{item.createTime}}</div>-->
<!--              <button class="delete-chat-btn" @click.stop="deleteOne(item)">×</button>-->
<!--              <div class="set" v-show="activeId === item.id">-->
              <div class="set" >
                ...
                <div class="delete" @click.stop="deleteOne(item)">
                  <img src="./img/delete-icon.png" alt="">
                  删除
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--          <div class="meet-list last-day">-->
        <!--            <div class="min-title">昨天</div>-->
        <!--            <div class="meet-list-box">-->
        <!--              <div-->
        <!--                class="meet-list-item"-->
        <!--                v-for="(item, index) in todayMeetList"-->
        <!--                :key="index"-->
        <!--                :class="{active: activeId === item.id}"-->
        <!--                @click="changeActive(item)"-->
        <!--              >-->
        <!--                <div class="text">-->
        <!--                  {{item.title}}-->
        <!--                </div>-->
        <!--                <div class="set" v-if="activeId === item.id">...-->
        <!--                  <div class="delete">-->
        <!--                    <img src="./img/delete-icon.png" alt="">-->
        <!--                    删除-->
        <!--                  </div>-->
        <!--                </div>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </div>-->
      </div>

      <Assistant
        :activeId="activeId"
        @setMeetId="setMeetId"
      >
      </Assistant>
    </div>
    <smart-assistant/>
  </div>
</template>
<script>
import Assistant from "./components/Assistant";
import { deleteMeet, getList } from '@/api/questionAnswering'
import SmartAssistant from "@/views/questionAnswering/components/smartAssistant.vue";

export default {
  name: "index",
  components: {SmartAssistant, Assistant },
  data() {
    return {
      activeIndex: 0,
      rightTextName: '图片处理记录',
      detailInfo: {
        state: 2,
      },
      todayMeetList: [],
      activeId: undefined,
    };
  },
  mounted() {
    this.getListData();
  },
  methods: {
    // 新增会话窗口
    setMeetId(id) {
      this.activeId = id;
      this.getListData();
    },
    // 改变当前会话
    changeActive(item) {
      this.activeId = item.id;
    },
    // 删除
    deleteOne(item) {
      this.$confirm('确认删除该项？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { ids: [item.id]};
        deleteMeet(data).then(() => {
          this.$message.success('删除成功！');
          this.activeId = undefined;
          this.getListData();
        }).catch(() => {
          this.$message.error('删除失败！');
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });

    },
    getListData() {
      getList().then(res => {
        this.todayMeetList = res.data;
      })
    },
    // 开始新会话
    startNewMeet() {
      this.activeId = undefined;
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  height: calc(100vh - 57px);
  background: #f5f5f5;
  //padding: 36px;
  //min-height: 100%;
}
.box-content {
  display: flex;
  //background: white;
  height: 100%;
  gap: 20px;
  .meet {
    //width: 330px;
    //height: calc(100vh - 120px);
    //overflow-y: auto;
    //padding-top: 20px;
    //padding-left: 24px;
    //background: white;
    //border-radius: 8px;
    //box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
    width: 255px;
    background: white;
    //border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex-shrink: 0;
    padding: 56px 0;
    .new-meet {
      cursor: pointer;
      border-radius: 8px;
      margin: 0 24px 0 33px;
      //height: 45px;
      padding: 11px 0;
      text-align: center;
      background: #0061A7;
      //background: var(--5, linear-gradient(180deg, #579DFF 0%, #A27AFF 100%));
      color: #FFF;
      font-family: "PingFang SC";
      font-size: 16px;
      line-height: 22px; /* 137.5% */
      img {
        width: 24px;
        height: 24px;
        vertical-align: middle;
      }
    }
    .today {
      margin-top: 30px;
    }
    .last-day {
      margin-top: 64px;
    }
    .meet-list {
      color: #16262C;
      font-family: "PingFang SC";
      .min-title {
        font-size: 16px;
        margin-bottom: 13px;
      }
      .meet-list-box {
        //padding-right: 9px;
        padding: 0 24px 0 33px;
        height: calc(100vh - 250px);
        //700
        //min-height: 160px;
        //max-height: 260px;
        overflow-y: hidden;
        &:hover {
          overflow-y: auto;
        }
        .meet-list-item {
          position: relative;
          border-radius: 6px;
          padding: 12px 16px;
          //padding: 16px 0;
          //padding: 7px 0;
          //border-radius: 8px;
          margin-bottom: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
          //border: 1px solid #eee;
          .text {
            font-weight: bold;
            margin-bottom: 4px;
            color: #333;
            padding-right: 30px;
          }
          .history-item-time {
            font-size: 12px;
            color: #999;
          }
          .delete-chat-btn {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: none;
            background-color: #ffebee;
            color: #c62828;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            opacity: 0;
            transition: opacity 0.3s, background-color 0.3s;
          }
          &:hover {

            color: #0061A7;

            font-family: "PingFang SC";
            font-size: 16px;
            background: #E2F3FF;
          }
          &:hover .delete-chat-btn {
            //display: inline-block !important;
            opacity: 1;
          }
          .set {
            position: absolute;
            height: 100%;
            line-height: 37px;
            width: 40px;
            text-align: center;
            right: 0;
            top: 0;
            font-weight: bold;
          }
          .delete {
            z-index: 1;
            display: none;
            position: absolute;
            top: 55%;
            left: -22px;
            width: 63px;
            padding: 0 7px;
            height: 37px;
            line-height: 37px;
            flex-shrink: 0;
            border-radius: 5px;
            background: #FFF;
            color: #FF4747;
            font-size: 14px;
            box-shadow: 0 0 5px #f0f0f0;
            img {
              vertical-align: middle;
            }

          }
          .set:hover .delete {
            display: inline-block;
          }
          .text {
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          &.active {
            background-color: #e3f2fd;

            border-color: #1e88e5;
            .text {
              color: #0061A7;
            }
            .set {
              color: #0061A7;
            }
          }

        }

      }
    }
  }
}
</style>
