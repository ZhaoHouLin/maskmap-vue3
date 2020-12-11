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
    // const zoom = ref(12)
    // const iconWidth = ref(25)
    // const iconHeight = ref(40)


    let maskData = ref([])
    const select = reactive(
      {
        city: '臺北市',
        area: '中正區',
      }
    )
    
    let openStreetMap = ref({})
    // const iconUrl = computed(()=> {
    //   return `https://placekitten.com/${iconWidth.value}/${iconHeight.value}`
    // })

    // const iconSize = computed(()=> {
    //   return [iconWidth.value, iconHeight.value]
    // })

    onMounted(()=> {
      const api = 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json'
      axios
        .get(api)
        .then((res) => {
          // console.log(res.data.features);
          maskData.value = res.data.features
          console.log(maskData.value)
          // maskData.push(res.data.features)
          // console.log(maskData.value[0].properties);
          // console.log('maskData1:',maskData[0]);
        })

      openStreetMap.value = Leaflet.map('map',{
        center: [25.043293,121.5205653],
        zoom: 12,
      })

      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 20,
      }).addTo(openStreetMap.value)

    })


    const pharmacies = computed(()=> {
      // console.log('maskData2:',maskData);
      // return maskData.filter((pharmacy) => {
      //   if (!select.area) {
      //     console.log('pharmacy:',pharmacy.properties);
      //     return pharmacy.properties.county === select.city;
      //   }
      //   return pharmacy.properties.town === select.area;
      // })
    })


    // const updateMap = ()=> {
    //   openStreetMap.value.eachLayer((layer) => {
    //     if (layer instanceof Leaflet.Marker) {
    //       openStreetMap.value.removeLayer(layer);
    //     }
    //   })

    //   pharmacies.forEach((pharmacy) => {
    //     // 透過藥局經緯度疊加標記
     
    //     Leaflet.marker([
    //       pharmacy.geometry.coordinates[1],
    //       pharmacy.geometry.coordinates[0],
    //     ]).addTo(openStreetMap.value).bindPopup(`<p><strong style="font-size: 20px;">${pharmacy.properties.name}</strong></p>
    //       <strong style="font-size: 16px; color: #d45345;">口罩剩餘：成人 - ${pharmacy.properties.mask_adult ? `${pharmacy.properties.mask_adult} 個` : '未取得資料'} / 兒童 - ${pharmacy.properties.mask_child ? `${pharmacy.properties.mask_child} 個` : '未取得資料'}</strong><br>
    //       地址: ${pharmacy.properties.address}<br>
    //       電話: ${pharmacy.properties.phone}<br>
    //       <small>最後更新時間: ${pharmacy.properties.updated}</small>`)
    //   });
    // }

    // watch(()=> {
    //   pharmacies() 
    // })
    // watch(pharmacies.value,(newIdx,oldIdx)=> {
    //   updateMap()
    // })

    


    return {
      maskData,
      cityName,
      select,
      pharmacies,
      // zoom,
      // iconWidth,
      // iconHeight,
      // iconUrl,
      // iconSize
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
  #map
  //- .map
  //-   l-map(v-model="zoom"
  //-       v-model:zoom="zoom"
  //-       :center="[25.043293,121.5205653]"
  //-       @move="log('move')")
  //-     l-tile-layer(url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
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
      // overflow-x hidden
      // overflow-y scroll
      // border 1px solid #000
      .info
        // overflow auto
        size(100%,auto)


  #map
    position relative
    size(70%,100vh)
    overflow hidden

  // .map
  //   size(70%,100vh)

</style>
