<template>
  <scroll class="listview" 
    :data="data" ref="listview"
    :listenScroll="listenScroll"
    @scroll="scroll"
    :probeType="3"
    >
      <ul class="list-group">
        <li v-for="(group, index) in data" :key="index" ref="listgroup">
          <h2 class="list-group-title">{{group.title}}</h2>
          <ul class="list-item">
            <li class="list-group-item" v-for="item in group.items" :key="item.id"
              @click="selectItem(item)"
            >
              <img class="avatar" v-lazy="item.singerImg" alt="img">
              <span class="name">{{item.name}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="list-shortcut" @touchstart="onTouchStart" @touchmove.stop.prevent="onTouchMove">
        <ul>
          <li v-for="(item, index) in shorCutList" :key="index" class="item" :data-index="index"
            :class="{'current': currentIndex === index}"
          >
            {{item}}
          </li>
        </ul>
      </div>
      <div class="list-fixed" v-show="scrollY > 0" ref="listFixed">
        <h1 class="fixed-title">{{fixedTitle}}</h1>
      </div>
      <div class="loading-container" v-show='!data.length'>
        <loading></loading>
      </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'src/base/scroll/scroll'
import { getData } from 'common/js/dom.js'
import loading from 'src/base/loading/loading'
const TITLE_HEIGHT = 30
const CUT_HEIGHT = 18

export default {
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listenHeight = []
  },
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diffDistance: -1
    }
  },
  computed: {
    shorCutList() {
        return this.data.map(group => {
            return group.title.substr(0, 1)
        })
    },
    fixedTitle() {
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calcHeight()
      }, 20)
    },
    scrollY(val) {
      let height = this.listenHeight
      for (let i = 0; i < height.length - 1; i++) {
        let posPre = height[i]
        let posNext = height[i + 1]
        if (!posNext || (val < posNext && val >= posPre)) {
          this.diffDistance = posNext - val
          this.currentIndex = i
          return
        }
        this.currentIndex = 0
      }
    },
    diffDistance(val) {
      let fixTop = val < TITLE_HEIGHT ? TITLE_HEIGHT - val : 0
      if (this.fixTop === fixTop) {
        return
      }
      this.fixTop = fixTop
      this.$refs.listFixed.style.transform = `translate3d(0,-${fixTop}px,0)`
    }
  },
  
  methods: {
    refresh() {
      this.$refs.listview.refresh()
    },
    selectItem(item) {
      this.$emit('select', item)
    },
    onTouchStart(e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex) 
    },
    onTouchMove(e) {
      this.touch.y2 = e.touches[0].pageY
      let differ = Math.floor((this.touch.y2 - this.touch.y1) / CUT_HEIGHT)
      let anchorIndex = +this.touch.anchorIndex + differ
      this._scrollTo(anchorIndex)
    },
    scroll(pos) {
      this.scrollY = -Math.floor(pos.y)
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return
      }
      if (index > this.listenHeight.length - 2) {
        index = this.listenHeight.length - 2
      }
      this.scrollY = +this.listenHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0)
    },
    _calcHeight() {
      let height = 0
      this.listenHeight.push(height)
      let groups = this.$refs.listgroup
      for (let i = 0; i < groups.length; i++) {
        height += groups[i].clientHeight
        this.listenHeight.push(height)
      }
    }
  },
  components: {
    Scroll,
    loading
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-item
        padding-bottom: 20px 
        .list-group-item
            display: flex
            align-items: center
            padding: 20px 0 0 30px
          .avatar
            width: 50px
            height: 50px
            border-radius: 50%
          .name
            margin-left: 20px
            color: $color-text-l
            font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: -1px
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%) 
</style>