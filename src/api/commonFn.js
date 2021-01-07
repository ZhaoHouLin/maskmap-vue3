import { computed } from 'vue'
import { useStore } from 'vuex'


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

  return {
    selectList,
    isOpen,
    filterMaskData,
    userCoordinatesData,
    centerCoordinatesData,
    nearPharmacyData,
    reCenter
  }

}

export const getCommonFn = commonFn