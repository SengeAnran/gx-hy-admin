<template>
  <keep-alive>
    <div>
      <el-upload
        :action="uploadUrl"
        :before-upload="handleBeforeUpload"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        name="file"
        :show-file-list="false"
        :headers="headers"
        style="display: none"
        ref="upload"
        v-if="this.type == 'url'"
      >
      </el-upload>
      <div class="editor"></div>
    </div>
<!--    耍水-->
  </keep-alive>
</template>

<script>
import myBlot from "./myBlot";
// 引入核心样式和主题样式
import Quill from 'quill'
// import {Quill} from './myQuill'
import 'quill/dist/quill.snow.css'
import "quill-better-table/dist/quill-better-table.css";
// import { ImageExtend, QuillWatch } from 'quill-image-extend-module'
import QuillBetterTable from "quill-better-table";
import axios from "axios";
import {getToken} from "@/utils/auth";
// import {AppPanelEmbed} from "@/components/QuillEditor/myQuill";
// import { ImageDrop } from 'quill-image-drop-module'
import ImageResize from 'quill-image-resize-module'
import {mapGetters, mapMutations} from "vuex";

// Quill.register('modules/imageDrop', ImageDrop);
Quill.register('modules/imageResize', ImageResize);

Quill.register(
  {
    "modules/better-table": QuillBetterTable
  },
  true
);
myBlot(Quill);
const BlockEmbed = Quill.import('blots/block/embed');

// class AppPanelEmbed extends BlockEmbed {
//   static create(value) {
//     console.log('create',value);
//     const node = super.create(value);
//     node.setAttribute('contenteditable', 'false');
//     node.setAttribute('width', '100%');
//     node.setAttribute('style', 'display:none');
//     // node.setAttribute('style', 'background: red');
//     //   设置自定义html
//     node.innerHTML = this.transformValue(value)
//     return node;
//   }
//
//   static transformValue(value) {
//     // let handleArr = value.split('\n')
//     // handleArr = handleArr.map(e => e.replace(/^[\s]+/, '')
//     //   .replace(/[\s]+$/, ''))
//     return value
//   }
//
//   // 返回节点自身的value值 用于撤销操作
//   static value(node) {
//     return node.innerHTML
//   }
// }
// // blotName
// AppPanelEmbed.blotName = 'AppPanelEmbed';
// // class名将用于匹配blot名称
// AppPanelEmbed.className = 'embed-innerApp';
// // 标签类型自定义
// AppPanelEmbed.tagName = 'span';
// Quill.register(AppPanelEmbed, true);

