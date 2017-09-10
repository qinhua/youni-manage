/* eslint-disable no-unused-vars */
import config from '../config.js'

let host = config.host
/*挂在一些必要的数据到window对象*/
window.youniMall = {
  host: host
}

// if (config.needMock) {
// import '../../mock/mock.js'
// }
// import '../../mock/mock.js'

const homeApi = {
  banner: host + '/home/banner',
  topNotice: host + '/home/topNotice',
  goodsList: host + '/home/goodsList'
}
const goodsApi = {
  list: host + '/goods/list',
  add: host + '/goods/add',
  update: host + '/goods/update',
  setSaleStatus: host + '/goods/setSaleStatus'
}
const nearbyApi = {
  shopsList: host + '/home/shopsList'
}
const ticketApi = {
  tickets: host + '/home/tickets'
}
const orderApi = {
  list: host + '/order/list',
  del: host + '/order/del',
  push: host + '/order/push',
  cancel: host + '/order/cancel',
  dispatchList: host + '/orderDispatchProgess/list',
  dispatch: host + '/orderDispatchProgess/add',
  updateOrder: host + '/home/updateOrder'
}
const clientApi = {
  list: host + '/home/order',
  updateOrder: host + '/home/updateOrder'
}
const storeApi = {
  list: host + '/admin/sellerList',
  update: host + '/admin/updateSellerStatus',
  auth: host + '/admin/seller/auth',
  del: host + '/admin/seller/del'
}
const userApi = {
  view: host + '/seller/view',
  set: host + '/seller/set',
  code: host + '/seller/code',
  userInfo: host + '/seller/userInfo',
  updateSeller: host + '/seller/updateSeller',
  couponsList: host + '/sellerCoupon/get',
  addCoupon: host + '/sellerCoupon/add',
  updateCoupon: host + '/sellerCoupon/update',
  delCoupon: host + '/sellerCoupon/del',
  getFloor: host + '/floorCost/get',
  addFloor: host + '/floorCost/add',
}
const statisticApi = {
  list: host + '/seller/statistic',
}
const commonApi = {
  wxAuth: host + '/weixin/auth',
  login: host + '/seller/login',
  regist: host + '/seller/applySeller',
  dict: host + '/common/dictList',
  uploadImg: host + '/file/uploadImage',
  sendSms: host + '/common/sendSms',
  checkCode: host + '/common/checkSmsCode'
}
console.log('当前域名：%c' + host, 'color:red;font-size:14px;font-weight:bold')
// console.log('当前API：%c' + JSON.stringify(homeApi, null, 2), 'color:orange;font-size:14px')
export {commonApi, homeApi, nearbyApi, ticketApi, orderApi, clientApi, storeApi, userApi, goodsApi, statisticApi}