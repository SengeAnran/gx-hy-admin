<template>
  <div class="edit-page">
    <div class="left-content">
      <div class="edit-header">
        <div class="edit-title">编辑{{ typeName }}</div>
        <div class="header-btns">
          <el-button  type="primary" @click="clickSave">保存</el-button>
<!--          <el-button @click="setFix" type="info">设置对错</el-button>-->
        </div>
      </div>
      <quill-editor
        ref="quillEditor"
        class="quill-editor"
        v-model="content"
        watch-selection-change
      ></quill-editor>
      <!--      <editor class="quill-editor"  v-model="content"></editor>-->
    </div>
    <assistant class="right-content" @toGetContent="setContent">
    </assistant>
  </div>

</template>

<script>
// import Turndown from 'turndown'
import TurndownService from 'turndown'
import { gfm } from '@guyplusplus/turndown-plugin-gfm'

// const TurndownService = require('turndown')
import assistant from './Assistant'

// import ImageResize from 'quill-image-resize-module'
// import { ImageDrop } from 'quill-image-drop-module'
//
// Quill.register("modules/imageResize", ImageResize)
// Quill.register("modules/imageDrop", ImageDrop)
// const marked = require('marked');
import {marked} from "marked";
import {getPlanById, saveOne} from "@/api/schemeList";
import {mapGetters} from "vuex";
import {QuillDeltaToHtmlConverter} from 'quill-delta-to-html';

export default {
  components: {
    assistant
  },
  data() {
    return {
      id: undefined,
      quillEditor: null,
      quill: null,
      typeName: '方案',
      content: "Hello quill",
      itemList: [],
      textList: [
        {
          id: 1,
          originContent: ` <p>原文内容1</p>`,
          newContent: `
          <p>新的内容1</p>
                <ul>
                  <li>1</li>
                  <li>2</li>
                  <li>3</li>
                </ul>
          `,
        },
      ]
    }
  },
  mounted() {
    this.init();

  },
  computed: {
    ...mapGetters(['fixContent', 'rangeContent']),
  },
  watch: {
    fixContent(newV, oldV) {
      if (newV && newV !== oldV && this.rangeContent.index) {
        this.insertSelectContent(newV);
        this.$nextTick(() => {
           this.setFix();
         })
      }
    }
  },
  methods: {
    /**
     * 初始化数据
     */
    init() {
      this.quillEditor = this.$refs.quillEditor;
      const {id, type} = this.$route.query;
      this.id = id;
      switch (type) {
        case 'scheme':
          this.typeName = '方案';
          break;
        case 'instruction':
          this.typeName = '指令';
          break;
        case 'mbom':
          this.typeName = '物料清单';
          break;
        default:
          break;
      }
      this.setContent();
      this.$nextTick(() =>{
        if (!this.quill) {
          this.quill = this.quillEditor.getQuill();
        }
      })
    },
    /**
     *  设置富文本文本内容
     */
    setContent() {
      getPlanById(this.id).then(res => {
        if (res.data.content) {
          let htmlStr =  marked(res.data.content);
          htmlStr = ((htmlStr.replace(/<\/?thead>/gi, ''))
            .replace(/<\/?tbody>/gi, ''))
            .replace(/<th>/gi, '<td>').replace(/<\/th>/gi, '<\/td>');
          this.content = htmlStr;
        }
      })
    },

    /**
     *  获取原文和建议修改新文的html
     * @param oldHtml
     * @param newHtml
     * @returns {string}
     */
    getSelectHtml(oldHtml, newHtml) {
      return `
      <div class="embed-innerApp">
            <div class="origin-content">${oldHtml}</div>
            <div class="new-content">${newHtml}</div>
            <button class="confirm">确认</button>
            <button class="cancel">取消</button>
        </div>
        <br/>
      `
    },
    // 保存
    clickSave() {
      const turndownService = new TurndownService({
        hr: '---',
        headingStyle: 'atx',
        bulletListMarker: '-',
        codeBlockStyle: 'fenced'
      })

// 使用增强版GFM插件
      turndownService.use(gfm)

// 自定义表格处理规则
      turndownService.addRule('complexTables', {
        filter: ['table'],
        replacement: function(content, node) {
          const rows = node.querySelectorAll('tr')
          let output = '\n\n'

          // 处理表头
          const headers = rows[0].querySelectorAll('th, td')
          output += '| ' + Array.from(headers)
            .map(h => h.textContent.trim())
            .join(' | ') + ' |\n'

          // 添加分隔线
          output += '|' + Array.from(headers)
            .map(() => '---')
            .join('|') + '|\n'

          // 处理表格内容
          for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].querySelectorAll('td')
            output += '| ' + Array.from(cells)
              .map(cell => {
                // 处理rowspan/colspan
                const rowspan = cell.getAttribute('rowspan') || 1
                const colspan = cell.getAttribute('colspan') || 1
                let content = cell.textContent.trim()

                if (colspan > 1) content += ` (colspan=${colspan})`
                if (rowspan > 1) content += ` (rowspan=${rowspan})`

                return content
              })
              .join(' | ') + ' |\n'
          }

          return output + '\n'
        }
      })

      const markdown = turndownService.turndown(this.content);
      const data = {
        id: this.$route.query.id,
        content: markdown,
      }
      saveOne(data).then(() => {
        this.$message.success('保存成功！');
      })
    },
  //  获取最新对错列表
    setFix() {
      const listData = [...this.quillEditor.$el.querySelectorAll('.embed-innerApp')];
      this.itemList = listData.map((i, index)=> {
        const originContent = i.querySelector('.origin-content');
        const newContent = i.querySelector('.new-content');
        const confirmBtn = i.querySelector('.confirm');
        const cancelBtn = i.querySelector('.cancel');
        const confirmBtnListener = confirmBtn.addEventListener('click', (e) => this.confirmClick(e, index) )
        const cancelBtnListener = cancelBtn.addEventListener('click', (e) => this.cancelClick(e, index))
        return {
          elementNode: i,
          originContent,
          newContent,
          confirmBtn: confirmBtn,
          cancelBtn: cancelBtn,
          confirmBtnListener,
          cancelBtnListener,
          select: false,
        }
      })
    },
    //  确认点击
    confirmClick(e, index) {
      const range = this.quill.getSelection();
      const content = this.itemList[index].newContent;
      this.itemList[index].select = true;
      this.quill.deleteText(range.index-1, 2, 'api');
      this.quill.clipboard.dangerouslyPasteHTML(range.index-1,content.innerHTML, 'api');
    },
    // 取消点击
    cancelClick(e, index) {
      const range = this.quill.getSelection();
      const content = this.itemList[index].originContent;
      this.itemList[index].select = true;
      console.log(range.index)
      // this.quill.insertEmbed(range.index, content)
      this.quill.deleteText(range.index-1, 2, 'api');
      this.quill.clipboard.dangerouslyPasteHTML(range.index-1,content.innerHTML, 'api');
    },

    insertSelectContent(content) {
      const {index, length, deltaText} = this.rangeContent;
      // 创建转换器实例
      const converter =  new QuillDeltaToHtmlConverter(deltaText.ops, {})
      // 转换为 HTML 字符串
      const oldContent = converter.convert();
      //  将md转换成为html
      const newContent = marked(content);

      if (length) {
        this.quill.deleteText(index, length+1, 'api');
        this.quill.insertEmbed(index, 'AppPanelEmbed', `
         <div class="origin-content">${oldContent}</div>
            <div class="new-content">${newContent}</div>
            <button class="confirm">确认</button>
            <button class="cancel">取消</button>
        `);
      }

    }
  }
}
</script>


