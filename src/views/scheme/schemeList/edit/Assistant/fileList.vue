
<template>
<div class="file-list">
  <div class="file-list-item" v-for="(item, index) in listData" :key="index">
    <div class="file-icon">
      <i class="el-icon-document"></i>
    </div>

    <div class="name" :title="item.name">{{item.name}}</div>
    <i class="el-icon-error" @click="removeOne(item)"></i>
  </div>
</div>
</template>
<script>
export default {
  name: "fileList",
  props: {
    listData: Array,
  },
  watch: {
    listData(val) {
      console.log(val)
    }
  },
  methods: {
    removeOne(item) {
      this.$emit('removeOne', item);
    }
  }
}
</script>


<style scoped lang="scss">
.file-list {
  //position: absolute;
  //top: -61px;
  display: flex;
  .file-list-item {
    position: relative;
    width: 60px;
    height: 80px;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid #ddd;
    display: inline-flex;
    flex-direction: column;
    flex-shrink: 0;
    flex-grow: 0;
    margin-right: 8px;
    background: #f5f5f5;
    .file-icon {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      color: #666;
      font-size: 20px;
      flex-shrink: 0;
    }
    .el-icon-document {
      font-size: 25px;

    }
    .name {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 2px;
      font-size: 10px;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      height: 20px;
      line-height: 20px;
      flex-shrink: 0;
    }
    .el-icon-error {
      cursor: pointer;
      //display: none;
      position: absolute;
      top: 2px;
      right: 2px;
    }
    &:hover .el-icon-error {
      //display: inline-block;
    }
  }
}
</style>
