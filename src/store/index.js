import { createStore } from 'vuex'
import axios from 'axios'
export default createStore({
  state: {
    maskData: []
  },
  mutations: {
    storeMaskData(state,payload) {
      state.maskData = payload
      // console.log(state.maskData);
    }
  },
  actions: {
    getMaskAPI({commit},API) {
      axios
        .get(API)
        .then((res) => {
          commit('storeMaskData', res.data.features)
        })
    }
  },
  getters: {
    maskData(state) {
      return state.maskData
    }
  }
})
