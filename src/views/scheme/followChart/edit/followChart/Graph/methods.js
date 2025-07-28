import '@antv/x6-vue-shape';
import { Addon } from '@antv/x6'
// 拖拽生成四边形或者圆形
export const startDragToGraph  = (graph,type,e) =>{
    const node =
    type === 'Rect'
    ? graph.createNode({
      ...rectNodeAttrs,
      // 链接桩
      ports: ports
    })
  : type === 'Circle'?graph.createNode({
      ...circleNodeAttrs,
      ports: ports
    }):
    graph.createNode({
      ...polygonNodeAttrs,
      ports: ports
    })
    const dnd = new Addon.Dnd({target:graph})
    dnd.start(node,e)
}
export const rectNodeAttrs = {
  width: 100,
  height: 60,
  attrs: {
    label: {
      text: '正方形节点',
      fill: '#000000',
      fontSize: 14,
      textWrap: {
        width: -10,
        height: -10,
        ellipsis: true
      }
    },
    body: {
      stroke: '#000000',
      strokeWidth: 1,
      fill: '#ffffff'
    }
  },
};
export const polygonNodeAttrs = {
  shape: 'polygon',
  x: 40,
  y: 40,
  width: 120,
  height: 120,
  attrs: {
    label: {
      text: '条件节点',
      fill: '#000000',
      fontSize: 14,
      textWrap: {
        width: -50,
        height: '70%',
        ellipsis: true
      }
    },
    body: {
      fill: '#ffffff',
      stroke: '#000000',
      refPoints: '0,10 10,0 20,10 10,20',
      strokeWidth: 1
    }
  },
};
export const circleNodeAttrs = {
  shape: 'ellipse',
  width: 100,
  height: 100,
  attrs: {
    label: {
      text: '圆形节点',
      fill: '#000000',
      fontSize: 14,
      textWrap: {
        width: -20,
        height: -10,
        ellipsis: true
      }
    },
    body: {
      stroke: '#000000',
      strokeWidth: 1,
      fill: '#ffffff'
    }
  },
};
// 链接桩是节点上的固定连接点，很多图应用都有链接桩，并且有些应用还将链接桩分为输入链接桩和输出连接桩。
export const ports = {
    // // 链接桩组定义
    groups: {
      // 输入链接桩群组定义
      top: {
        position: 'top',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#2D8CF0',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
      // 输出链接桩群组定义
      bottom: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#2D8CF0',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
      left: {
        position: 'left',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#2D8CF0',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
      right: {
        position: 'right',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#2D8CF0',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
    },
    //  // 链接桩
    items: [
      {
        //  链接桩唯一 ID，默认自动生成。
        id: 'port1',
        // 分组名称，指定分组后将继承分组中的链接桩选项。
        group: 'top',
      },
      {
        id: 'port2',
        group: 'bottom',
      },
      {
        id: 'port3',
        group: 'left',
      },
      {
        id: 'port4',
        group: 'right',
      }
    ],
}
