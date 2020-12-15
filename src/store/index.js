import { createStore } from 'vuex'
import axios from 'axios'
export default createStore({
  state: {
    maskData: [],
    filterMaskData: []
  },
  mutations: {
    storeMaskData(state,payload) {
      state.maskData = payload
      state.filterMaskData = payload
      // console.log('mask',state.maskData);
    },
    storeFilterMaskData(state,payload) {
      state.filterMaskData.push(payload)
      // console.log('filterDATA',state.filterMaskData);
    }
  },
  actions: {
    getMaskAPI({commit},API) {
      axios
        .get(API)
        .then((res) => {
          commit('storeMaskData', res.data.features)
        })
    },
    filterCityArea({ commit }, payload) {

      // console.log(this.state.maskData);
      this.state.filterMaskData = []
      this.state.maskData.filter((item)=> {
        if(item.properties.county === payload[0] && item.properties.town === payload[1]) {
          commit('storeFilterMaskData',item)
        }
      })
    }
  },
  getters: {
    maskData(state) {
      return state.maskData
    },
    filterMaskData(state) {
      return state.filterMaskData
    }
  }
})
