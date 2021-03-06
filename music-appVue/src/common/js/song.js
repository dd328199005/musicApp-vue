import { getLyric } from 'src/api/song'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'
export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
      this.id = id
      this.mid = mid
      this.singer = singer
      this.name = name 
      this.album = album
      this.duration = duration
      this.image = image
      this.url = url
  }

  _getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          resolve('no lyric')
        }
      })
    })
  }
}

export function createSong(musicData) {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R150x150M000${musicData.albummid}.jpg`,
        url: `http://isure.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=32`
    })
}

function filterSinger(singer) {
    let ret = []
    if (!singer) {
        return ''
    } 
    singer.forEach(item => {
        ret.push(item.name)
    })
    return ret.join('/')
}