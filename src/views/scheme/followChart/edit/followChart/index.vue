
<template>
<div class="container_warp">
  <div id="containerChart"></div>
<!-- 右側配置栏 -->
  <RightDrawer class="right_drawer" :drawerType="type" :selectCell="selectCell" :graph="graph" :grid="grid" @deleteNode="deleteNode"></RightDrawer>

  <!--  头部工具栏-->
  <div class="operating">
    <div class="btn-group">
      <el-tooltip class="item" effect="dark" content="直线箭头" placement="bottom">
        <div class="btn" title="圆形节点" @mousedown="startDrag('Circle',$event)">
          <i class="iconfont icon-circle"></i>
        </div>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="直线箭头" placement="bottom">
        <div class="btn" title="正方形节点" @mousedown="startDrag('Rect',$event)">
          <i class="iconfont icon-square"></i>
        </div>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="直线箭头" placement="bottom">
        <div class="btn" title="条件节点">
          <i class="iconfont icon-square rotate-square" @mousedown="startDrag('polygon',$event)"></i>
        </div>
      </el-tooltip>

      <div class="btn-group_tips" v-if="showTips">
        拖拽生成<br/>资产拓扑图形
      </div>
    </div>
    <div class="btn-group">
      <el-tooltip class="item" effect="dark" content="直线箭头" placement="bottom">
        <div :class=" ['btn',currentArrow === 1?'currentArrow':'']" @click="changeEdgeType('normal')">
          <i class="iconfont icon-ai28"></i>
        </div>
      </el-tooltip>
      <el-tooltip content="曲线箭头" placement="bottom">
        <div :class=" ['btn',currentArrow === 2?'currentArrow':'']" @click="changeEdgeType('smooth')">
          <i class="iconfont icon-Down-Right"></i>
        </div>
      </el-tooltip>
      <el-tooltip content="直角箭头" placement="bottom">
        <div :class=" ['btn',currentArrow === 3?'currentArrow':'']" @click="changeEdgeType()">
          <i class="iconfont icon-jiantou"></i>
        </div>
      </el-tooltip>
    </div>
    <div class="btn-group">
      <el-tooltip content="删除" placement="bottom">
        <div class="btn" @click="deleteNode()" style="margin-top: 5px;">
          <i class="iconfont icon-shanchu"></i>
        </div>
      </el-tooltip>
      <el-tooltip content="保存PNG" placement="bottom">
        <div class="btn" @click="saveToPNG()" title="保存">
          <i class="iconfont icon-baocun"></i>
        </div>
      </el-tooltip>
    </div>
  </div>

</div>
</template>
<script>

