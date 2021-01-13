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
    const { isOpen,reCenter } = apiGetCommonFn()

    return {
      isOpen,
      reCenter,
    }
  }
}
</script>

<template lang='pug'>
.content
  Map
  ListSelect
  List  
  //- .switch(:class='["fas",{"fa-chevron-left":!isOpen},{"fa-chevron-right":isOpen}]' @click='handleOpen' )
  //- .user-loaction(:class='["fas","fa-map-marker-alt"]' @click='getLocation(),reCenter([userCoordinatesData.longitude,userCoordinatesData.latitude])')
</template>

<style lang="stylus" scoped>
@import './css/style.styl'
.content 
  overflow hidden
  .tooltip
    font-size 1.5rem

  .user-loaction
    color red
    right 4px
    bottom 88px
    position absolute
    font-size 40px
    padding 8px
    cursor pointer
    z-index 999

</style>