//  按钮提示中文
const titleConfig = {
  'ql-bold': '加粗',
  'ql-color': '颜色',
  'ql-font': '字体',
  'ql-code': '插入代码',
  'ql-italic': '斜体',
  'ql-link': '添加链接',
  'ql-background': '颜色',
  'ql-size': '字体大小',
  'ql-strike': '删除线',
  'ql-script': '上标/下标',
  'ql-underline': '下划线',
  'ql-blockquote': '引用',
  'ql-header': '标题',
  'ql-indent': '缩进',
  'ql-list': '列表',
  'ql-align': '文本对齐',
  'ql-direction': '文本方向',
  'ql-code-block': '代码块',
  'ql-formula': '公式',
  'ql-image': '图片',
  'ql-video': '视频',
  'ql-clean': '清除字体样式',
  'ql-upload': '文件',
  'ql-table': '插入表格',

  'ql-table-insert-row': '插入行',
  'ql-table-insert-column': '插入列',
  'ql-table-delete-row': '删除行',
  'ql-table-delete-column': '删除列',
  'ql-table-merge-cells': '合并单元格',
  'ql-table-unmerge-cells': '拆分单元格',
  'ql-table-delete': '删除表格',
}
//  字体
const fontList = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong'];
export default {
  name: 'EditorQuill',
  props: {
    /* 编辑器的内容 */
    value: String,
    /* 类型（base64格式、url格式） */
    type: {
      type: String,
      default: "url",
    },
    //  开启监听选中事件
    watchSelectionChange: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      uploadUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken()
      },
      quill: null,

      options: {
        theme: 'snow',

        modules: {
          // 需要引入模块的集合及它们各自的选项
          // imageDrop: true,      // 图片拖拽
          imageResize: {        // 放大缩小
            displayStyles: {
              backgroundColor: "black",
              border: "none",
              color: "white"
            },
            modules: ["Resize", "DisplaySize", "Toolbar"]
          },
          // 工具栏的具体配置
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],  // 加粗 斜体 下划线 删除线
              ["blockquote"],// 引用  代码块
              // [{ header: 1 }, { header: 2 }], // 标题 —— 独立平铺
              [{ list: 'ordered' }, { list: 'bullet' }],  // 有序、无序列表
              [{ indent: '-1' }, { indent: '+1' }],// 缩进
              [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
              [{ size: ["small", false, "large", "huge"] }],  // 字体大小
              [{ header: [1, 2, 3, 4, 5, 6, false] }], // 引用  代码块
              [{'script': 'sub'}, {'script': 'super'}],      // 下标/上标
              [{ font: fontList }], //  [{'font': fontList}],//字体
              [{ align: [] }], // 对齐方式// text direction
              ['clean'], // 清除文本格式
              ["image"], //  ["link", "image", "video"] 链接、图片、视频
              [ // 表单功能
                { table: 'TD' },
                // { 'table-insert-row': 'TIR' },
                // { 'table-insert-column': 'TIC' },
                // { 'table-delete-row': 'TDR' },
                // { 'table-delete-column': 'TDC' }
              ]
            ],
            handlers: {
              // 自定义方法
              table: function (val) {

                if (!this.quill) {
                  return
                }
                //默认插入的表格行列数
                // this.quill.getModule('table').insertTable(2, 2)
                this.quill.getModule("better-table").insertTable(2, 3);
              },
              'image': function (value) {
                if (value) {
                  // 调用iview图片上传
                  // document.querySelector('.ivu-upload .ivu-btn').click()
                } else {
                  this.quill.format('image', false);
                }
              },
              // 'table-insert-row': function () {
              //   this.quill.getModule('table').insertRowBelow()
              // },
              // 'table-insert-column': function () {
              //   this.quill.getModule('table').insertColumnRight()
              // },
              // 'table-delete-row': function () {
              //   this.quill.getModule('table').deleteRow()
              // },
              // 'table-delete-column': function () {
              //   this.quill.getModule('table').deleteColumn()
              // }
            }
          },
          "better-table": {
            operationMenu: {
              items: {
                insertColumnRight: {
                  text: "右边插入一列"
                },
                insertColumnLeft: {
                  text: "左边插入一列"
                },
                insertRowUp: {
                  text: "上边插入一行"
                },
                insertRowDown: {
                  text: "下边插入一行"
                },
                mergeCells: {
                  text: "合并单元格"
                },
                unmergeCells: {
                  text: "拆分单元格"
                },
                deleteColumn: {
                  text: "删除列"
                },
                deleteRow: {
                  text: "删除行"
                },
                deleteTable: {
                  text: "删除表格"
                }
              },
              background: {
                color: "#333"
              },
              color: {
                colors: ["green", "red", "yellow", "blue", "white"],
                text: "background:"
              }
            }
          },
          keyboard: {
            bindings: QuillBetterTable.keyboardBindings
          },
          table: true
        },
        // clipboard: {
        //   matchers: [
        //     [Node.COMMENT_NODE, (node, delta) => {
        //       // 保留注释节点
        //       return delta.insert(`<!--${node.nodeValue}-->`);
        //     }]
        //   ]
        // },
        // ...其他配置
        sanitize: (html) => {
          // 专门保留特定格式的注释
          return html.replace(/<!--\s*([耍水1-1-1].*?)\s*-->/g, function(match, p1) {
            // 将注释转换为不可见的span元素
            return `<span class="ql-preserve-comment" data-comment="${p1.trim()}" style="display:none;"></span>`;
          });
        },
        placeholder: ''
      },
    }
  },
  watch: {
    ...mapGetters(['rangeContent']),
    // 监听外部值的传入，用于将值赋予编辑器
    value(val) {
      // 如果编辑器没有初始化，则停止赋值
      if (!this.quill || !this.quill.root || !this.quill.root.innerHTML) {
        return;
      }

      // 获取编辑器当前内容
      let content = this.quill.root.innerHTML;

      // 外部传入了新值，而且与当前编辑器的内容不一致
      if (val && val !== content) {
        // 将外部传入的HTML内容转换成编辑器识别的delta对象
        let delta = this.quill.clipboard.convert({
          html: val
        });
        // 编辑器的内容需要接收delta对象
        this.quill.setContents(delta);
      }
    }
  },
  mounted () {
   this.init();
   this.addQuillTitle()
  },
  // activated () {
  //   this.quill.setContents({})
  // },
  methods: {
    ...mapMutations(['quill/SET_RANGE_CONTENT']),
    init() {
      const dom = this.$el.querySelector('.editor')
      this.quill = new Quill(dom, this.options);
      // 自定义字体

      Quill.import('formats/font').whitelist = fontList; //将字体加入到白名单
      // 如果设置了上传地址则自定义图片上传事件
      if (this.type == 'url') {
        let toolbar = this.quill.getModule("toolbar")
        toolbar.addHandler("image", (value) => {
          if (value) {
            this.$refs.upload.$children[0].$refs.input.click()
          } else {
            this.quill.format("image", false)
          }
        })
        this.quill.root.addEventListener('paste', this.handlePasteCapture, true)
      }
      // this.quill.setContents(this.value)
      this.quill.on('text-change', (delta, oldDelta, source) => {
        if (!this.quill || !this.quill.root || !this.quill.root.innerHTML) {
          return
        }
        this.$emit("input", this.quill.root.innerHTML);
      })
      if (this.watchSelectionChange) {
        this.quill.on('selection-change', (range, oldRange, source) => {
          if (range) {
            if (range.length === 0) {
              // console.log('User cursor is on', range.index);
            } else {
              const text = this.quill.getText(range.index, range.length);
              const deltaText = this.quill.getContents(range.index, range.length);
              const rangeContent = {
                index: range.index,
                length: range.length,
                text,
                deltaText,
              }
              this['quill/SET_RANGE_CONTENT'](rangeContent);
            }
          } else {
            console.log('Cursor not in the editor');
          }
        });
      }

      // this.$nextTick(() => {
      //   this.$el.querySelector(
      //     '.ql-table-insert-row'
      //   ).innerHTML = `<svg t="1591862376726" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6306" width="18" height="200"><path d="M500.8 604.779L267.307 371.392l-45.227 45.27 278.741 278.613L779.307 416.66l-45.248-45.248z" p-id="6307"></path></svg>`
      //   this.$el.querySelector(
      //     '.ql-table-insert-column'
      //   ).innerHTML = `<svg t="1591862238963" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6509" width="18" height="200"><path d="M593.450667 512.128L360.064 278.613333l45.290667-45.226666 278.613333 278.762666L405.333333 790.613333l-45.226666-45.269333z" p-id="6510"></path></svg>`
      //   this.$el.querySelector(
      //     '.ql-table-delete-row'
      //   ).innerHTML = `<svg t="1591862253524" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6632" width="18" height="200"><path d="M500.8 461.909333L267.306667 695.296l-45.226667-45.269333 278.741333-278.613334L779.306667 650.026667l-45.248 45.226666z" p-id="6633"></path></svg>`
      //   this.$el.querySelector(
      //     '.ql-table-delete-column'
      //   ).innerHTML = `<svg t="1591862261059" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6755" width="18" height="200"><path d="M641.28 278.613333l-45.226667-45.226666-278.634666 278.762666 278.613333 278.485334 45.248-45.269334-233.365333-233.237333z" p-id="6756"></path></svg>`
      //
      // })
      // 加入表格操作图标
    },
    /**
     * 为操作栏的每个按钮提供中文
     */
    addQuillTitle () {
      const oToolBar = document.querySelector('.ql-toolbar')
      const aButton = oToolBar.querySelectorAll('button')
      const aSelect = oToolBar.querySelectorAll('select')
      aButton.forEach(function (item) {
        if (item.className === 'ql-script') {
          item.value === 'sub' ? (item.title = '下标') : (item.title = '上标')
        } else if (item.className === 'ql-indent') {
          item.value === '+1' ? (item.title = '向右缩进') : (item.title = '向左缩进')
        } else {
          item.title = titleConfig[item.classList[0]]
        }
      })
      aSelect.forEach(function (item) {
        item.parentNode.title = titleConfig[item.classList[0]]
      })
    },
    // 获取内容
    getContentData () {
      return this.quill.getContents()
    },
    // 获取html树数据
    getContentHtmlObjData () {
      return this.quill.getContents()
    },
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      const type = ["image/jpeg", "image/jpg", "image/png", "image/svg"]
      const isJPG = type.includes(file.type)
      // 检验文件格式
      if (!isJPG) {
        this.$message.error(`图片格式错误!`)
        return false
      }
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize
        if (!isLt) {
          this.$message.error(`上传文件大小不能超过 ${this.fileSize} MB!`)
          return false
        }
      }
      return true
    },
    handleUploadSuccess(res, file) {
      // 如果上传成功
      if (res.code == 200) {
        // 获取富文本组件实例
        let quill = this.quill
        // 获取光标所在位置
        let length = quill.getSelection().index
        // 插入图片  res.url为服务器返回的图片地址
        // quill.insertEmbed(length, "image", process.env.VUE_APP_BASE_API + res.fileName)
        quill.insertEmbed(length, "image", process.env.VUE_APP_BASE_API + res.fileName)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message.error("图片插入失败")
      }
    },
    handleUploadError() {
      this.$message.error("图片插入失败")
    },
    // 复制粘贴图片处理
    handlePasteCapture(e) {
      const clipboard = e.clipboardData || window.clipboardData
      if (clipboard && clipboard.items) {
        for (let i = 0; i < clipboard.items.length; i++) {
          const item = clipboard.items[i]
          if (item.type.indexOf('image') !== -1) {
            e.preventDefault()
            const file = item.getAsFile()
            this.insertImage(file)
          }
        }
      }
    },
    insertImage(file) {
      const formData = new FormData()
      formData.append("file", file)
      axios.post(this.uploadUrl, formData, { headers: { "Content-Type": "multipart/form-data", Authorization: this.headers.Authorization } }).then(res => {
        this.handleUploadSuccess(res.data)
      })
    },
    getQuill() {
      return this.quill;
    }
  },

}
</script>

