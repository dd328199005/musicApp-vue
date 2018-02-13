<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="distList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img class="needsclick" @load="loadImg" :src="item.picUrl" alt="img"> 
                <!-- fastclick 会阻止默认事件加needsclick后解锁 -->
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title"> 热门歌单推荐</h1>
          <ul>
            <li v-for="(item, index) in distList" :key="index" class="item">
              <div class="icon">
                <img v-lazy="item.imgurl" alt="pic" width="60" height='60'>
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
          <ul>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!distList">
        <loading></loading>
      </div>
    </scroll>
   
  </div>
</template>

<script type="text/ecmascript-6">
  import { getRecommend, getDiscList } from 'api/recommend'
  import { ERR_OK } from 'api/config'
  import Slider from 'src/base/slider/slider'
  import Scroll from 'src/base/scroll/scroll'
  import Loading from 'src/base/loading/loading.vue'
  export default {
    data() {
      return {
        recommends: [],
        distList: null
      }
    },
    created() {
      this._getDistList()
      this._getRecommend()
    },
    methods: {
      demo() {
        console.log(2)
      },
      _getDistList() {
        getDiscList().then(res => {
          if (res.code === ERR_OK) {
            setTimeout(() => {
              this.distList = res.data.list
            }, 1000)
          }
        })
      },
      _getRecommend() {
        getRecommend().then(res => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      },
      loadImg() {
        if (!this.checkLoaded) {
          this.$refs.scroll.refresh()
          this.checkLoaded = true
        }
      }
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .test
      height 600px
      width: 300px
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>