import '@antv/x6-vue-shape'
import insertCss from 'insert-css';
import { Graph, Shape, FunctionExt, DataUri } from '@antv/x6'
import {startDragToGraph} from './Graph/methods.js'
import RightDrawer from "./components/RightDrawer.vue";
import _ from "lodash";
export default {
  components: {RightDrawer},
  props: {
    jsonData: {
      type: Object,
      default: () => { return {
        cells: [],
      }},
    },
  },
  data() {
    return {
      graph:'',
      type:'grid',
      selectCell:'',
      connectEdgeType:{  //连线方式
        connector: 'normal',
        shape: 'custom-edge-label',
        router: {
          name: ''
        }
      },
      showTips: false,
      currentArrow:1,
      grid:{ // 网格设置
        size: 20,      // 网格大小 10px
        visible: true, // 渲染网格背景
        type: 'mesh',
        args: {
          color: '#D0D0D0',
          thickness: 1, // 网格线宽度/网格点大小
          factor: 10
        }
      }
    }
  },
  mounted () {
    this.initX6();
    setTimeout(()=>{
      this.showTips = true
    },1000)
    setTimeout(()=>{
      this.showTips = false
    },5000)
  },
  watch: {
    jsonData: {
      handler:function (val)   {
        if (val.cells && val.cells.length >  0) {
          this.$nextTick(() => {
            this.graph.fromJSON(_.cloneDeep(val))
          })
        }
      },
      deep: true,
    }
  },
  methods: {
    initX6(){
      var _that = this
      this.graph = new Graph({
        container: document.getElementById('containerChart'),
        width: 1700,
        height: '100%',
        grid: _that.grid,
        panning: true, // 支持拖拽平移
        resizing: { // 调整节点宽高
          enabled: true,
          orthogonal:false,
        },
        selecting: true, // 可选
        snapline:  true,
        interacting: {
          edgeLabelMovable: true
        },

        connecting: { // 节点连接
          anchor: 'center', // 当连接到节点时，通过 anchor 来指定被连接的节点的锚点，默认值为 center。
          connectionPoint: 'anchor', // 指定连接点
          allowBlank: false, // 是否允许连接到画布空白位置的点
          snap: true, // 连线的过程中距离节点或者连接桩 50px 时会触发自动吸附
          createEdge () {
            // 连接的过程中创建新的边
            return new Shape.Edge({
              attrs: {
                line: {
                  stroke: '#1890ff',
                  strokeWidth: 1,
                  targetMarker: {
                    name: 'classic',
                    size: 8
                  },
                  strokeDasharray: 0, //虚线
                  style: {
                    animation: 'ant-line 30s infinite linear',
                  }
                }
              },
              label: {
                text:''
              },
              // Vue + AntV X6 流程图在线编辑器（三）系列文章 Vue + AntV X6 流程图在线编辑器（三）创建边 E - 掘金
              connector: _that.connectEdgeType.connector,
              // outer 路由
              router: {
                name: _that.connectEdgeType.router.name || ''
              },
              zIndex: 0
            })
          }
        },
        highlighting: {
          magnetAvailable: {
            name: 'stroke',
            args: {
              padding: 4,
              attrs: {
                strokeWidth: 4,
                stroke: '#6a6c8a'
              }
            }
          }
        },
      });
      insertCss(`
            @keyframes ant-line {
              to {
                  stroke-dashoffset: -1000
              }
            }
          `);
      this.graph.fromJSON(_.cloneDeep(this.jsonData))
      // this.graph.fromJSON(data)
      this.$nextTick(() => {
        // this.graph.centerContent()  // 内容居中
        if ( this.graph.history) {
          this.graph.history.redo(); // 重做
          this.graph.history.undo(); //撤销
        }

        this.graph.enablePanning(); // 启用画布平移
        this.graph.enableMouseWheel(); // 启用鼠标滚轮缩放画布。
        // 鼠标移入移出节点
        this.graph.on('node:mouseenter',FunctionExt.debounce(() => {
          const container =  document.getElementById('containerChart')
          const ports = container.querySelectorAll(
              '.x6-port-body'
          )
          this.showPorts(ports, true)
        }), 500)
        this.graph.on('node:mouseleave', () => {
          const container =  document.getElementById('containerChart')
          const ports = container.querySelectorAll(
              '.x6-port-body'
          )
          this.showPorts(ports, false)
        })
        // 网格点击
        this.graph.on('blank:click', () => {
          this.type = 'grid'
        })
        // 基类点击
        this.graph.on('cell:click', ({ cell }) => {
          this.type = cell.isNode() ? 'node' : 'edge'
        })
        //  选中改变
        this.graph.on('selection:changed', (args) => {
          args.added.forEach(cell => {
            this.selectCell = cell
            if(cell.isEdge()){
              cell.isEdge() && cell.attr('line/strokeDasharray', 5) //虚线蚂蚁线
              cell.addTools([
                {
                  name: 'vertices',
                  args: {
                    padding: 4,
                    attrs: {
                      strokeWidth: 0.1,
                      stroke: '#2d8cf0',
                      fill: '#ffffff',
                    }
                  }
                }
              ])
            }
          })
          args.removed.forEach(cell => {
            cell.isEdge() && cell.attr('line/strokeDasharray', 0)  //正常线
            cell.removeTools()
          })
        })
      })

    },
    // 展示点位
    showPorts (ports, show) {
      for (let i = 0, len = ports.length; i < len; i = i + 1) {
        ports[i].style.visibility = show ? 'visible' : 'hidden'
      }
    },
    // 拖拽生成正方形或者圆形
    startDrag(type, e) {
      startDragToGraph(this.graph, type, e)
    },
    // 删除选中的元素
    deleteNode(){
      const cell = this.graph.getSelectedCells()
      this.graph.removeCells(cell)
      this.type = 'grid'
    },
    // 保存png
    saveToPNG () {
      this.$nextTick(()=>{
        this.graph.toPNG((dataUri) => {
          // 下载
          DataUri.downloadDataUri(dataUri, '资产拓扑图.png')
        },{
          backgroundColor: 'white',
          padding: {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50
          },
          quality: 1,
          copyStyles:false
        })
      })
    },
    // 将画布上生成的图像保存为Json文件
    saveToJson(){
      this.$nextTick(()=>{
        const getJson = this.graph.toJSON();
        // const getJson = this.graph.toJSON();
        let data = JSON.stringify(getJson)
        let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(data)
        let link = document.createElement("a")
        link.href = uri
        link.download = "save.json"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    // 将画布上生成的图像保存为Json数据
    getChartJson(){
      return this.graph.toJSON()
    },
    // 改变边形状
    changeEdgeType(e){
      if(e === 'normal'){
        this.connectEdgeType = {
          connector: 'normal',
          router: {name: ''}
        }
        this.currentArrow = 1
      }else if (e === 'smooth'){
        this.connectEdgeType = {
          connector: 'smooth',
          router: {name: ''}
        }
        this.currentArrow = 2
      }else{
        this.connectEdgeType = {
          connector: 'normal',
          router: {name: 'manhattan'}
        }
        this.currentArrow = 3
      }
    }
  }
}
</script>

<!---->
<style lang="scss" scoped>
@import './iconfont.css';
@import './index.scss';
.container_warp {
  height: 100% ;
}
</style>
