<script>
import cityName from '../assets/cityName.json'
import { onMounted, ref, reactive, computed, onUpdated} from 'vue'
import {useStore} from 'vuex'
export default {
  setup() {
    const store = useStore()

    const isOpen = computed(()=> {
      return store.getters.isOpen
    })

    const filterMaskData = computed(()=> {
      return store.getters.filterMaskData
    })

    const reCenter = (coordinates) => { //選擇藥局後地圖自動移動中心
      let latitude  = coordinates[1]
      let longitude  = coordinates[0]
      console.log(latitude,longitude);
      store.dispatch('commitCenterCoordinates',{latitude,longitude})
    }

    return {
      isOpen,
      filterMaskData,
      reCenter
    }
  }
}
</script>

<template lang='pug'>
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

<style lang='stylus' scoped>
@import '../css/style.styl'
.list
  background-color rgba(255,255,255,0.8)
  position absolute
  top -100vh
  right 0
  z-index 999
  size(34%,100vh)
  flexCenter(,,column)
  transition 0.5s
  &.open
    top 10vh
    size(34%,90vh)
    
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
  .list
    font-size 0.6rem
    size(100%,90vh)
    &.open
      top 10vh
      size(100%,90vh)

@media screen and (max-width 1024px)
  .list
    font-size 0.6rem
    &.open
      top 10vh

@media screen and (max-width 1360px)
  .list
    font-size 0.6rem
    &.open
      top 10vh
</style>