
<template>
  <div ref="smartAssistant" class="smart-assistant">
    <img src="./people.png" alt="">
    <div class="name">智能修井助手</div>
  </div>
</template>
<script>
export default {
  name: "smartAssistant",
  data() {
    return {
      smartAssistant: null,
      isDragging: false,
      offsetX: undefined,
      offsetY: undefined,
    }
  },
  mounted() {
    this.init();

  },
  methods: {
    init() {
      this.smartAssistant = this.$refs.smartAssistant;
      const img = this.smartAssistant;
      this.smartAssistant.addEventListener('mousedown', (e) => {

        document.addEventListener('mousemove', this.mousemoveHandle);
        this.isDragging = true;

        // 计算鼠标点击位置相对于图片左上角的偏移
        this.offsetX = e.clientX - img.getBoundingClientRect().left;
        this.offsetY = e.clientY - img.getBoundingClientRect().top;

        // 防止选中图片（避免拖动时出现“幽灵图”）
        e.preventDefault();
      });

      this.smartAssistant.addEventListener('mouseup', (e) => {
        this.isDragging = false;
        document.removeEventListener('mousemove', this.mousemoveHandle )
      });
    },
    mousemoveHandle(e) {
      if (!this.isDragging) return;
      // 计算图片的新位置（鼠标位置 - 偏移量）
      const x = e.clientX - this.offsetX;
      const y = e.clientY - this.offsetY;
      // 更新图片的 CSS 位置
      this.smartAssistant.style.left = `${x}px`;
      this.smartAssistant.style.top = `${y}px`;

    }
  }
}
</script>


<style scoped lang="scss">
.smart-assistant {
  position: fixed;
  right: 32px;
  top: 132px;
  width: 90px;
  height: 150px;
  z-index: 9999;
  cursor: pointer;
  user-select: none;
  transition: opacity 0.5s;
  box-shadow: 0 4px 16px rgba(30, 1, 1, 0.84);
  background: none;
  img {
    width: 100%;
    height: auto;
    display: block
  }
  .name {
    text-align: center;
    font-size: 13px;
    color: #666;
    margin-top: 2px;
    letter-spacing: 1px;
    user-select: none;
    background: white;
  }
}
</style>
