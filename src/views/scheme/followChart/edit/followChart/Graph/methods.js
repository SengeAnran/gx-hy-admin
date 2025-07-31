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

/**
 *  加个cellJson数据
 * @param nodes
 * @param edges
 * @returns {*[]}
 */
export  function handleCellJson(nodes, edges ) {
  let nodeArr = [];
  if (nodes && nodes.length > 0) {
    nodeArr = nodes.map(i => {
      return {
        ...i,
        ports,
      }
    })
    nodeArr.forEach(i => {
      if (i.shape === 'polygon')  {
        i.attrs.label.textWrap = {
          width: -50,
          height: '70%',
          ellipsis: true
        }
        i.attrs.body.refPoints = "0,10 10,0 20,10 10,20";
        // {
        //   "text": "<5m"
        // },


      } else if (i.shape === 'ellipse')  {
        i.attrs.label.textWrap = {
          width: -20,
          height: -10,
          ellipsis: true
        }
      } else {
        i.attrs.label.textWrap = {
          width: -10,
          height: -10,
          ellipsis: true
        }
      }
    })
  }

  let edgeArr = [];
  if (edges && edges.length > 0) {
    edgeArr = edges.map(i => {
      const edge = {
        ...i,
      }
      edge.attrs.line = {
        ...edge.attrs.line,
        "targetMarker": {
          "name": "classic",
          "size": 8
        },
        "strokeDasharray": 0,
        "style": {
          "animation": "ant-line 30s infinite linear"
        }
      }
      // 线上文字展示
      if (i.labels.length> 0 && i.labels[0].text) {
        i.labels[0] = {
          "attrs": {
            "label": {
              "text": i.labels[0].text
            }
          }
        }
      }
      return edge
    })
  }

  return [...nodeArr, ...edgeArr];
}

