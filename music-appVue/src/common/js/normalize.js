export default function normalize(item) {
    return {
        id: item.Fsinger_mid,
        name: item.Fsinger_name,
        singerImg: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
    }
}