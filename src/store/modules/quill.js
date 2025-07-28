

export default  {
  namespaced: true,
  state: {
    rangeContent: {
      index: undefined,
      length: undefined,
      text: '',
      deltaText: null,
    },
    fixContent: '',

  },

  mutations: {
    // 设置最新选中范围信息
    SET_RANGE_CONTENT: (state, value) => {
      state.rangeContent = {...value};
    },
    // 设置修复内容
    SET_FIX_CONTENT: (state, value) => {
      if (value) {
        state.fixContent = value;
      }
    },
  },

  actions: {

  }
}


