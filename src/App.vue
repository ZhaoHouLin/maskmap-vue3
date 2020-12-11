<script>
import cityName from './assets/cityName.json'
import axios from 'axios'
import Leaflet from 'leaflet'
import { onMounted, ref, reactive, computed ,watch} from 'vue'
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
    const zoom = ref(12)
    const iconWidth = ref(25)
    const iconHeight = ref(40)


    let maskData = ref([])
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

    onMounted(()=> {
      const api = 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json'
      axios
        .get(api)
        .then((res) => {
          maskData.value = res.data.features
        })
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
      log
    }
  }
}
</script>

<template lang='pug'>
#app
  .left
    .city
      h2 縣市: 
      select(v-model='select.city')
        option 請選擇縣市
        option(v-for='city in cityName' :value='city.CityName' :key='city.CityName') {{city.CityName}}
    .area
      h2 地區: 
      select(v-model='select.area')
        option 請選擇地區
        option(v-for='area in cityName.find((city)=>city.CityName===select.city).AreaList' :value='area.AreaName' :key='area.AreaName') {{area.AreaName}}
    .pharmacy
      .info(v-for='(item,key) in maskData')
        a(:key='key' v-if='item.properties.county === select.city && item.properties.town === select.area')
          h3 {{ item.properties.name }}
          p 成人口罩: {{ item.properties.mask_adult}} | 兒童口罩: {{ item.properties.mask_child}}
          p 
            | 地址: 
            a(:href='`https://www.google.com.tw/maps/place/${item.properties.address}`' target='_blank' title='Google Map') {{ item.properties.address }}
  .map
    l-map(v-model="zoom"
        v-model:zoom="zoom"
        :center="[25.043293,121.5205653]"
        @move="log('move')")
      l-tile-layer(url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
      .lMarker(v-for='(item,key) in maskData')
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
#app
  flexCenter()
  overflow hidden
  .left
    size(30%)
    // flexCenter()
    // flex-direction column
    .city,.area,.pharmacy
      flexCenter()
    .pharmacy
      flex-direction column
      overflow-x hidden
      overflow-y scroll
      .info
        size(100%,auto)

  .map
    size(70%,100vh)

</style>
