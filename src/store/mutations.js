export default {
  stateUserCoordinates(state, payload) {
    state.centerCoordinates = payload
      state.userCoordinates = payload
  },
  stateCenterCoordinates(state, payload) {
    state.centerCoordinates = payload
  },
  stateNearPharmacy(state, payload) {
    state.nearPharmacyData.push(payload)
    state.filterMaskData = state.nearPharmacyData
  },
  stateMaskData(state, payload) {
    state.maskData = payload
  },
  stateFilterMaskData(state, payload) {
    state.filterMaskData.push(payload)
  },
  stateIsOpen(state) {
    state.isOpen = !state.isOpen
  }
}