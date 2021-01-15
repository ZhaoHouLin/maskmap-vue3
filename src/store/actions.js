import { apiGetMaskData, apiGetLatLonDistance } from '../api'

export default {
  commitCenterCoordinates({ commit }, payload) {
    commit('stateCenterCoordinates', payload)
  },
  commitUserCoordinates({ commit }, payload) {
    commit('stateUserCoordinates', payload)
  },
  commitNearPharmacy({ state, commit }) {
    state.nearPharmacyData = []
    let λA = state.userCoordinates.latitude
    let ΦA = state.userCoordinates.longitude
    state.maskData.filter((item) => {               //篩選距離1公里內的藥局
      let λB = item.geometry.coordinates[1]
      let ΦB = item.geometry.coordinates[0]
      let distance = apiGetLatLonDistance(λA, ΦA, λB, ΦB)
      if (distance < 1) {
        commit('stateNearPharmacy', item)
      }
    })
  },
  async getMaskAPI({ commit }, payload) {           //取得藥局口罩相關資料
    try {
      const res = await apiGetMaskData()
      this.state.filterMaskData = []
      res.data.features.filter((item) => {
        if (item.properties.county === payload.city && item.properties.town === payload.area) {
          commit('stateFilterMaskData', item)
        }
      })
      commit('stateMaskData', res.data.features)
    } catch (error) {
      console.error(error)
    }
  },
  filterCityArea({ state, commit }, payload) {       //篩選各縣市行政區內的藥局
    state.filterMaskData = []
    state.maskData.filter((item) => {
      if (item.properties.county === payload[0] && item.properties.town === payload[1]) {
        commit('stateFilterMaskData', item)
      }
    })
  },
  commitIsOpen({ commit }) {
    commit('stateIsOpen')
  }
}