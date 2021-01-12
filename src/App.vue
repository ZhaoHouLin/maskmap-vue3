<script>
import { onMounted, ref, reactive, computed, onUpdated} from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import ListSelect from '../src/components/ListSelect'
import List from '../src/components/List'
import Map from '../src/components/Map'

import { apiGetCommonFn } from './api'

export default {
  components: {
    ListSelect,
    List,
    Map
  },
  setup() {
    const store = useStore()
    const { isOpen,reCenter,userCoordinatesData } = apiGetCommonFn()
    const handleOpen = () => {
      store.dispatch('commitIsOpen')
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
    return {
      handleOpen,
      isOpen,
      reCenter,
      getLocation,
      userCoordinatesData
    }
  }
}
</script>

<template lang='pug'>
.content
  Map
  ListSelect
  List  
  .switch(:class='["fas",{"fa-chevron-left":!isOpen},{"fa-chevron-right":isOpen}]' @click='handleOpen' )
  .user-loaction(:class='["fas","fa-street-view"]' @click='getLocation(),reCenter([userCoordinatesData.longitude,userCoordinatesData.latitude])')
</template>

<style lang="stylus" scoped>
@import './css/style.styl'
.content 
  overflow hidden
  .tooltip
    font-size 1.5rem

  .user-loaction
    color red
    left 0
    top 0
    position absolute
    font-size 40px
    padding 8px
    cursor pointer
    z-index 999

  .switch
    position absolute
    flexCenter(center,flex-start)
    top 0
    right 0
    font-size 32px
    padding 8px
    color color-blue
    transition 0.5s
    cursor pointer
    z-index 999
</style>
