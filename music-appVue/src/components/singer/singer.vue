<template>
  <div class="singer" ref="singer">
    <list-view :data="this.singers" @select="selectSinger" ref="listview"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from 'api/singer.js'
import { ERR_OK } from 'api/config'
import normalize from 'common/js/normalize.js'
import ListView from 'src/base/listview/listview'
import { mapMutations } from 'vuex'
import { playListMixin } from 'common/js/mixin'
  export default {
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingers()
    },

    methods: {
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      handlePlayListMixin(playList) {
        if (playList.length > 0) {
          this.$refs.singer.style.bottom = '60px'
          this.$refs.listview.refresh()
        }
      },
      selectSinger(item) {
        this.$router.push({
          path: `/singer/${item.id}`
        })
        this.setSinger(item)
      },
      _getSingers() {
        getSingerList().then(res => {
          if (res.code === ERR_OK) {
            setTimeout(() => {
              this.singers = this._normalizeList(res.data.list)
            }, 1000)
          }
        })
      },
      _normalizeList(list) {
        let map = {
          hot: {
            title: '热门',
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < 10) {
            map.hot.items.push(normalize(item))
          }
          let key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
            map[key].items.push(normalize(item))
          } else {
            map[key].items.push(normalize(item))
          }
        })
        let hot = []
        let ret = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-z]/)) {
            ret.push(val)
          } else {
            if (val.title === '热门') {
              hot.push(val)
            }
          }
        }
        
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      }
    },
    components: {
      ListView
    },
    mixins: [playListMixin]
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
