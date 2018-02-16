<template>
  <div class="progress-bar" ref="progressBar"
    @click="progressClick"
  >
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
        @touchstart.prevent="btnTouchStart"
        @touchmove.prevent="btnTouchMove"
        @touchend="btnTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const progressBtnWidth = 16
  
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    watch: {
      percent(newVal) {
        if (newVal < 0 || this.touch.initState) {
          return
        }
        let progressBarWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        let offsetWidth = newVal * progressBarWidth
        this._changeOffset(offsetWidth)
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      progressClick(e) {
        const rectLeft = this.$refs.progressBar.getBoundingClientRect().left
        let changeWidth = e.pageX - rectLeft
        this._changeOffset(changeWidth)
        // 这里的话点击目标点会有个小bug
        // this._changeOffset(e.offsetX)
        this._percentChange()
      },
      btnTouchStart(e) {
        this.touch.initState = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      btnTouchMove(e) {
        let differ = e.touches[0].pageX - this.touch.startX
        let progressBarWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        let offsetWidth = Math.min(progressBarWidth, Math.max(0, this.touch.left + differ)) 
        this._changeOffset(offsetWidth)
      },
      btnTouchEnd(e) {
        this.touch.initState = false
        this._percentChange()
      },
      _percentChange() {
        let percent = this.$refs.progress.clientWidth / (this.$refs.progressBar.clientWidth - progressBtnWidth)
        this.$emit('percentChange', percent)
      },
      _changeOffset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    margin: 0 10px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