<style  >
.editor,.ql-toolbar {
  background: white;
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}

.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=SimSun]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=SimSun]::before {
  content: "宋体";
}

.ql-font-SimSun {
  font-family: "SimSun";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=SimHei]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=SimHei]::before {
  content: "黑体";
}


.ql-font-SimHei {
  font-family: "SimHei";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=Microsoft-YaHei]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=Microsoft-YaHei]::before {
  content: "微软雅黑";
}

.ql-font-Microsoft-YaHei {
  font-family: "Microsoft YaHei";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=KaiTi]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=KaiTi]::before {
  content: "楷体";
}

.ql-font-KaiTi {
  font-family: "KaiTi";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=FangSong]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=FangSong]::before {
  content: "仿宋";
}

.ql-font-FangSong {
  font-family: "FangSong";
}

.quill-better-table-wrapper .quill-better-table {
  margin: 0 auto;
}
.qlbt-col-tool {
  //left: auto;
  width: auto !important;
  left: 50% !important;
  transform: translateX(-50%);
}
.ql-container {
  height: calc(100% - 42px);
}
/* 隐藏注释标记的显示 */
.ql-comment {
  display: none;
}

/* 开发模式下可以显示注释 */
.debug-mode .ql-comment {
  display: inline;
  color: #999;
  font-style: italic;
  font-size: 0.8em;
}
</style>
