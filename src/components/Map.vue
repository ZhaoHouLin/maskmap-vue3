<script>
import Leaflet from 'leaflet'
import { onMounted, ref, reactive, computed} from 'vue'
import { useStore } from 'vuex'
import { apiGetCommonFn } from '../api'
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
  LControlZoom
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
    LControlZoom
  },

  setup() {

    const store = useStore()

    const { 
      selectList,
      filterMaskData,
      nearPharmacyData,
      centerCoordinatesData ,
      userCoordinatesData,
      reCenter,
      getLocation,
      distance
    } = apiGetCommonFn()

    const zoom = ref(16)

    const iconWidth = ref(25)
    const iconHeight = ref(40)
    const iconUrl = computed(()=> {
      return `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png`
    })
    const actIconUrl = computed(()=> {
      return `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png`
    })
    const nearIconUrl = computed(()=> {
      return `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png`
    })
    const iconSize = computed(()=> {
      return [iconWidth.value, iconHeight.value]
    })

    const log = (a) => {
      // console.log(a)
    }

    const tileProviders = reactive({
      maxZoom: 20,
      attribution: `&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> | created by <a target="_blank" href="https://zhaohoulin.github.io/myP5jsWork/#/">ZZ 炤炤</a>` 
    })
    
    
    return {
      selectList,
      filterMaskData,
      nearPharmacyData,
      centerCoordinatesData,
      userCoordinatesData,
      zoom,
      iconUrl,
      actIconUrl,
      nearIconUrl,
      iconSize,
      iconWidth,
      iconHeight,
      log,
      distance,
      reCenter,
      getLocation,
      tileProviders
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
    :options='{zoomControl: false}'
  )
    l-control-zoom(position='bottomright' zoomControl='false')
    l-tile-layer(url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" :attribution="tileProviders.attribution")
    .lMarker(v-for='(item,key) in filterMaskData')
      l-marker( :key='key' v-if='item.properties.county === selectList.city && item.properties.town === selectList.area' :lat-lng='[item.geometry.coordinates[1],item.geometry.coordinates[0]]' @click='reCenter(item.geometry.coordinates)' )
        l-icon(:icon-url="$route.params.id===item.properties.name?actIconUrl:distance(item.geometry.coordinates[1],item.geometry.coordinates[0])<1?nearIconUrl:iconUrl" :icon-size="iconSize" )
        l-popup
          .title
            i.fas.fa-pills
            h1 {{item.properties.name}}
          .mask-quantity
            .mask-adult
              h4 成人口罩 
              h3 {{item.properties.mask_adult?item.properties.mask_adult+'個':'未取得資料'}}
            .mask-child
              h4 兒童口罩
              h3 {{item.properties.mask_child?item.properties.mask_child+'個':'未取得資料'}}
          .info 
            h2 {{item.properties.phone}} 
            h2
              i.fas.fa-map-marked-alt
              a(:href='`https://www.google.com.tw/maps/place/${item.properties.address}`' target='_blank' title='Google Map') {{ item.properties.address }} 

            .distance
              h2 距離您 
              h3(:class='[{"green": distance(item.geometry.coordinates[1],item.geometry.coordinates[0])* 1000<1000 }]') {{distance(item.geometry.coordinates[1],item.geometry.coordinates[0])* 1000 }} 
              h2 公尺

            h2 備註: 
              h4 {{item.properties.note}}
            h4 更新時間: {{item.properties.updated}}
            
    l-marker(:lat-lng='[userCoordinatesData.latitude,userCoordinatesData.longitude]' @click='reCenter([userCoordinatesData.longitude,userCoordinatesData.latitude])')
      l-icon(:icon-url='`https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png`' :icon-size="iconSize")
      l-tooltip.tooltip(:options="{interactive: true,permanent: true,direction: 'top'}" ) 您的位置

    .lMarker(v-for='(item,key) in nearPharmacyData')
      l-marker(:key='key' :lat-lng='[item.geometry.coordinates[1],item.geometry.coordinates[0]]' @click='reCenter(item.geometry.coordinates)')
        l-icon(:icon-url="`https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png`" :icon-size="iconSize" )
        l-popup
          .title
            i.fas.fa-pills
            h1 {{item.properties.name}}
          .mask-quantity
            .mask-adult
              h4 成人口罩 
              h3 {{item.properties.mask_adult?item.properties.mask_adult+'個':'未取得資料'}}
            .mask-child
              h4 兒童口罩
              h3 {{item.properties.mask_child?item.properties.mask_child+'個':'未取得資料'}}
          .info 
            h2 {{item.properties.phone}} 
            h2
              i.fas.fa-map-marked-alt
              a(:href='`https://www.google.com.tw/maps/place/${item.properties.address}`' target='_blank' title='Google Map') {{ item.properties.address }}
              
            .distance
              h2 距離您 
              h3(:class='[{"green": distance(item.geometry.coordinates[1],item.geometry.coordinates[0])* 1000<1000 }]') {{distance(item.geometry.coordinates[1],item.geometry.coordinates[0])* 1000 }} 
              h2 公尺

            h2 備註: 
              h4 {{item.properties.note}}
            h4 更新時間: {{item.properties.updated}}
          
          //- l-tooltip
          //-   h3 成人: {{item.properties.mask_adult?item.properties.mask_adult+'個':'未取得資料'}}
          //-   h3 兒童: {{item.properties.mask_child?item.properties.mask_child+'個':'未取得資料'}}
          //-   h3 距離: {{distance(item.geometry.coordinates[1],item.geometry.coordinates[0])* 1000 + '公尺'}} 

.user-loaction(:class='["fas","fa-street-view"]' @click='getLocation(),reCenter([userCoordinatesData.longitude,userCoordinatesData.latitude])')
</template>

<style lang='stylus'>
@import '../css/style.styl'

.map
  flexCenter()
  size()

.leaflet-tooltip.leaflet-zoom-hide.leaflet-clickable.leaflet-tooltip-top
  bottom -30px

.tooltip
  font-size 1.5rem
  font-weight bold

.leaflet-container a.leaflet-popup-close-button
  font-size 24px
  color #fff
  top 12px
  right 16px
  &:hover
    color #222

.leaflet-popup-content-wrapper
  size(auto,auto)
  border-radius 32px
  padding 0
  padding-bottom 8px
  .leaflet-popup-content
    border-radius 32px
    margin 0
 
.title
  border-radius 16px 16px 0 0
  flexCenter(flex-start,center,)
  size(100%,auto)
  background-color color-green
  padding 8px 16px
  i 
    font-size 16px
    color #fff
  h1
    margin-left 8px
    color #fff
    
.mask-quantity
  flexCenter()
  .mask-adult,.mask-child
    size(100%,auto)
    padding 12px
    flexCenter(flex-start,center,column)
    h4
      font-size 18px
    h3
      font-size 24px
      color #fff
      
  .mask-adult
    background-color color-blue
  .mask-child 
    background-color color-yellow

.info
  margin-top 8px
  padding 0 16px
  h2
    margin 4px 0
    a
      font-size 16px
      font-weight 600
    i
      color color-green
      margin-right 8px
    h4
      display inline-block
      font-size 16px
      font-weight 500
    h2
      display inline-block
  .distance
    flexCenter(flex-start,flex-start,)
    line-height 36px
    h2,h3
      margin-right 4px
    h2 
      font-weight 500
    h3
      color red
      font-size 24px
      &.green
        color color-green

.user-loaction
  color color-yellow
  right 2px
  bottom 88px
  right 2px
  position absolute
  font-size 36px
  padding 8px
  cursor pointer
  z-index 9999
  text-shadow 2px 2px 4px rgba(0,0,0,0.5)
  -webkit-text-stroke 1.6px black
  
// @media screen and (max-width 1024px)
//   .user-loaction
//     bottom 36px
</style>