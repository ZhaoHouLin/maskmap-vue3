import { createStore } from 'vuex'
import axios from 'axios'
import { apiGetMaskData } from '../api'
export default createStore({
  state: {
    maskData: [],
    filterMaskData: []
  },
  mutations: {
    storeMaskData(state,payload) {
      state.maskData = payload
    },
    storeFilterMaskData(state,payload) {
      state.filterMaskData.push(payload)
    }
  },
  actions: {
    // getMaskAPI({commit},payload) {
    //   return apiGetMaskData().then((res) => {
    //     this.state.filterMaskData = []
    //     res.data.features.filter((item) => {
    //       if (item.properties.county === payload.city && item.properties.town === payload.area) {
    //         commit('storeFilterMaskData', item)
    //       }
    //     })
    //     commit('storeMaskData', res.data.features)
    //   })
    // },
    async getMaskAPI({ commit }, payload) {
      try {
        const res = await apiGetMaskData()
        this.state.filterMaskData = []
        res.data.features.filter((item) => {
          if (item.properties.county === payload.city && item.properties.town === payload.area) {
            commit('storeFilterMaskData', item)
          }
        })
        commit('storeMaskData', res.data.features)
      } catch (error) {
        console.error(error)
      }
    },
    filterCityArea({ commit }, payload) {
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
