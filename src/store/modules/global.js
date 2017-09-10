export default {

  state: {
    name: '全局',
    isLogin:false,
    geoData: null,
    expired: true,
    wxInfo: null,
    /*expired: false,
    wxInfo: {
      'city': '武汉',
      'country': '中国',
      'errorCode': 0,
      'errorMessage': null,
      'headimgurl': 'http://wx.qlogo.cn/mmopen/QAm7hEbaujS41jY5T0icQd9ySS9FaRJibTiclJGyysBmLoFmswkhLemAHAibYOQml4hibx3BqD2u8NRIwrAhTyeLgjavI70oxia8uk/0',
      'nickname': '覃华',
      'openid': 'oEo51t1PTVGj7H6Ahdqr_kac-1vs',
      // 'openid': 'oGnE80ixTvBXjQ_Dql0BcTlx',
      'privilege': [],
      'province': '湖北',
      'sex': '1',
      'subscribe': 0,
      'subscribeTime': null,
      'unionid': null
    },*/
    dict: null,
    direction: 'forward'
  },

  getters: {
    /*getSth: ()=> {
      return state.name
    }*/
  },

  mutations: {
    getFromDict(state, type) {
      setTimeout(function () {
        for (var i = 0; i < state.dict.length; i++) {
          var cur = state.dict[i]
          if (cur.dictType === type) {
            console.log(cur.items)
            return cur.items
          }
        }
      }, 2000)
    },
    getData(state, payload) {
      if (payload.res.httpStatusCode === 200) {
        state.itemDetail = payload.res.topiclist
      }
    },
    storeData(state, response) {
      state[response['key']] = response.data
    },
    /* 更新路由方向 */
    updateDirection(state, payload) {
      state.direction = payload.direction
    }
  },

  actions: {
    /*checkData ({commit, state}, id) {
      commit('getData', { id })
      if (!state.wxInfo) {
        commit('storeData', {
          key:'wxInfo'
          data: {}
        })
      }
    }*/
  }

}
