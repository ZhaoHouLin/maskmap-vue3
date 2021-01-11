<script>
import cityName from '../assets/cityName.json'
import { apiGetCommonFn } from '../api'

export default {
  setup() {

    const {isOpen,filterMaskData,reCenter} = apiGetCommonFn()

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
  border-radius 16px 0px 0 16px
  position absolute
  top -100vh
  right 0
  z-index 999
  size(34%,100vh)
  flexCenter(,,column)
  transition 0.5s
  &.open
    top 10vh
    size(34%,calc(90vh - 12px))
    box-shadow -2px 2px 12px rgba(0,0,0,0.5)
    
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
      size(100%,calc(90vh - 12px))

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