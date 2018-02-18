<template>
    <transition name="slide">
      <music-list
        :songs="songs"
        :title="title"
        :bgImage="bgImage"
      ></music-list>
    </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { ERR_OK } from 'api/config'
import MusicList from 'components/music-list/music-list.vue'
import { getDiscSongList } from 'src/api/recommend'
import { createSong } from 'common/js/song'

export default {
  data() {
    return {
      songs: []
    }
  },
  created() {
    this._getSongList()
  },
  methods: {
    _getSongList() {
       if (!this.disc.dissid) {
        this.$router.push('/recommend')// vuex没有设置时（页面重新载入时回到首页）
      }
      getDiscSongList(this.disc.dissid).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(musicData => {
      if (musicData.songid && musicData.albumid) {
        ret.push(createSong(musicData))
      }
      })
      return ret
    }
  },
  computed: {
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slide-enter-active,.slide-leave-active
    transition: all 0.3s
  .slide-enter,.slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>