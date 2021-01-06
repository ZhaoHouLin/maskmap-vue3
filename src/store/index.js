import { createStore } from 'vuex'
import { apiGetMaskData, apiGetLatLonDistance} from '../api'
export default createStore({
  state: {
    maskData: [],
    filterMaskData: [],
    centerCoordinates: {
      latitude: 0,
      longitude: 0
    },
    userCoordinates: {
      latitude: 0,
      longitude: 0
    }
  },
  mutations: {
    storeUserCoordinates(state,payload) {
      state.centerCoordinates = payload
      state.userCoordinates = payload
    },
    storeCenterCoordinates(state, payload) {
      state.centerCoordinates = payload
    },
    storeMaskData(state,payload) {
      state.maskData = payload
    },
    storeFilterMaskData(state,payload) {
      state.filterMaskData.push(payload)
    }
  },
  actions: {
    commitCenterCoordinates({ commit }, payload) {
      commit('storeCenterCoordinates', payload)
    },
    commitUserCoordinates({ commit }, payload) {
      commit('storeUserCoordinates',payload)
    },

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
        // console.log(item.geometry.coordinates);
        // let λB = item.geometry.coordinates[1]
        // let ΦB = item.geometry.coordinates[0]
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
    },
    centerCoordinatesData(state) {
      return state.centerCoordinates
    },
    userCoordinatesData(state) {
      return state.userCoordinates
    }
  }
})