export const showJson = {
  "nodes": [
    {
      "position": {
        "x": 100,
        "y": 100
      },
      "size": {
        "width": 120,
        "height": 80
      },
      "attrs": {
        "body": {
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        "label": {
          "text": "\u4f5c\u4e1a\u524d\u51c6\u5907\u3001\u6d17\u538b\u4e95\u3001\u7acb\u94bb\n\u76ee\u6807\uff1a\u5efa\u7acb\u4e95\u63a7\u7cfb\u7edf\u98ce\u9669\n\uff1a\u4e95\u55b7\u98ce\u9669",
          "fill": "#000000",
          "fontSize": 14
        }
      },
      "visible": true,
      "shape": "rect",
      "id": "s1-1753928119-13c1d1d3-66fd-48f7-9a13-3ea60ace6748",
      "zIndex": 1
    },
    {
      "position": {
        "x": 100,
        "y": 300
      },
      "size": {
        "width": 120,
        "height": 80
      },
      "attrs": {
        "body": {
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        "label": {
          "text": "\u62c6\u91c7\u6cb9\u6811\u3001\u5b89\u88c5\u9632\u55b7\u5668\u3001\u8bd5\u538b\u76ee\u6807\uff1a35MPa\u8bd5\u538b\u5408\u683c\u98ce\u9669\uff1a\n\u5bc6\u5c01\u5931\u6548",
          "fill": "#000000",
          "fontSize": 14
        }
      },
      "visible": true,
      "shape": "rect",
      "id": "s2-1753928119-31d68d60-2eb0-44d3-aa6f-e3472f013b84",
      "zIndex": 1
    },
    {
      "position": {
        "x": 100,
        "y": 500
      },
      "size": {
        "width": 120,
        "height": 80
      },
      "attrs": {
        "body": {
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        "label": {
          "text": "\u8d77\u7529\u539f\u4e95\u751f\u4ea7\u7ba1\u67f1\u76ee\u6807\uff1a\u66b4\u9732\u9632\u7802\u7ba1\u67f1\u9c7c\u9876\u98ce\u9669\uff1a\u7ba1\u67f1\u5361\u963b",
          "fill": "#000000",
          "fontSize": 14
        }
      },
      "visible": true,
      "shape": "rect",
      "id": "s3-1753928119-1218390a-1791-4c67-bd2b-db177f388b04",
      "zIndex": 1
    },
    {
      "position": {
        "x": 160,
        "y": 700
      },
      "size": {
        "width": 80,
        "height": 80
      },
      "attrs": {
        "body": {
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        "label": {
          "text": "\u7802\u57cb\u7a0b\u5ea6\u8bca\u65ad",
          "fill": "#000000",
          "fontSize": 14
        }
      },
      "visible": true,
      "shape": "polygon",
      "id": "s4-1753928119-2e1ad9bd-b4b4-45f3-9dc0-895f44eabb08",
      "zIndex": 1
    },
    {
      "position": {
        "x": 100,
        "y": 900
      },
      "size": {
        "width": 120,
        "height": 80
      },
      "attrs": {
        "body": {
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        "label": {
          "text": "\u6b63\u53cd\u5faa\u73af\u6d17\u7802\u76ee\u6807\uff1a\u89e3\u9664\u6d45\u5c42\u7802\u57cb\u98ce\u9669\uff1a\u7802\u6bd4>0.5%",
          "fill": "#000000",
          "fontSize": 14
        }
      },
      "visible": true,
      "shape": "rect",
      "id": "s5-1753928119-5260d60f-5491-4f1b-86ce-3d63622de101",
      "zIndex": 1
    },
    {
      "position": {
        "x": 100,
        "y": 1100
      },
      "size": {
        "width": 120,
        "height": 80
      },
      "attrs": {
        "body": {
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        "label": {
          "text": "\u5957\u94e3\u7ec4\u5408\u65bd\u5de5\u76ee\u6807\uff1a\u6bcf\u5c0f\u65f6\u8fdb\u5c3a\u22650.5m\u98ce\u9669\uff1a\u6cf5\u538b\u7a81\u5347>5MPa",
          "fill": "#000000",
          "fontSize": 14
        }
      },
      "visible": true,
      "shape": "rect",
      "id": "s6-1753928119-e72c18bc-90e6-415d-bc35-0e0ef770013d",
      "zIndex": 1
    },
    {
      "position": {
        "x": 100,
        "y": 1300
      },
      "size": {
        "width": 120,
        "height": 80
      },
      "attrs": {
        "body": {
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        "label": {
          "text": "\u63a2\u9c7c\u9876+\u72b6\u6001\u8bc4\u4f30",
          "fill": "#000000",
          "fontSize": 14
        }
      },
      "visible": true,
      "shape": "rect",
      "id": "s7-1753928119-497c26a7-cba5-4e40-b02b-96d57dc1dc64",
      "zIndex": 1
    },
    {
      "position": {
        "x": 160,
        "y": 1500
      },
      "size": {
        "width": 80,
        "height": 80
      },
      "attrs": {
        "body": {
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        "label": {
          "text": "\u9c7c\u9876\u72b6\u51b5",
          "fill": "#000000",
          "fontSize": 14
        }
      },
      "visible": true,
      "shape": "polygon",
      "id": "s8-1753928119-30600ba8-bd98-4e66-82d4-dd8ea157e124",
      "zIndex": 1
    },
    {
      "position": {
        "x": 100,
        "y": 1700
      },
      "size": {
        "width": 120,
        "height": 80
      },
      "attrs": {
        "body": {
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        "label": {
          "text": "\u5916\u635e\u4f18\u5148\uff1a\u6253\u635e\u7b52/\u7bee\u76ee\u6807\uff1a\u4e00\u6b21\u6293\u83b7\u7387>90%\u98ce\u9669\uff1a\u8d1f\u8377\u6ce2\u52a8>10%",
          "fill": "#000000",
          "fontSize": 14
        }
      },
      "visible": true,
      "shape": "rect",
      "id": "s9-1753928119-f48ba715-6ab5-4295-bae4-140306452c9b",
      "zIndex": 1
    },
    {
      "position": {
        "x": 100,
        "y": 1900
      },
      "size": {
        "width": 120,
        "height": 80
      },
      "attrs": {
        "body": {
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        "label": {
          "text": "\u78e8\u94e3\u4fee\u6574\u9c7c\u9876\u76ee\u6807\uff1a\u6062\u590d\u6807\u51c6\u5c3a\u5bf8\u98ce\u9669\uff1a\u91d1\u5c5e\u788e\u5c51\u6b8b\u7559",
          "fill": "#000000",
          "fontSize": 14
        }
      },
      "visible": true,
      "shape": "rect",
      "id": "s10-1753928119-bc06e5a0-b50d-446d-8974-1df375c63774",
      "zIndex": 1
    },
    {
      "position": {
        "x": 100,
        "y": 2100
      },
      "size": {
        "width": 120,
        "height": 80
      },
      "attrs": {
        "body": {
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        "label": {
          "text": "\u4ece\u843d\u9c7c\u5e95\u90e8\u6253\u635e\u76ee\u6807\uff1a\u9006\u5411\u6293\u53d6\u7ba1\u67f1\u98ce\u9669\uff1a\u7ba1\u67f1\u4e8c\u6b21\u574d\u584c",
          "fill": "#000000",
          "fontSize": 14
        }
      },
      "visible": true,
      "shape": "rect",
      "id": "s11-1753928119-9fa78378-ae8d-4369-a47b-2de45ca5ba73",
      "zIndex": 1
    },
    {
      "position": {
        "x": 160,
        "y": 2300
      },
      "size": {
        "width": 80,
        "height": 80
      },
      "attrs": {
        "body": {
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        "label": {
          "text": "\u6253\u635e\u7ed3\u679c",
          "fill": "#000000",
          "fontSize": 14
        }
      },
      "visible": true,
      "shape": "polygon",
      "id": "s12-1753928119-4c9d4dae-fe21-491f-8440-806fea1dc4df",
      "zIndex": 1
    },
    {
      "position": {
        "x": 100,
        "y": 2500
      },
      "size": {
        "width": 120,
        "height": 80
      },
      "attrs": {
        "body": {
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        "label": {
          "text": "\u51b2\u6d17\u4e95\u7b52\u76ee\u6807\uff1a\u8fd4\u901f\u226530m\u00b3/h\u98ce\u9669\uff1a\u5730\u5c42\u6c61\u67d3",
          "fill": "#000000",
          "fontSize": 14
        }
      },
      "visible": true,
      "shape": "rect",
      "id": "s13-1753928119-c38a38ce-46f5-4571-9efb-949e67c602e9",
      "zIndex": 1
    },
    {
      "position": {
        "x": 100,
        "y": 2700
      },
      "size": {
        "width": 120,
        "height": 80
      },
      "attrs": {
        "body": {
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        "label": {
          "text": "\u9707\u51fb\u89e3\u5361\u76ee\u6807\uff1a\u9707\u51fb\u529b\u2264150kN\u98ce\u9669\uff1a\u8fde\u7eed\u5931\u8d25>3\u6b21",
          "fill": "#000000",
          "fontSize": 14
        }
      },
      "visible": true,
      "shape": "rect",
      "id": "s14-1753928119-8175fbee-6dac-4ecf-b723-d920cbde9613",
      "zIndex": 1
    },
    {
      "position": {
        "x": 100,
        "y": 2900
      },
      "size": {
        "width": 120,
        "height": 80
      },
      "attrs": {
        "body": {
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        "label": {
          "text": "\u5207\u5272\u5206\u6bb5\u6253\u635e\u76ee\u6807\uff1a\u5206\u6bb5\u53d6\u51fa\u7ba1\u67f1\u98ce\u9669\uff1a\u5207\u53e3\u4e0d\u5e73\u6574",
          "fill": "#000000",
          "fontSize": 14
        }
      },
      "visible": true,
      "shape": "rect",
      "id": "s15-1753928119-857273ff-3261-4a3a-ab7b-eec7d776281a",
      "zIndex": 1
    },
    {
      "position": {
        "x": 100,
        "y": 3100
      },
      "size": {
        "width": 120,
        "height": 80
      },
      "attrs": {
        "body": {
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        "label": {
          "text": "\u5012\u6263\u9012\u8fdb\u65b9\u6848\u76ee\u6807\uff1a\u9010\u7ea7\u5206\u89e3\u9c7c\u9876\u98ce\u9669\uff1a\u87ba\u7eb9\u635f\u4f24",
          "fill": "#000000",
          "fontSize": 14
        }
      },
      "visible": true,
      "shape": "rect",
      "id": "s16-1753928119-748edeb9-e4e9-42d6-a4bc-8f50b29fed27",
      "zIndex": 1
    },
    {
      "position": {
        "x": 100,
        "y": 3300
      },
      "size": {
        "width": 120,
        "height": 80
      },
      "attrs": {
        "body": {
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        "label": {
          "text": "\u4e0b\u5165\u666e\u5408\u7ba1\u67f1\u76ee\u6807\uff1a\u8bbe\u8ba1\u4ea7\u6db2\u91cf400m\u00b3/d\u98ce\u9669\uff1a\u7ba1\u67f1\u9047\u963b",
          "fill": "#000000",
          "fontSize": 14
        }
      },
      "visible": true,
      "shape": "rect",
      "id": "s17-1753928119-220b745a-0340-44fb-b156-51fe7b0520c0",
      "zIndex": 1
    },
    {
      "position": {
        "x": 100,
        "y": 3500
      },
      "size": {
        "width": 120,
        "height": 80
      },
      "attrs": {
        "body": {
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        "label": {
          "text": "\u5b89\u88c5\u538b\u529b\u76d1\u6d4b\u88c5\u7f6e\u76ee\u6807\uff1a\u5b9e\u65f6\u6570\u636e\u91c7\u96c6\u98ce\u9669\uff1a\u4eea\u5668\u5931\u6548",
          "fill": "#000000",
          "fontSize": 14
        }
      },
      "visible": true,
      "shape": "rect",
      "id": "s18-1753928119-8c0e19d7-0290-4a10-bc23-461529dc05f3",
      "zIndex": 1
    },
    {
      "position": {
        "x": 100,
        "y": 3700
      },
      "size": {
        "width": 120,
        "height": 80
      },
      "attrs": {
        "body": {
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        "label": {
          "text": "\u62c6\u9632\u55b7\u5668+\u88c5\u91c7\u6cb9\u6811\u76ee\u6807\uff1a\u6062\u590d\u4e95\u53e3\u88c5\u7f6e\u98ce\u9669\uff1a\u5bc6\u5c01\u6cc4\u6f0f",
          "fill": "#000000",
          "fontSize": 14
        }
      },
      "visible": true,
      "shape": "rect",
      "id": "s19-1753928119-508f740a-61d9-4adc-98fe-b326f4a6b3c3",
      "zIndex": 1
    },
    {
      "position": {
        "x": 100,
        "y": 3900
      },
      "size": {
        "width": 120,
        "height": 80
      },
      "attrs": {
        "body": {
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        "label": {
          "text": "\u4f4e\u9891\u542f\u6cf5\u751f\u4ea7\u76ee\u6807\uff1a\u5e73\u7a33\u6062\u590d\u4ea7\u80fd\u98ce\u9669\uff1a\u51fa\u7802\u590d\u53d1",
          "fill": "#000000",
          "fontSize": 14
        }
      },
      "visible": true,
      "shape": "rect",
      "id": "s20-1753928119-912877f0-1142-438b-8f6f-e36008ea3286",
      "zIndex": 1
    }
  ],
  "edges": [
    {
      "shape": "edge",
      "attrs": {
        "line": {
          "stroke": "#1890ff",
          "strokeWidth": 1
        }
      },
      "id": "1753928119-a806d54b-d35d-4ab2-8312-0f3044302e9c",
      "connector": "normal",
      "router": {
        "name": "manhattan"
      },
      "zIndex": 0,
      "labels": [
        // {
        //   "text": "<5m"
        // },
        {
          "attrs": {
            "label": {
              "text": "<5m1"
            }
          }
        }
      ],
      "source": {
        "cell": "s4-1753928119-2e1ad9bd-b4b4-45f3-9dc0-895f44eabb08",
        "port": "port2"
      },
      "target": {
        "cell": "s5-1753928119-5260d60f-5491-4f1b-86ce-3d63622de101",
        "port": "port1"
      }
    },
    {
      "shape": "edge",
      "attrs": {
        "line": {
          "stroke": "#1890ff",
          "strokeWidth": 1
        }
      },
      "id": "1753928119-4fc49cfa-32d4-44f5-96b5-4f930fdfb220",
      "connector": "normal",
      "router": {
        "name": "manhattan"
      },
      "zIndex": 0,
      "labels": [
        {
          "text": "5m"
        }
      ],
      "source": {
        "cell": "s4-1753928119-2e1ad9bd-b4b4-45f3-9dc0-895f44eabb08",
        "port": "port2"
      },
      "target": {
        "cell": "s6-1753928119-e72c18bc-90e6-415d-bc35-0e0ef770013d",
        "port": "port1"
      }
    },
    {
      "shape": "edge",
      "attrs": {
        "line": {
          "stroke": "#1890ff",
          "strokeWidth": 1
        }
      },
      "id": "1753928119-172d3823-6ed9-426c-846c-bc265669887e",
      "connector": "normal",
      "router": {
        "name": "manhattan"
      },
      "zIndex": 0,
      "labels": [
        {
          "text": ""
        }
      ],
      "source": {
        "cell": "s7-1753928119-497c26a7-cba5-4e40-b02b-96d57dc1dc64",
        "port": "port2"
      },
      "target": {
        "cell": "s8-1753928119-30600ba8-bd98-4e66-82d4-dd8ea157e124",
        "port": "port1"
      }
    },
    {
      "shape": "edge",
      "attrs": {
        "line": {
          "stroke": "#1890ff",
          "strokeWidth": 1
        }
      },
      "id": "1753928119-67874b77-f3f6-4567-a7d2-f1caea5c2aa5",
      "connector": "normal",
      "router": {
        "name": "manhattan"
      },
      "zIndex": 0,
      "labels": [
        {
          "text": "\u9c7c\u9876\u5b8c\u597d"
        }
      ],
      "source": {
        "cell": "s8-1753928119-30600ba8-bd98-4e66-82d4-dd8ea157e124",
        "port": "port2"
      },
      "target": {
        "cell": "s9-1753928119-f48ba715-6ab5-4295-bae4-140306452c9b",
        "port": "port1"
      }
    },
    {
      "shape": "edge",
      "attrs": {
        "line": {
          "stroke": "#1890ff",
          "strokeWidth": 1
        }
      },
      "id": "1753928119-22da8b16-0a9d-43c4-9ae4-8151fd7fb521",
      "connector": "normal",
      "router": {
        "name": "manhattan"
      },
      "zIndex": 0,
      "labels": [
        {
          "text": "\u9c7c\u9876\u53d8\u5f62"
        }
      ],
      "source": {
        "cell": "s8-1753928119-30600ba8-bd98-4e66-82d4-dd8ea157e124",
        "port": "port2"
      },
      "target": {
        "cell": "s10-1753928119-bc06e5a0-b50d-446d-8974-1df375c63774",
        "port": "port1"
      }
    },
    {
      "shape": "edge",
      "attrs": {
        "line": {
          "stroke": "#1890ff",
          "strokeWidth": 1
        }
      },
      "id": "1753928119-19840145-ab22-4c24-aaa5-d845a53d9f80",
      "connector": "normal",
      "router": {
        "name": "manhattan"
      },
      "zIndex": 0,
      "labels": [
        {
          "text": ""
        }
      ],
      "source": {
        "cell": "s10-1753928119-bc06e5a0-b50d-446d-8974-1df375c63774",
        "port": "port2"
      },
      "target": {
        "cell": "s11-1753928119-9fa78378-ae8d-4369-a47b-2de45ca5ba73",
        "port": "port1"
      }
    },
    {
      "shape": "edge",
      "attrs": {
        "line": {
          "stroke": "#1890ff",
          "strokeWidth": 1
        }
      },
      "id": "1753928119-1093e53b-826e-465f-9765-22557679b568",
      "connector": "normal",
      "router": {
        "name": "manhattan"
      },
      "zIndex": 0,
      "labels": [
        {
          "text": "\u6210\u529f"
        }
      ],
      "source": {
        "cell": "s12-1753928119-4c9d4dae-fe21-491f-8440-806fea1dc4df",
        "port": "port2"
      },
      "target": {
        "cell": "s13-1753928119-c38a38ce-46f5-4571-9efb-949e67c602e9",
        "port": "port1"
      }
    },
    {
      "shape": "edge",
      "attrs": {
        "line": {
          "stroke": "#1890ff",
          "strokeWidth": 1
        }
      },
      "id": "1753928119-9119c0d9-6b28-4441-a648-66d88b0d5534",
      "connector": "normal",
      "router": {
        "name": "manhattan"
      },
      "zIndex": 0,
      "labels": [
        {
          "text": "\u5931\u8d25"
        }
      ],
      "source": {
        "cell": "s12-1753928119-4c9d4dae-fe21-491f-8440-806fea1dc4df",
        "port": "port2"
      },
      "target": {
        "cell": "s14-1753928119-8175fbee-6dac-4ecf-b723-d920cbde9613",
        "port": "port1"
      }
    },
    {
      "shape": "edge",
      "attrs": {
        "line": {
          "stroke": "#1890ff",
          "strokeWidth": 1
        }
      },
      "id": "1753928119-d32877a2-5a7c-4c8e-8d59-300e967a35bd",
      "connector": "normal",
      "router": {
        "name": "manhattan"
      },
      "zIndex": 0,
      "labels": [
        {
          "text": ""
        }
      ],
      "source": {
        "cell": "s14-1753928119-8175fbee-6dac-4ecf-b723-d920cbde9613",
        "port": "port2"
      },
      "target": {
        "cell": "s15-1753928119-857273ff-3261-4a3a-ab7b-eec7d776281a",
        "port": "port1"
      }
    },
    {
      "shape": "edge",
      "attrs": {
        "line": {
          "stroke": "#1890ff",
          "strokeWidth": 1
        }
      },
      "id": "1753928119-e6f64429-4a43-4597-beb2-b24c9e1303ac",
      "connector": "normal",
      "router": {
        "name": "manhattan"
      },
      "zIndex": 0,
      "labels": [
        {
          "text": ""
        }
      ],
      "source": {
        "cell": "s15-1753928119-857273ff-3261-4a3a-ab7b-eec7d776281a",
        "port": "port2"
      },
      "target": {
        "cell": "s16-1753928119-748edeb9-e4e9-42d6-a4bc-8f50b29fed27",
        "port": "port1"
      }
    },
    {
      "shape": "edge",
      "attrs": {
        "line": {
          "stroke": "#1890ff",
          "strokeWidth": 1
        }
      },
      "id": "1753928119-2fb6f530-c64b-48ea-bca9-1edc74d20f8a",
      "connector": "normal",
      "router": {
        "name": "manhattan"
      },
      "zIndex": 0,
      "labels": [
        {
          "text": ""
        }
      ],
      "source": {
        "cell": "s13-1753928119-c38a38ce-46f5-4571-9efb-949e67c602e9",
        "port": "port2"
      },
      "target": {
        "cell": "s17-1753928119-220b745a-0340-44fb-b156-51fe7b0520c0",
        "port": "port1"
      }
    },
    {
      "shape": "edge",
      "attrs": {
        "line": {
          "stroke": "#1890ff",
          "strokeWidth": 1
        }
      },
      "id": "1753928119-047d9d32-ba3f-4228-91ea-6a1f7e86dd16",
      "connector": "normal",
      "router": {
        "name": "manhattan"
      },
      "zIndex": 0,
      "labels": [
        {
          "text": ""
        }
      ],
      "source": {
        "cell": "s17-1753928119-220b745a-0340-44fb-b156-51fe7b0520c0",
        "port": "port2"
      },
      "target": {
        "cell": "s18-1753928119-8c0e19d7-0290-4a10-bc23-461529dc05f3",
        "port": "port1"
      }
    },
    {
      "shape": "edge",
      "attrs": {
        "line": {
          "stroke": "#1890ff",
          "strokeWidth": 1
        }
      },
      "id": "1753928119-0ac14729-7899-4867-b765-4aacdd5c121e",
      "connector": "normal",
      "router": {
        "name": "manhattan"
      },
      "zIndex": 0,
      "labels": [
        {
          "text": ""
        }
      ],
      "source": {
        "cell": "s18-1753928119-8c0e19d7-0290-4a10-bc23-461529dc05f3",
        "port": "port2"
      },
      "target": {
        "cell": "s19-1753928119-508f740a-61d9-4adc-98fe-b326f4a6b3c3",
        "port": "port1"
      }
    },
    {
      "shape": "edge",
      "attrs": {
        "line": {
          "stroke": "#1890ff",
          "strokeWidth": 1
        }
      },
      "id": "1753928119-de7fc3e7-e9b1-466c-bc0c-e95eba5be72a",
      "connector": "normal",
      "router": {
        "name": "manhattan"
      },
      "zIndex": 0,
      "labels": [
        {
          "text": ""
        }
      ],
      "source": {
        "cell": "s19-1753928119-508f740a-61d9-4adc-98fe-b326f4a6b3c3",
        "port": "port2"
      },
      "target": {
        "cell": "s20-1753928119-912877f0-1142-438b-8f6f-e36008ea3286",
        "port": "port1"
      }
    },
    {
      "shape": "edge",
      "attrs": {
        "line": {
          "stroke": "#1890ff",
          "strokeWidth": 1
        }
      },
      "id": "1753928119-5773949d-cc75-4a01-a7f6-860fd6d9a862",
      "connector": "normal",
      "router": {
        "name": "manhattan"
      },
      "zIndex": 0,
      "labels": [
        {
          "text": ""
        }
      ],
      "source": {
        "cell": "s1-1753928119-13c1d1d3-66fd-48f7-9a13-3ea60ace6748",
        "port": "port2"
      },
      "target": {
        "cell": "s2-1753928119-31d68d60-2eb0-44d3-aa6f-e3472f013b84",
        "port": "port1"
      }
    },
    {
      "shape": "edge",
      "attrs": {
        "line": {
          "stroke": "#1890ff",
          "strokeWidth": 1
        }
      },
      "id": "1753928119-92372753-3319-45ea-aa60-d1db0b8a317d",
      "connector": "normal",
      "router": {
        "name": "manhattan"
      },
      "zIndex": 0,
      "labels": [
        {
          "text": ""
        }
      ],
      "source": {
        "cell": "s2-1753928119-31d68d60-2eb0-44d3-aa6f-e3472f013b84",
        "port": "port2"
      },
      "target": {
        "cell": "s3-1753928119-1218390a-1791-4c67-bd2b-db177f388b04",
        "port": "port1"
      }
    },
    {
      "shape": "edge",
      "attrs": {
        "line": {
          "stroke": "#1890ff",
          "strokeWidth": 1
        }
      },
      "id": "1753928119-02466c72-e875-4b23-8549-0a053947d02e",
      "connector": "normal",
      "router": {
        "name": "manhattan"
      },
      "zIndex": 0,
      "labels": [
        {
          "text": ""
        }
      ],
      "source": {
        "cell": "s3-1753928119-1218390a-1791-4c67-bd2b-db177f388b04",
        "port": "port2"
      },
      "target": {
        "cell": "s4-1753928119-2e1ad9bd-b4b4-45f3-9dc0-895f44eabb08",
        "port": "port1"
      }
    },
    {
      "shape": "edge",
      "attrs": {
        "line": {
          "stroke": "#1890ff",
          "strokeWidth": 1
        }
      },
      "id": "1753928119-6114e33a-aa4a-4a03-a328-d8a4051bfea4",
      "connector": "normal",
      "router": {
        "name": "manhattan"
      },
      "zIndex": 0,
      "labels": [
        {
          "text": ""
        }
      ],
      "source": {
        "cell": "s5-1753928119-5260d60f-5491-4f1b-86ce-3d63622de101",
        "port": "port2"
      },
      "target": {
        "cell": "s7-1753928119-497c26a7-cba5-4e40-b02b-96d57dc1dc64",
        "port": "port1"
      }
    },
    {
      "shape": "edge",
      "attrs": {
        "line": {
          "stroke": "#1890ff",
          "strokeWidth": 1
        }
      },
      "id": "1753928119-f6b45754-950b-48db-a6e6-f152832f6544",
      "connector": "normal",
      "router": {
        "name": "manhattan"
      },
      "zIndex": 0,
      "labels": [
        {
          "text": ""
        }
      ],
      "source": {
        "cell": "s6-1753928119-e72c18bc-90e6-415d-bc35-0e0ef770013d",
        "port": "port2"
      },
      "target": {
        "cell": "s7-1753928119-497c26a7-cba5-4e40-b02b-96d57dc1dc64",
        "port": "port1"
      }
    },
    {
      "shape": "edge",
      "attrs": {
        "line": {
          "stroke": "#1890ff",
          "strokeWidth": 1
        }
      },
      "id": "1753928119-ce655672-eca3-4528-9db4-246db281f425",
      "connector": "normal",
      "router": {
        "name": "manhattan"
      },
      "zIndex": 0,
      "labels": [
        {
          "text": ""
        }
      ],
      "source": {
        "cell": "s9-1753928119-f48ba715-6ab5-4295-bae4-140306452c9b",
        "port": "port2"
      },
      "target": {
        "cell": "s12-1753928119-4c9d4dae-fe21-491f-8440-806fea1dc4df",
        "port": "port1"
      }
    },
    {
      "shape": "edge",
      "attrs": {
        "line": {
          "stroke": "#1890ff",
          "strokeWidth": 1
        }
      },
      "id": "1753928119-226455c1-1662-4fd2-bcae-0c23f215a2a4",
      "connector": "normal",
      "router": {
        "name": "manhattan"
      },
      "zIndex": 0,
      "labels": [
        {
          "text": ""
        }
      ],
      "source": {
        "cell": "s11-1753928119-9fa78378-ae8d-4369-a47b-2de45ca5ba73",
        "port": "port2"
      },
      "target": {
        "cell": "s12-1753928119-4c9d4dae-fe21-491f-8440-806fea1dc4df",
        "port": "port1"
      }
    },
    {
      "shape": "edge",
      "attrs": {
        "line": {
          "stroke": "#1890ff",
          "strokeWidth": 1
        }
      },
      "id": "1753928119-cd34340d-3859-40bb-909b-c979a30ba981",
      "connector": "normal",
      "router": {
        "name": "manhattan"
      },
      "zIndex": 0,
      "labels": [
        {
          "text": ""
        }
      ],
      "source": {
        "cell": "s16-1753928119-748edeb9-e4e9-42d6-a4bc-8f50b29fed27",
        "port": "port2"
      },
      "target": {
        "cell": "s7-1753928119-497c26a7-cba5-4e40-b02b-96d57dc1dc64",
        "port": "port1"
      }
    }
  ]
}
