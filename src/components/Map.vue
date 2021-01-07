<script>
import Leaflet from 'leaflet'
import { onMounted, ref, reactive, computed, onUpdated} from 'vue'
import {useStore} from 'vuex'
import {apiGetLatLonDistance} from '../api'

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

    const select = reactive(
      {
        city: '臺北市',
        area: '中正區',
      }
    )

    const zoom = ref(15)
    const iconWidth = ref(25)
    const iconHeight = ref(40)

    const filterMaskData = computed(()=> {
      return store.getters.filterMaskData
    })

    const nearPharmacyData = computed(()=> {
      return store.getters.nearPharmacyData
    })

    const centerCoordinatesData = computed(()=> {
      return store.getters.centerCoordinatesData
    })

    const userCoordinatesData = computed(()=> {
      return store.getters.userCoordinatesData
    })

    const iconUrl = computed(()=> {
      return `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png`
    })

    const actIconUrl = computed(()=> {
      return `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png`
    })

    const iconSize = computed(()=> {
      return [iconWidth.value, iconHeight.value]
    })

    const reCenter = (coordinates) => { //選擇藥局後地圖自動移動中心
      let latitude  = coordinates[1]
      let longitude  = coordinates[0]
      console.log(latitude,longitude);
      store.dispatch('commitCenterCoordinates',{latitude,longitude})
    }

    const distance = (λB, ΦB)=> {
      let λA = store.getters.userCoordinatesData.latitude
      let ΦA = store.getters.userCoordinatesData.longitude
      return apiGetLatLonDistance(λA,ΦA,λB,ΦB)
    }

    const log = (a) => {
      // console.log(a)
    }

    return {
      select,
      filterMaskData,
      nearPharmacyData,
      centerCoordinatesData,
      userCoordinatesData,
      zoom,
      iconUrl,
      actIconUrl,
      iconSize,
      iconWidth,
      iconHeight,
      log,
      distance,
      reCenter
    }
  }
}
</script>

<template lang='pug'>
.map
  l-map(
    ref="map"
    :zoom="zoom" 
    :center="[centerCoordinatesData.latitude,centerCoordinatesData.longitude]"
    @move="log('move')" 
  )
    l-tile-layer(url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    .lMarker(v-for='(item,key) in filterMaskData')
      l-marker( :key='key' v-if='item.properties.county === select.city && item.properties.town === select.area' :lat-lng='[item.geometry.coordinates[1],item.geometry.coordinates[0]]' @click='reCenter(item.geometry.coordinates)' )
        l-icon(:icon-url="$route.params.id===item.properties.name?actIconUrl:iconUrl" :icon-size="iconSize" )
        //- l-icon(:icon-url="distance(item.geometry.coordinates[1],item.geometry.coordinates[0])<1?actIconUrl:iconUrl" :icon-size="iconSize" )
        l-popup
          h2 {{item.properties.name}}
          h3 成人口罩: {{item.properties.mask_adult?item.properties.mask_adult+'個':'未取得資料'}}
          h3 兒童口罩: {{item.properties.mask_child?item.properties.mask_child+'個':'未取得資料'}}
          h3 
            | 地址: 
            a(:href='`https://www.google.com.tw/maps/place/${item.properties.address}`' target='_blank' title='Google Map') {{ item.properties.address }} 
            h4 距離: {{distance(item.geometry.coordinates[1],item.geometry.coordinates[0])* 1000 + '公尺'}}
          l-tooltip
            h3 成人: {{item.properties.mask_adult?item.properties.mask_adult+'個':'未取得資料'}}
            h3 兒童: {{item.properties.mask_child?item.properties.mask_child+'個':'未取得資料'}}
            h3 距離: {{distance(item.geometry.coordinates[1],item.geometry.coordinates[0])* 1000 + '公尺'}} 
            
    l-marker(:lat-lng='[userCoordinatesData.latitude,userCoordinatesData.longitude]' @click='reCenter([userCoordinatesData.longitude,userCoordinatesData.latitude])')
      l-icon(:icon-url='`https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png`' :icon-size="iconSize")
      l-tooltip.tooltip(:options="{interactive: true,permanent: true}" ) 你在這

    .lMarker(v-for='(item,key) in nearPharmacyData')
      l-marker(:key='key' :lat-lng='[item.geometry.coordinates[1],item.geometry.coordinates[0]]' @click='reCenter(item.geometry.coordinates)' )
        l-icon(:icon-url="`https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png`" :icon-size="iconSize" )
        l-popup
          h2 {{item.properties.name}}
          h3 成人口罩: {{item.properties.mask_adult?item.properties.mask_adult+'個':'未取得資料'}}
          h3 兒童口罩: {{item.properties.mask_child?item.properties.mask_child+'個':'未取得資料'}}
          h3 
            | 地址: 
            a(:href='`https://www.google.com.tw/maps/place/${item.properties.address}`' target='_blank' title='Google Map') {{ item.properties.address }} 
            h4 距離: {{distance(item.geometry.coordinates[1],item.geometry.coordinates[0])* 1000 + '公尺'}}
          l-tooltip
            h3 成人: {{item.properties.mask_adult?item.properties.mask_adult+'個':'未取得資料'}}
            h3 兒童: {{item.properties.mask_child?item.properties.mask_child+'個':'未取得資料'}}
            h3 距離: {{distance(item.geometry.coordinates[1],item.geometry.coordinates[0])* 1000 + '公尺'}} 
</template>

<style lang='stylus' scoped>
@import '../css/style.styl'
.map
  flexCenter()
  size()

  
</style>