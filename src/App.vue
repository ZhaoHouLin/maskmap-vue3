<script>
import { onMounted, ref, reactive, computed, onUpdated} from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import ListSelect from '../src/components/ListSelect'
import List from '../src/components/List'
import Map from '../src/components/Map'




export default {
  components: {
    ListSelect,
    List,
    Map
  },
  setup() {
    
    return {
    }
  }
}
</script>

<template lang='pug'>
.content

  Map
  ListSelect
  List

  

</template>

<style lang="stylus" scoped>
@import './css/style.styl'
.content 
  overflow hidden
  .tooltip
    font-size 1.5rem

</style>
