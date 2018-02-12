import * as types from './mutation-types' // 到处所有的玩意

const mutations = {
  [types.SET_SINGER](state, singer) {
      state.singer = singer
  }
}

export default mutations