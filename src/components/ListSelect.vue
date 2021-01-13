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
    const handleOpen = () => {
      store.dispatch('commitIsOpen')
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
      userCoordinatesData,
      handleOpen
    }
  }
}
</script>

<template lang='pug'>
.list-select(@change='filterCityArea(selectList.city,selectList.area), reCenter(filterMaskData[0].geometry.coordinates)' :class='[{"open": isOpen}]')
  .switch(:class='["fas",{"fa-chevron-left":!isOpen},{"fa-chevron-right":isOpen}]' @click='handleOpen' )
  .city
    h2 縣市
    select(v-model='selectList.city')
      option 請選擇縣市
      option(v-for='city in cityName' :value='city.CityName' :key='city.CityName') {{city.CityName}}
  .area
    h2 地區
    select(v-model='selectList.area' )
      option 請選擇地區
      option(v-for='area in cityName.find((city)=>city.CityName===selectList.city).AreaList' :value='area.AreaName' :key='area.AreaName' ) {{area.AreaName}}
  

</template>

<style lang='stylus' scoped>
@import '../css/style.styl'
.list-select
  flexCenter(flex-start,center,)
  size(30%,auto)
  background-color rgba(255,255,255,1)
  border-radius 0 0 0 16px
  box-shadow -4px 4px 8px rgba(0,0,0,0.5)
  position absolute
  top 0
  right calc(-30% + 32px)
  transition 0.5s
  z-index 999
  &.open
    right 0vw

  .switch
    // position absolute
    flexCenter(center,flex-start)
    // top 0
    // right 100%
    font-size 32px
    padding 8px
    color color-green
    transition 0.5s
    cursor pointer
    z-index 999  
  .city,.area
    flexCenter()
    // border 1px solid #000
    color color-green
    line-height 32px
    margin 8px
    h2
      margin-right 8px
    select
      font-size 1rem
  



@media screen and (max-width 280px)
  .list-select
    size(100%,auto)
    right calc(-100% + 32px)
    .city,.area
      flexCenter(,,column)
      margin 4px
      h2
        font-size 1 rem


@media screen and (max-width 540px)
  .list-select
    font-size 0.5rem
    size(100%,auto)
    right calc(-100% + 32px)
    .city,.area
      select
        font-size 0.6rem

@media screen and (min-width 421px)
  .list-select
    size(420px,auto)
    right -420px + 32px
    font-size 0.6rem
      
</style>