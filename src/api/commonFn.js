import { computed } from 'vue'
import { useStore } from 'vuex'
import { apiGetLatLonDistance } from '../api'

const commonFn = () => {

  const store = useStore()

  const selectList = computed(() => {                 //縣市地區選單
    return store.getters.selectList
  })

  const isOpen = computed(() => {                     //清單是否打開
    return store.getters.isOpen
  })
  
  const filterMaskData = computed(() => {             //地區口罩資料
    return store.getters.filterMaskData
  })

  const userCoordinatesData = computed(() => {        //使用者所在座標資料
    return store.getters.userCoordinatesData
  })
  
  const centerCoordinatesData = computed(() => {       //藥局座標資料
    return store.getters.centerCoordinatesData
  })

  const nearPharmacyData = computed(() => {
    return store.getters.nearPharmacyData
  })

  const reCenter = (coordinates) => {                 //選擇藥局後地圖自動移動中心
    store.dispatch('commitCenterCoordinates', { 
      latitude: coordinates[1], 
      longitude: coordinates[0]
    })
  }

  const getLocation = () => {                         
    if ('geolocation' in navigator) {                 //測試地理位置定位是否存在
      navigator.geolocation.getCurrentPosition((pos) => { //取得使用者目前經緯度
        let latitude = pos.coords.latitude
        let longitude = pos.coords.longitude
        store.dispatch('commitUserCoordinates', { latitude, longitude })
        store.dispatch('commitNearPharmacy')
      })
    }
  }

  const distance = (λB, ΦB) => {                      //取得藥局經緯度後與使用者經緯度一起帶入公式計算距離
    let λA = store.getters.userCoordinatesData.latitude
    let ΦA = store.getters.userCoordinatesData.longitude
    return apiGetLatLonDistance(λA, ΦA, λB, ΦB)
  }


  return {
    selectList,
    isOpen,
    filterMaskData,
    userCoordinatesData,
    centerCoordinatesData,
    nearPharmacyData,
    reCenter,
    getLocation,
    distance
  }

}

export const getCommonFn = commonFn