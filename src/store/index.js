import { createStore } from 'vuex'
import { apiGetMaskData, apiGetLatLonDistance} from '../api'
export default createStore({
  state: {
    selectList: {
      city: '臺北市',
      area: '中正區',
    },
    maskData: [],
    filterMaskData: [],
    nearPharmacyData:[],
    centerCoordinates: {
      latitude: 0,
      longitude: 0
    },
    userCoordinates: {
      latitude: 0,
      longitude: 0
    },
    isOpen: false
  },
  mutations: {
    storeUserCoordinates(state,payload) {
      state.centerCoordinates = payload
      state.userCoordinates = payload
    },
    storeCenterCoordinates(state, payload) {
      state.centerCoordinates = payload
    },
    storeNearPharmacy(state, payload) {
      state.nearPharmacyData.push(payload)
    },
    storeMaskData(state,payload) {
      state.maskData = payload
    },
    storeFilterMaskData(state,payload) {
      state.filterMaskData.push(payload)
    },
    storeIsOpen(state) {
      state.isOpen = !state.isOpen
    }
  },
  actions: {
    commitCenterCoordinates({ commit }, payload) {
      commit('storeCenterCoordinates', payload)
    },
    commitUserCoordinates({ commit }, payload) {
      commit('storeUserCoordinates',payload)
    },
    commitNearPharmacy({ state,commit }) {
      state.nearPharmacyData= []
      let λA = state.userCoordinates.latitude
      let ΦA = state.userCoordinates.longitude
      state.maskData.filter((item) => {
        let λB = item.geometry.coordinates[1]
        let ΦB = item.geometry.coordinates[0]
        let distance = apiGetLatLonDistance(λA, ΦA, λB, ΦB)
        if (distance < 1) {
          commit('storeNearPharmacy', item)
        }
      })
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
    filterCityArea({ state,commit }, payload) {
      state.filterMaskData = []
      state.maskData.filter((item)=> {
        if(item.properties.county === payload[0] && item.properties.town === payload[1]) {
          commit('storeFilterMaskData',item)
        }
      })
    },
    commitIsOpen({ commit }) {
      commit('storeIsOpen')
    }
  },
  getters: {
    selectList(state) {
      return state.selectList
    },
    maskData(state) {
      return state.maskData
    },
    filterMaskData(state) {
      return state.filterMaskData
    },
    nearPharmacyData(state) {
      return state.nearPharmacyData
    },
    centerCoordinatesData(state) {
      return state.centerCoordinates
    },
    userCoordinatesData(state) {
      return state.userCoordinates
    },
    isOpen(state) {
      return state.isOpen
    }
  }
})
