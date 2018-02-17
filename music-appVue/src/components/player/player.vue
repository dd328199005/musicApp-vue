<template>
  <div class="player" v-show="playList.length > 0">
      <transition name="normal"
        @enter="enter"
        @after-enter="afterEnter"
        @leave="leave"
        @after-leave="afterLeave"
      >
          <div class="normal-player" v-show="fullScreen">
            <div class="background">
            <img width="100%" height="100%" :src="currentSong.image">
            </div>
            <div class="top">
                <div class="back" @click="back">
                    <i class="icon-back"></i>
                </div>
                <h1 class="title" v-html="currentSong.name"></h1>
                <h2 class="subtitle" v-html="currentSong.singer"></h2>
            </div>
            <div class="middle"
              @touchstart.prevent="middleTouchStart"
              @touchmove.prevent="middleTouchMove"
              @touchend="middleTouchEnd"
            >
                <div class="middle-l" ref="middleL">
                  <div class="cd-wrapper" ref="cdWrapper">
                    <div class="cd"
                      :class="cdRotate"
                    >
                      <img class="image" :src="currentSong.image">
                    </div> 
                  </div>
                  <div class="playing-lyric-wrapper">
                    <div class="playing-lyric">{{playingLyric}}</div>
                  </div>
                </div>
               
                <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                  <div class="lyric-wrapper">
                    <div v-if="currentLyric">
                      <p ref="lyricLine" class="text"
                        v-for="(line, index) in currentLyric.lines"
                        :key="index"
                        :class="{'current': currentLineNum === index}"
                      >
                        {{line.txt}}
                      </p>
                    </div>
                  </div>
                </scroll>
            </div>
            <div class="bottom">
                <div class="dot-wrapper">
                  <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
                  <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
                </div>
                <div class="progress-wrapper">
                  <span class="time time-l">{{format(this.currentTime)}}</span>
                  <div class="progress-bar-wrapper">
                    <progress-bar 
                      :percent="percent"
                      @percentChange="onProgressChange"
                    ></progress-bar>
                  </div>
                  <span class="time time-r">{{format(this.currentSong.duration)}}</span>
                </div>
                <div class="operators">
                    <div class="icon i-left" :class="disableClass"
                      @click="changeMode"
                    >
                        <i :class="modeIcon"></i>
                    </div>
                    <div class="icon i-left" :class="disableClass">
                        <i class="icon-prev" @click="prev"></i>
                    </div>
                    <div class="icon i-center" :class="disableClass">
                        <i :class="playingIcon"
                          @click="togglePlaying"
                        ></i>
                    </div>
                    <div class="icon i-right" :class="disableClass">
                        <i class="icon-next" @click="next"></i>
                    </div>
                    <div class="icon i-right" :class="disableClass">
                        <i class="icon-not-favorite"></i>
                    </div>
                </div>
            </div>
          </div>
      </transition>
      <transition name="mini">
        <div class="mini-player" v-show="!fullScreen" @click="open">
            <div class="icon">
              <div class="imgWrapper">
                <img :class="cdRotate" width="40" height="40" :src="currentSong.image">
              </div>
            </div>
            <div class="text">
              <h2 class="name" v-html="currentSong.name"></h2>
              <p class="desc" v-html="currentSong.singer"></p>
            </div>
            <div class="control">
              <progress-cricle :radius="radius" :percent="percent">
                <i :class="miniIcon" class="icon-mini"
                  @click.stop="togglePlaying"
                ></i>
              </progress-cricle>
            </div>
            <div class="control">
              <i class="icon-playlist"></i>
            </div>
        </div>
      </transition>
      <audio ref="audio" :src='currentSong.url'
        @error="error"
        @canplay="ready"
        @timeupdate="updateTime"
        @ended="end"
      ></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapMutations } from 'vuex'
  import animations from 'create-keyframe-animation'
  import ProgressBar from 'src/base/progress-bar/progress-bar'
  import ProgressCricle from 'src/base/progress-cricle/progress-cricle'
  import { playMode } from 'common/js/config'
  import { shuffle } from 'common/js/util'
  import LyricParser from 'lyric-parser' // 歌词编译
  import Scroll from 'src/base/scroll/scroll'

  export default {
    data() {
      return {
        songReady: false,
        currentTime: 0,
        radius: 32,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: null
      }
    },
    computed: {
        playingIcon() {
          return this.playing ? 'icon-pause' : 'icon-play'
        },
        miniIcon() {
          return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
        },
        cdRotate() {
          return this.playing ? 'play' : 'play pause'
        },
        disableClass() {
          return this.songReady ? '' : 'disable'
        },
        percent() {
          return this.currentTime / this.currentSong.duration
        },
        modeIcon() {
          return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop'
            : 'icon-random'
        },
        ...mapGetters([
            'fullScreen',
            'playList',
            'currentSong',
            'playing',
            'currentIndex',
            'mode',
            'sequenceList'
        ])
    },
    watch: {
      currentSong(newVal, oldVal) {
        if (newVal.id === oldVal.id) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
        this.$nextTick(() => {
          this.$refs.audio.play() // 类似settimeout 20
          this.getLyric()
        })
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
        ...mapMutations({
          setFullScreen: 'SET_FULL_SCREEN',
          setPlayingState: 'SET_PLAYING_STATE',
          setCurrentIndex: 'SET_CURRENT_INDEX',
          setPlayMode: 'SET_PLAY_MODE',
          setPlayList: 'SET_PLAYLIST'
        }),
        middleTouchStart(e) {
          this.touch.ininState = true // 滑动bug修复
          this.touch.moved = false // 滑动bug修复2
          const touch = e.touches[0]
          this.touch.startX = touch.pageX
          this.touch.startY = touch.pageY
        },
        middleTouchMove(e) {
          if (!this.touch.ininState) {
            return
          }
          const touch = e.touches[0]
          let differX = touch.pageX - this.touch.startX
          let differY = touch.pageY - this.touch.startY
          if (Math.abs(differY) > Math.abs(differX)) {
            return
          }
          if (!this.touch.moved) {
          this.touch.moved = true
          }
          let left = this.currentShow === 'cd' ? 0 : -window.innerWidth
          let width = Math.min(0, Math.max(-window.innerWidth, left + differX))
          this.touch.percent = Math.abs(width / window.innerWidth)
          this.$refs.middleL.style.opacity = 1 - this.touch.percent
          this.$refs.middleL.style.transitionDuration = '0s'
          this.$refs.lyricList.$el.style.transform = `translate3d(${width}px, 0, 0)`
          this.$refs.lyricList.$el.style.transitionDuration = '0s'
        },
        middleTouchEnd() {
          if (!this.touch.moved) {
            return
          }
          let width = null
          let opacity = null
          if (this.currentShow === 'cd') {
            if (this.touch.percent > 0.3) {
              width = -window.innerWidth
              this.currentShow = 'lyric'
              opacity = 0
            } else {
              width = 0
              opacity = 1
            }
          } else {
            if (this.touch.percent < 0.7) {
              width = 0
              this.currentShow = 'cd'
              opacity = 1
            } else {
              width = -window.innerWidth
              opacity = 0
            }
          }
          this.$refs.middleL.style.opacity = opacity
          this.$refs.middleL.style.transitionDuration = '0.3s'
          this.$refs.lyricList.$el.style.transform = `translate3d(${width}px, 0, 0)`
          this.$refs.lyricList.$el.style.transitionDuration = '0.3s'
          this.touch.ininState = false
        },
        getLyric() {
          this.currentSong._getLyric().then(lyric => {
            this.currentLyric = new LyricParser(lyric, this.handleLyric)
            if (this.playing) {
              this.currentLyric.play()
            }
          }).catch(() => {
            this.currentLineNum = 0
            this.LyricParser = null
            this.playingLyric = ''
          })
        },
        handleLyric({lineNum, txt}) {
          this.playingLyric = txt
          this.currentLineNum = lineNum
          if (lineNum > 5) {
            let lineEl = this.$refs.lyricLine[lineNum - 5]
            this.$refs.lyricList.scrollToElement(lineEl, 1000)
          } else {
            this.$refs.lyricList.scrollTo(0, 0, 1000)
          }
        },
        end() {
          if (this.mode === playMode.loop) {
            this.loop()
          } else {
            this.next()
          }
        },
        loop() {
          this.$refs.audio.currentTime = 0
          this.$refs.audio.play()
          if (this.currentLyric) {
            this.currentLyric.seek(0)
          }
        },
        changeMode() {
          let mode = (this.mode + 1) % 3
          this.setPlayMode(mode)
          let list = null
          if (mode === playMode.random) {
            list = shuffle(this.sequenceList)
          } else {
            list = this.sequenceList
          }
          this.reSetCurrentIndex(list)
          this.setPlayList(list)
        },
        reSetCurrentIndex(list) {
          let index = list.findIndex((item) => {
            return item.id === this.currentSong.id
          })
          this.setCurrentIndex(index)
        },
        onProgressChange(percent) {
          let currentTime = this.currentSong.duration * percent
          this.$refs.audio.currentTime = currentTime
          if (this.currentLyric) {
            this.currentLyric.seek(currentTime * 1000)
          }
          if (!this.playing) {
            this.togglePlaying()
          }
        },
        format(interval) {
          interval = Math.floor(interval)
          const minute = interval / 60 | 0 // 类似math.floor方法 
          const second = interval % 60
          return `${this._pad(minute)}:${this._pad(second)}`
        },
        _pad(num, n = 2) {
          let len = num.toString().length
          while (len < n) {
            num = '0' + num 
            len++
          }
          return num
        },
        updateTime(e) {
          this.currentTime = e.target.currentTime
        },
        error() {
          this.songReady = true
        },
        ready() {
          this.songReady = true
        },
        prev() {
          if (!this.songReady) {
            return
          }
          if (this.playList.length === 1) {
            this.loop()
          } else {
            let index = this.currentIndex - 1
            if (index < 0) {
              index = this.playList.length - 1
            }
            this.setCurrentIndex(index)
            if (!this.playing) {
              this.togglePlaying()
            }
            this.songReady = false
          }
        },
        next() {
          if (!this.songReady) {
            return
          }
          if (this.playList.length === 1) {
            this.loop()
          } else {
            let index = this.currentIndex + 1
            if (index === this.playList.length) {
              index = 0
            }
            this.setCurrentIndex(index)
            if (!this.playing) {
              this.togglePlaying()
            }
            this.songReady = false
          }
        },
        back() {
          this.setFullScreen(false)
        },
        open() {
          this.setFullScreen(true)
        },
        enter(el, done) {
          let {x, y, scale} = this._getPosAndScale()
          let animation = {
            0: {
              transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
            },
            60: {
              transform: `translate3d(0, 0, 0) scale(1.2)`
            },
            100: {
              transform: `translate3d(0, 0, 0) scale(1)`
            }
          }
          animations.registerAnimation({
            name: 'move',
            animation,
            presets: {
              duration: 400,
              easing: 'linear'
            }
          })
          animations.runAnimation(this.$refs.cdWrapper, 'move', done)
        },
        afterEnter(el) {
          animations.unregisterAnimation('move')
          this.$refs.cdWrapper.style.animation = ''
        },
        leave(el, done) {
          this.$refs.cdWrapper.style.transition = 'all 0.4s'
          const {x, y, scale} = this._getPosAndScale()
          this.$refs.cdWrapper.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
          this.$refs.cdWrapper.addEventListener('transitionend', done)
        },
        afterLeave(el) {
          this.$refs.cdWrapper.style.transition = ''
          this.$refs.cdWrapper.style.transform = ''
        },
        togglePlaying() {
          if (!this.songReady) {
            return
          }
          if (this.currentLyric) {
            this.currentLyric.togglePlay()
          }
          this.setPlayingState(!this.playing)
          this.playing ? this.$refs.audio.play() : this.$refs.audio.pause()
        },
        _getPosAndScale() {
          const targetWidth = 40
          const paddingLeft = 40
          const paddingBottom = 30
          const paddingTop = 80
          const width = window.innerWidth * 0.8
          const scale = targetWidth / width
          const x = -(window.innerWidth / 2 - paddingLeft)
          const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
          return {
            x,
            y,
            scale
          }
        }
    },
    components: {
      ProgressBar,
      ProgressCricle,
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            box-sizing: border-box
            height: 100%
            .cd
              width: 100%
              height: 100%
              border-radius: 50%
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                box-sizing: border-box
                border-radius: 50%
                border: 10px solid rgba(255, 255, 255, 0.1)
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
            .pure-music
              padding-top: 50%
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        height: 40px
        padding: 0 10px 0 20px
        .imgWrapper
          height: 100%
          width: 100%
          img
            border-radius: 20px
            &.play
              animation: rotate 10s linear infinite
            &.pause
              animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
