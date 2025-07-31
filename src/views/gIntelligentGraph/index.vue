<template>
  <div style="width: 100%; height: 92vh">
    <iframe
      id="neo4j_iframe"
      :src="iframeURL"
      width="100%"
      height="100%"
    >
    </iframe>
  </div>
</template>
<script>
export default {
  data() {
    return {
      iframeURL: "http://127.0.0.1:5005/"
      // fullscreenLoading: false,
      //
    };
  },
  mounted() {
    // this.hideLoading();
    // window.addEventListener('resize', this.adjustIframe);
  },
  methods: {
    // showLoading() {
    //   this.fullscreenLoading = true;
    //   const loading = this.$loading({
    //     lock: true,
    //     text: "Loading",
    //     spinner: "el-icon-loading",
    //     background: "rgba(0, 0, 0, 0.7)",
    //   });
    //   setTimeout(() => {
    //     loading.close();
    //     this.fullscreenLoading = false;
    //   }, 2000);
    // },
    // adjustIframe() {
    //   const ifm = document.getElementById("bi_iframe");
    //   if (ifm) {
    //     ifm.height = document.documentElement.clientHeight;
    //     ifm.width = document.documentElement.clientWidth;
    //   }
    // },
  },
};
</script>
