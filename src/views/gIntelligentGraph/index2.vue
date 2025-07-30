<template>
  <div style="height: 92vh; overflow: hidden" ref="Screen">
    <div style="display: flex">
      <el-input
        placeholder="请输入查询语句"
        prefix-icon="el-icon-search"
        v-model="match"
        @keydown.enter.native="handleSearch"
      >
      </el-input>
      <el-button
        type="primary"
        :disabled="!match || !match.trim()"
        @click="handleSearch"
        >查询</el-button
      >
    </div>
    <div
      class="left"
      id="viz1"
      style="height: calc(92vh - 40px); overflow: hidden"
      ref="viz1"
    ></div>
  </div>
</template>
<script>
import NeoVis from "neovis.js/dist/neovis.js";
import neo4j from "neo4j-driver";
import { labelsConfig, relationsConfig } from "./config";
export default {
  name: "gIntelligentGraph",
  data() {
    return {
      viz: null,
      driver: null,
      match: "",
      isQueryRunning: false,
    };
  },
  created() {
    this.driver = neo4j.driver(
      "bolt://192.168.1.220:7687",
      neo4j.auth.basic("neo4j", "123456")
    );
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.viz) {
        this.viz.destroy();
      }
      const config = {
        containerId: "viz1",
        neo4j: {
          serverUrl: "bolt://192.168.1.220:7687",
          serverUser: "neo4j",
          serverPassword: "123456",
        },
        visConfig: {
          physics: {
            enabled: true,
            solver: "forceAtlas2Based",
            forceAtlas2Based: {
              springLength: 400,
            },
          },
          nodes: {
            shape: "circle",
          },
          edges: {
            smooth: {
              enabled: false,
              type: "straightCross",
            },
            arrows: {
              to: {
                enabled: true,
              },
            },
            color: "#45B7D1",
            width: 0.5,
          },
        },
        raw: true,
        labels: labelsConfig,
        relationships: relationsConfig,
        initialCypher: `MATCH (n)
          OPTIONAL MATCH (n)-[r]->(m)
          RETURN n, r, m
          LIMIT 25`,
      };
      this.viz = new NeoVis(config);
      this.viz.render();
      this.viz.registerOnEvent("error", () => {
        this.$message.error(`查询出错：请检查查询语句是否正确`);
      });
      this.viz.registerOnEvent("clickNode", (node) => {
        this.nodeClick(node);
      });
    },
    async nodeClick(node) {
      if (this.isQueryRunning) return;
      this.isQueryRunning = true;
      const nodeId = node.nodeId;
      if (!this.driver) {
        console.error("Driver is not initialized");
        return;
      }
      const session = this.driver.session();
      try {
        const checkResult = await session.run(`
           MATCH (n)-[r]->()
           WHERE id(n) = ${nodeId}
           RETURN count(r) AS relationshipCount
         `);
        const relationshipCount =
          checkResult.records[0].get("relationshipCount");
        const hasRelationships = relationshipCount > 0;
        if (!hasRelationships) {
          return;
        }
        const statement = `
          MATCH (n)-[r]->(m)
          WHERE id(n) = ${nodeId}
          RETURN n, r, m
        `;
        this.viz.renderWithCypher(statement);
      } catch (error) {
        console.error("查询出错:", error);
      } finally {
        await session.close();
        this.isQueryRunning = false;
      }
    },
    handleSearch() {
      if (!this.match.trim()) {
        this.$message.error("请输入查询语句");
        return;
      }
      try {
        this.viz.renderWithCypher(this.match, { reset: true });
      } catch (error) {
        this.$message.error("查询出错，请确认您的查询语句是否正确");
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.stock {
  font-size: 12px;
}
</style>
