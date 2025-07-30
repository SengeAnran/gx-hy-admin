import NeoVis from "neovis.js/dist/neovis.js";
import neo4j from "neo4j-driver";
const lables = [
  "stock",
  "person",
  "Province",
  "SecuritiesExchange",
  "井号",
  "井深结构",
  "井斜",
  "筛管类型",
  "井眼类型",
  "割刀类型",
  "打捞工具",
  "异常情况",
  "封隔器种类",
  "钻杆",
  "计数",
  "作业类型",
  "井深范围",
  "修井方案",
  "套管",
  "钻杆",
  "扶正器",
  "钻铤",
  "油管",
];

export const labelsConfig = lables.reduce((config, label) => {
  config[label] = {
    label: "name",
    // value: "sizeVal",
    [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
      static: {
        shape: "circle",
        size: 100,
        font: {
          size: 14,
          color: "#000000",
          strokeWidth: 0,
          strokeColor: null,
        },
      },
      function: {
        label: (node) => {
          const raw = node.properties.name || "";
          return raw.length > 3 ? raw.slice(0, 3) + "…" : raw;
        },
        title: (props) => NeoVis.objectToTitleHtml(props, ["name", "pagerank"])
      },
    },
  };
  return config;
}, {});

const relations = [
  "使用套管",
  "使用钻杆",
  "适用井深",
  "使用扶正器",
  "使用钻铤",
  "使用油管",
  "同行",
  "师傅",
  "Area",
  "Exchange"
];

export const relationsConfig = relations.reduce((config, label) => {
  config[label] = {
    label: "relation" || "type",
    value: "weight",
    [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
      function: {
        title: NeoVis.objectToTitleHtml,
      },
      static: {
        font: {
          size: 14,
          color: "#000000",
        },
      },
    },
  };
  return config;
}, {});