<style scoped lang="scss">
.edit-page {
  background: rgb(245, 245, 245);
  height: calc(100vh - 57px);
  gap: 20px;
  display: flex;
  padding: 20px;

  .left-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    //flex: 2.8;
    max-width: 70%;
    min-width: 800px;
    //width: 1000px;
    gap: 20px;
    padding: 34px 0 0;
    border-radius: 12px;
    background: #FFF;
    overflow: hidden;
    .edit-header {
      padding: 0 34px 0 38px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      //margin-bottom: 20px;
      .edit-title {
        font-weight: bold;
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
      ::v-deep .ql-toolbar {
        border: none;
        border-radius: 4px;
        background: #F2F6FF;
        margin-left: 38px;
        margin-right: 34px;
      }
      ::v-deep .ql-container {
        height: calc(100% - 66px);
        border: none;
        .ql-editor {
          padding: 50px 34px 0 34px;
          .true {

          }
          .error {
            background: #ffcc00;
          }
        }
      }
    }
  }

  .right-content {
    flex: 1;
  }
}

</style>
<style>
.origin-content {
  padding: 12px;
  border-radius: 12px;
  background: #F5F7FA;
  margin-bottom: 15px;
}
.new-content {
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 12px;
  background: #F3FFF3;
}
.embed-innerApp button {
  cursor: pointer;
  width: 82px;
  height: 39.733px;
  border-radius: 6px;
  border: none;
  color: white;
  font-family: "PingFang SC";
  font-size: 16px;

}
.embed-innerApp .confirm {
  background: #0061A7;
  margin-right: 12px;
}
.embed-innerApp .cancel {
  background: #A5AEBC;
}
</style>
