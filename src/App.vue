<script>
import cityName from './assets/cityName.json'
import Leaflet from 'leaflet'
import { onMounted, ref, reactive, computed ,watch, onUpdated} from 'vue'
import {useStore} from 'vuex'
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

    const store = useStore()
    const zoom = ref(12)
    const center = ref([25.043293,121.5205653])
    const iconWidth = ref(25)
    const iconHeight = ref(40)

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
      return `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png`
    })

    const iconSize = computed(()=> {
      return [iconWidth.value, iconHeight.value]
    })

    const changeIcon = () => {
      iconWidth.value += 2;
      if (iconWidth.value > iconHeight.value) {
        iconWidth.value = Math.floor(iconHeight.value / 2);
      }
    }

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

    const initMaskData = () => {
      const api = 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json'
      store.dispatch('getMaskAPI',api)
    }

    const filterCityArea = (city,area) => {
      store.dispatch('filterCityArea',[city,area])
    }

    onMounted(()=> {
        initMaskData()
    })    


    return {
      maskData,
      cityName,
      select,
      zoom,
      iconWidth,
      iconHeight,
      iconUrl,
      iconSize,
      changeIcon,
      log,
      center,
      reCenter,
      newCenter,
      filterCityArea,
      filterMaskData
    }
  }
}
</script>

<template lang='pug'>
.content
  .list
    .list-select(@change='filterCityArea(select.city,select.area)')
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
    .pharmacy
      .info(v-for='(item,key) in filterMaskData' @click='reCenter(item.geometry.coordinates)')
        a(:key='key' v-if='item.properties.county === select.city && item.properties.town === select.area')
          h3 {{ item.properties.name }}
          p 成人口罩: {{ item.properties.mask_adult}} | 兒童口罩: {{ item.properties.mask_child}}
          p 
            | 地址: 
            a(:href='`https://www.google.com.tw/maps/place/${item.properties.address}`' target='_blank' title='Google Map') {{ item.properties.address }}
  .map
    l-map(
      ref="map"

        :zoom="zoom" 
        :center="newCenter"
        @move="log('move')")
      l-tile-layer(url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
      .lMarker(v-for='(item,key) in filterMaskData')
        l-marker( :key='key' v-if='item.properties.county === select.city && item.properties.town === select.area' :lat-lng='[item.geometry.coordinates[1],item.geometry.coordinates[0]]'  )
          l-icon(:icon-url="iconUrl" :icon-size="iconSize")
          l-popup
            h2 {{item.properties.name}}
            h2 口罩剩餘：
            h3 成人: {{item.properties.mask_adult?item.properties.mask_adult+'個':'未取得資料'}}
            h3 兒童: {{item.properties.mask_child?item.properties.mask_child+'個':'未取得資料'}}
            h3 
              | 地址: 
              a(:href='`https://www.google.com.tw/maps/place/${item.properties.address}`' target='_blank' title='Google Map') {{ item.properties.address }} 

</template>

<style lang="stylus" scoped>
@import './css/style.styl'
.content
  flexCenter()
  overflow hidden
  font-display row-reverse
  .list
    background-color #fff
    size(30%)
    flexCenter()
    flex-direction column
    .list-select
      // position absolute
      flexCenter()
      .city,.area
        flexCenter()
        margin 8px
    .pharmacy
      size()
      flexCenter()
      flex-direction column
      overflow auto
      padding-left 16px
      // margin-top 32px
      .info
        size()

  .map
    // position absolute
    size()

</style>
