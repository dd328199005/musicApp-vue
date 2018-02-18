<template>
  <div class="rank" :class="yellow" ref="rank">
    {{yellow()}}
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    methods: {
      yellow() {
        return 'ranktwo'
      }
    }
  }
 
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .ranktwo
    color: yellow
</style>