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
  goodsList: host + '/home/goodsList',
  getGoods: host + '/admin/homeGoodsIdsList',
  addGoods: host + '/admin/addHomeGoods',
  delGoods: host + '/admin/delHomeGoods'
}
const bannerApi = {
  list: host + '/home/banner',
  add: host + '/admin/addBanner',
  del: host + '/admin/delBanner'
}
const topicApi = {
  list: host + '/home/topNotice',
  add: host + '/admin/addNotice',
  del: host + '/admin/delNotice'
}
const goodsApi = {
  list: host + '/goods/list',
  add: host + '/goods/add',
  update: host + '/goods/update',
  setSaleStatus: host + '/goods/setSaleStatus'
}
const ticketApi = {
  tickets: host + '/home/tickets'
}
const orderApi = {
  list: host + '/order/list',
  view: host + '/order/view',
  del: host + '/order/del',
  cancel: host + '/order/cancel',
  count: host + '/order/count',
  dispatcher: host + '/orderDispatchProgess/list',
  dispatch: host + '/orderDispatchProgess/add',
  updateOrderStatus: host + '/order/updateOrderStatus'
}
const clientApi = {
  list: host + '/admin/userList',
  updateOrder: host + '/home/updateOrder'
}
const storeApi = {
  list: host + '/admin/sellerList',
  updateStatus: host + '/admin/updateSellerStatus',
  audit: host + '/admin/seller/auth',
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
const assetsApi = {
  asset: host + '/seller/amount',
  withDrawList: host + '/seller/statistic',
  withDraw: host + '/common/top10'
}
const statisticApi = {
  list: host + '/seller/statistic',
  top10: host + '/common/top10',
  orderAnalysis: host + '/common/orderAnalysis',
  saleAnalysis: host + '/common/saleAnalysis',
  puvAnalysis: host + '/common/puvAnalysis'
}
const commonApi = {
  wxAuth: host + '/weixin/auth',
  login: host + '/admin/login',
  logout: host + '/seller/logout',
  regist: host + '/seller/applySeller',
  reset: host + '/seller/setPasswd',
  dict: host + '/common/dictList',
  uploadImg: host + '/file/uploadImage',
  sendSms: host + '/common/sendSms',
  checkCode: host + '/common/checkSmsCode'
}
console.log('当前域名：%c' + host, 'color:red;font-size:14px;font-weight:bold')
// console.log('当前API：%c' + JSON.stringify(homeApi, null, 2), 'color:orange;font-size:14px')
export {
  commonApi,
  homeApi,
  bannerApi,
  topicApi,
  ticketApi,
  orderApi,
  clientApi,
  storeApi,
  userApi,
  goodsApi,
  assetsApi,
  statisticApi
}
