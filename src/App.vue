<script>
import cityName from './assets/cityName.json'
import Leaflet from 'leaflet'
import { onMounted, ref, reactive, computed ,watch, onUpdated} from 'vue'
import {useStore} from 'vuex'
import {useRoute} from 'vue-router'
import {
  LMap,
  LIcon,
  LTileLayer,
  LMarker,
  LControlLayers,
  LTooltip,
  LPopup,
  LPolyline,
  LPolygon,
  LRectangle,
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";


export default {

  components: {
    LMap,
    LIcon,
    LTileLayer,
    LMarker,
    LControlLayers,
    LTooltip,
    LPopup,
    LPolyline,
    LPolygon,
    LRectangle,
  },

  setup() {

    const route = useRoute()
    const store = useStore()
    const zoom = ref(15)
    const center = ref([25.043293,121.5205653])
    const userPos = reactive({

    })
    const iconWidth = ref(25)
    const iconHeight = ref(40)
    const isOpen =ref(false)

    const maskData = computed(()=> {
      return store.getters.maskData
    })

    const filterMaskData = computed(()=> {
      return store.getters.filterMaskData
    })
    
    const select = reactive(
      {
        city: '臺北市',
        area: '中正區',
      }
    )

    const iconUrl = computed(()=> {
      return `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png`
    })

    const actIconUrl = computed(()=> {
        return `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png`
    })

    const iconSize = computed(()=> {
      return [iconWidth.value, iconHeight.value]
    })

    const log = (a) => {
      console.log(a)
    }

    const newCenter = computed(() => { //回傳選擇的藥局座標
      return [center.value[0],center.value[1]]
    })

    const reCenter = (coordinates) => { //選擇藥局後地圖自動移動中心
      center.value[0]=coordinates[1]
      center.value[1]=coordinates[0]
    }

    const initMaskData = (city,area) => {
      const api = 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json'
      store.dispatch('getMaskAPI',{api,city,area})
    }

    const getLocation = () => {   //抓取目前地理位置
      if ('geolocation' in navigator) {//
       let possition = navigator.geolocation.getCurrentPosition((pos)=> {
          userPos.latitude = pos.coords.latitude
          userPos.longitude = pos.coords.longitude

          center.value[0] = userPos.latitude
          center.value[1] = userPos.longitude
       })
      }
    }

    const filterCityArea = (city,area) => {
      store.dispatch('filterCityArea',[city,area])
    }

    const handleOpen = () => {
      isOpen.value = !isOpen.value
    }

    onMounted(()=> {
        initMaskData(select.city,select.area)
        getLocation()
    })    

    return {
      maskData,
      cityName,
      select,
      zoom,
      iconWidth,
      iconHeight,
      iconUrl,
      actIconUrl,
      iconSize,
      log,
      center,
      reCenter,
      newCenter,
      filterCityArea,
      filterMaskData,
      isOpen,
      handleOpen,
      getLocation,
      userPos
    }
  }
}
</script>

<template lang='pug'>
.content
  .map
    l-map(
      ref="map"
        :zoom="zoom" 
        :center="newCenter"
        @move="log('move')" 
        )
      l-tile-layer(url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
      .lMarker(v-for='(item,key) in filterMaskData')
        l-marker( :key='key' v-if='item.properties.county === select.city && item.properties.town === select.area' :lat-lng='[item.geometry.coordinates[1],item.geometry.coordinates[0]]' @click='reCenter(item.geometry.coordinates)' )
          l-icon(:icon-url="$route.params.id===item.properties.name?actIconUrl:iconUrl" :icon-size="iconSize" )
          l-popup()
            h2 {{item.properties.name}}
            h3 成人口罩: {{item.properties.mask_adult?item.properties.mask_adult+'個':'未取得資料'}}
            h3 兒童口罩: {{item.properties.mask_child?item.properties.mask_child+'個':'未取得資料'}}
            h3 
              | 地址: 
              a(:href='`https://www.google.com.tw/maps/place/${item.properties.address}`' target='_blank' title='Google Map') {{ item.properties.address }} 
      l-marker(:lat-lng='[userPos.latitude,userPos.longitude]' @click='reCenter([userPos.longitude,userPos.latitude])')
        l-icon(:icon-url='`https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png`' :icon-size="iconSize")
        l-tooltip.tooltip(:options="{interactive: true,permanent: true}") 你在這

  .list-select(@change='filterCityArea(select.city,select.area), reCenter(filterMaskData[0].geometry.coordinates)' :class='[{"open": isOpen}]')
    .city
      h2 縣市: 
      select(v-model='select.city')
        option 請選擇縣市
        option(v-for='city in cityName' :value='city.CityName' :key='city.CityName') {{city.CityName}}
    .area
      h2 地區: 
      select(v-model='select.area' )
        option 請選擇地區
        option(v-for='area in cityName.find((city)=>city.CityName===select.city).AreaList' :value='area.AreaName' :key='area.AreaName' ) {{area.AreaName}}
    .switch(:class='["fas",{"fa-chevron-down":!isOpen},{"fa-chevron-up":isOpen}]' @click='handleOpen' )

  .list(:class='[{"open": isOpen}]')
    .pharmacy
      router-link.info(v-for='(item,key) in filterMaskData' 
      @click='reCenter(item.geometry.coordinates)'
      :to='`/${item.properties.name}`'
      )
  
        h3 {{ item.properties.name }}
        p 成人口罩: {{ item.properties.mask_adult}} | 兒童口罩: {{ item.properties.mask_child}}
        p 
          | 地址: 
          a(:href='`https://www.google.com.tw/maps/place/${item.properties.address}`' target='_blank' title='Google Map') {{ item.properties.address }}
      router-view
</template>

<style lang="stylus" scoped>
@import './css/style.styl'
.content 
  overflow hidden
  .tooltip
    font-size 1rem
  .popup
    > .leaflet-popup
      opacity 1
  .map
    flexCenter()
    size()

  .list-select
    flexCenter()
    size(30%,auto)
    background-color rgba(255,255,255,0.8)
    border-radius 0 0 0 16px
    box-shadow -4px 4px 8px rgba(0,0,0,0.5)
    position absolute
    top 0
    right 0
    transition 0.5s
    z-index 999
    // &.open
    //   right 30%
    .city,.area
      flexCenter()
      margin 8px
      h2
        margin-right 8px
    .switch
      flexCenter(center,flex-start)
      top 0
      right 0
      font-size 48px
      padding 8px 8px
      color #222
      transition 0.5s
      cursor pointer
      z-index 999

  .list
    background-color rgba(255,255,255,0.8)
    position absolute
    top -100vh
    right 0
    z-index 999
    size(30%,100vh)
    flexCenter(,,column)
    transition 0.5s
    &.open
      top 10vh
      size(30%,90vh)
      
    .pharmacy
      cursor pointer
      size()
      flexCenter(flex-start,center)
      flex-direction column
      overflow auto

      .info
        color #222
        size(100%,auto)
        padding 4px 16px
        &:hover
          background-color #C8FACC
        &.router-link-active
          background-color #C8FACC


@media screen and (max-width 420px)
  .content
    .list-select
      font-size 0.6rem
      size(auto,auto)
    .list
      font-size 0.6rem
      size(100%,90vh)
      &.open
        top 10vh
        size(100%,90vh)

@media screen and (max-width 1024px)
  .content
    .list-select
      font-size 0.6rem
      size(auto,auto)
    .list
      font-size 0.6rem
      &.open
        top 10vh

@media screen and (max-width 1360px)
  .content
    .list-select
      font-size 0.6rem
      size(auto,auto)
    .list
      font-size 0.6rem
      &.open
        top 10vh

</style>
