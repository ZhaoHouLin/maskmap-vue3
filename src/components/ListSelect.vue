<script>
import cityName from '../assets/cityName.json'
import { onMounted, ref, reactive, computed, onUpdated} from 'vue'
import { useStore } from 'vuex'
import { apiGetCommonFn } from '../api'
export default {
  setup() {
    const store = useStore()
    const {
      selectList,
      isOpen,
      filterMaskData,
      userCoordinatesData,
      reCenter
    } = apiGetCommonFn()
    const initMaskData = (city,area) => {
      store.dispatch('getMaskAPI',{city,area}).then(()=> {
        getLocation() //取得資料後再取得所在位置
      })
    }
    const filterCityArea = (city,area) => {
      store.dispatch('filterCityArea',[city,area])
    }
    const getLocation = () => {   //抓取目前地理位置
      if ('geolocation' in navigator) {
        let possition = navigator.geolocation.getCurrentPosition((pos)=> {
          let latitude = pos.coords.latitude
          let longitude = pos.coords.longitude
          store.dispatch('commitUserCoordinates',{latitude,longitude})
          store.dispatch('commitNearPharmacy')
        })
      }
    }

    onMounted(()=> {
      initMaskData(selectList.city,selectList.area)
    }) 

    return {
      filterMaskData,
      filterCityArea,
      cityName,
      selectList,   
      reCenter,
      isOpen,
      userCoordinatesData
    }
  }
}
</script>

<template lang='pug'>
.list-select(@change='filterCityArea(selectList.city,selectList.area), reCenter(filterMaskData[0].geometry.coordinates)' :class='[{"open": isOpen}]')
  .city
    h2 縣市: 
    select(v-model='selectList.city')
      option 請選擇縣市
      option(v-for='city in cityName' :value='city.CityName' :key='city.CityName') {{city.CityName}}
  .area
    h2 地區: 
    select(v-model='selectList.area' )
      option 請選擇地區
      option(v-for='area in cityName.find((city)=>city.CityName===selectList.city).AreaList' :value='area.AreaName' :key='area.AreaName' ) {{area.AreaName}}
  

</template>

<style lang='stylus' scoped>
@import '../css/style.styl'
.list-select
  flexCenter()
  size(30%,auto)
  background-color rgba(255,255,255,0.8)
  border-radius 0 0 0 16px
  box-shadow -4px 4px 8px rgba(0,0,0,0.5)
  position absolute
  top 0
  right -100vh
  transition 0.5s
  z-index 999
  &.open
    right 0vh
  .city,.area
    flexCenter()
    margin 8px
    h2
      margin-right 8px
  


@media screen and (max-width 420px)
  .list-select
    font-size 0.6rem
    size(auto,auto)

@media screen and (max-width 1024px)
  .list-select
    font-size 0.6rem
    size(auto,auto)

@media screen and (max-width 1360px)
  .list-select
    font-size 0.6rem
    size(auto,auto)

</style>