<script>
import cityName from '../assets/cityName.json'
import { useStore } from 'vuex'
import { apiGetCommonFn,apiGetLatLonDistance } from '../api'

export default {
  setup() {
    const store = useStore()
    const {isOpen,filterMaskData,reCenter} = apiGetCommonFn()
    const distance = (λB, ΦB)=> {
      let λA = store.getters.userCoordinatesData.latitude
      let ΦA = store.getters.userCoordinatesData.longitude
      return apiGetLatLonDistance(λA,ΦA,λB,ΦB)
    }

    return {
      isOpen,
      filterMaskData,
      reCenter,
      distance
    }
  }
}
</script>

<template lang='pug'>
.list(:class='[{"open": isOpen}]')
  .pharmacy
    router-link.item(v-for='(item,key) in filterMaskData' 
    @click='reCenter(item.geometry.coordinates)'
    :to='`/${item.properties.name}`'
    )
      .title
        i.fas.fa-pills
        h3 {{item.properties.name}}
      .mask-quantity
        .mask-adult
          h4 成人口罩 
          h3 {{item.properties.mask_adult?item.properties.mask_adult+'個':'未取得資料'}}
        .mask-child
          h4 兒童口罩
          h3 {{item.properties.mask_child?item.properties.mask_child+'個':'未取得資料'}}
      .info 
        h3 {{item.properties.phone}} 
        .address
          i.fas.fa-map-marked-alt
          a(:href='`https://www.google.com.tw/maps/place/${item.properties.address}`' target='_blank' title='Google Map') {{ item.properties.address }}
        .distance
          h4 距離您 
          h3(:class='[{"green": distance(item.geometry.coordinates[1],item.geometry.coordinates[0])* 1000<1000 }]') {{distance(item.geometry.coordinates[1],item.geometry.coordinates[0])* 1000 }} 
          h4 公尺
        .other
          h3 備註: 
            h4 {{item.properties.note}}
          h3 更新時間: {{item.properties.updated}}

    router-view

</template>

<style lang='stylus' scoped>
@import '../css/style.styl'
.list
  background-color transparent
  border-radius 16px 0px 0 16px
  position absolute
  top 8vh
  left -100vw
  transition 0.5s
  z-index 999
  size(30%,100vh)
  flexCenter(,,column)

  &.open
    left 0vh
    size(30%,calc(90vh - 12px))
    
  .pharmacy
    cursor pointer
    size()
    flexCenter(flex-start,center,column)
    overflow auto
    
    .item
      background-color rgba(255,255,255,0.9)
      color #222
      size(100%,200px)
      padding 0
      margin 0
      padding-bottom 16px
      margin-bottom 8px
      border-radius 16px
      transition 0.5s
      
      &:hover
        box-shadow 0px 2px 4px rgba(0,0,0,0.5)
        background-color #fff

      &.router-link-active
        height auto
        .info
          .distance,.other
            opacity 1 
      .title
        h3
          color #fff
          margin-left 8px

      .info
        flxeCenter()
        .address
          i
            color color-green
            margin-right 8px
          a
            font-weight 900
            color color-blue
        .distance
          opacity 0
          h4,h3
            margin-right 4px
          h4 
            font-weight normal
        .other
          opacity 0
          h3
            h4
              display inline-block
              font-weight 500
        
@media screen and (max-width 540px)
  .list
    font-size 0.6rem
    size(100%,90vh)
    &.open
      top 10vh
      size(100%,calc(90vh - 12px))
    .pharmacy
      .item
        size(100%,160px)


</style>