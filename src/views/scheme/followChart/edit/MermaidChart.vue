<template>
  <div class="mermaid" ref="chart">
    {{ code }}
  </div>
</template>

<script>
 import Mermaid from 'mermaid/dist/mermaid.js'
export default {
  props: ['code'],
  data() {
    return {
      mermaid: null,
    }
  },
  mounted() {
    this.renderChart();
  },
  watch: {
    code(val) {
      this.$nextTick(() => {
        if (val && this.mermaid) {
          this.mermaid.init(undefined, this.$refs.chart);
        }
      })
    }
  },
  methods: {
    renderChart() {
      this.$nextTick(() => {
        this.mermaid = Mermaid;
      })

    },
  },
};
</script>
<style lang="scss" scoped>
.mermaid {

  font-family: 'Arial';
  overflow-y: auto;
  ::v-deep svg {
    max-width: none !important;
    margin: 0 auto;
  }
}
</style>
