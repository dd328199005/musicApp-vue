import { mapGetters } from 'vuex'

export const playListMixin = {
    mounted() {
      this.handlePlayListMixin(this.playList)
    },
    activated() {
      this.handlePlayListMixin(this.playList)
    },
    watch: {
      playList(newVal) {
        this.handlePlayListMixin(newVal)
      }
    },
    computed: {
      ...mapGetters([
        'playList'
      ])
    },
    methods: {
      handlePlayListMixin(playList) {
        throw new Error('need components methods handle')
      }
    }
}