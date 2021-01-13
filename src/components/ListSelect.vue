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
  .switch(:class='["fas",{"fa-chevron-right":!isOpen},{"fa-chevron-left":isOpen}]' @click='handleOpen' )
</template>

<style lang='stylus' scoped>
@import '../css/style.styl'
.list-select
  flexCenter(center,center,)
  size(30%,auto)
  background-color #35cafc
  border-radius 0 0 16px 0
  box-shadow -4px 4px 8px rgba(0,0,0,0.5)
  padding-right 16px
  position absolute
  top 0
  left calc(-30% + 40px)
  transition 0.5s
  z-index 999
  &.open
    left 0vw

  .switch
    flexCenter(center,flex-start)
    font-size 1.4rem
    padding 8px
    position absolute
    right 0
    color #fff
    transition 0.5s
    cursor pointer
    z-index 999  
  .city,.area
    flexCenter()
    color #fff
    line-height 32px
    margin 8px
    font-size 1rem
    h2
      margin-right 8px
    select
      font-size 1rem
  

@media screen and (max-width 280px)
  .list-select
    size(100%,auto)
    left calc(-100% + 32px)
    .city,.area
      flexCenter(,,column)
      margin 4px
      h2
        font-size 1 rem


@media screen and (max-width 540px)
  .list-select
    font-size 0.5rem
    size(100%,auto)
    left calc(-100% + 1.2rem)
    .city,.area
      font-size 0.7rem
      // select
      //   font-size 0.6rem

@media screen and (min-width 421px)
  .list-select
    size(420px,auto)
    left -420px + 32px
    font-size 0.6rem
      
</style>