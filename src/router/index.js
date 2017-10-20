import Vue from 'vue'
import Router from 'vue-router'
// import App from '@/App'
import Auth from '@/pages/Auth'
import Login from '@/pages/my/Login'
import Home from '@/pages/Home'
import Map from '@/components/Amap'
import Geo from '@/components/Geo'
import My from '@/pages/My'
import EditUser from '@/pages/my/EditUser'
import EditAddress from '@/pages/my/EditAddress'
import MyCoupons from '@/pages/my/Coupons'
import MyGuarantee from '@/pages/my/Guarantee'
import MyAddress from '@/pages/my/Address'
import MyFavorite from '@/pages/my/Favorite'
import Help from '@/pages/my/Help'
import About from '@/pages/my/About'
import GoodsDetail from '@/pages/goods/Detail'

import Sellers from '@/pages/store/Sellers'
import SellerDetail from '@/pages/store/Detail'
import Topic from '@/pages/mall/topic/Topic'
import Coupons from '@/pages/mall/coupons/Coupons'
import EditCoupon from '@/pages/mall/coupons/EditCoupon'
import AccountTime from '@/pages/mall/account/AccountTime'
import Mall from '@/pages/mall/Items'
import Banner from '@/pages/mall/banner/Banner'
import Goods from '@/pages/goods/Goods'
import EditGoods from '@/pages/goods/Edit'
import PickFromSeller from '@/pages/goods/PickFromSeller'
import EditSubPrice from '@/components/EditSubPrice'
import OrderDetail from '@/pages/orders/Detail'
import Clients from '@/pages/clients/Clients'
import Assets from '@/pages/assets/Assets'
import Income from '@/pages/assets/income/Income'
import WithDrawList from '@/pages/assets/withDraw/WithDrawList'
import WithDraw from '@/pages/assets/withDraw/WithDraw'
import Statistic from '@/pages/statistic/Statistic'
import Regist from '@/pages/my/Regist'
import Password from '@/pages/my/Password'

import NoPage from '@/pages/NoPage'

Router.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
}
Vue.use(Router)

export default new Router({
  // mode: '',
  scrollBehavior (to, from, savedPosition) {
    return {x: 0, y: 0}
  },
  routes: [
    {
      path: '/author',
      name: 'author',
      component: Auth,
      meta: {
        title: '授权中…',
        keepAlive: false // 是否需要缓存
      }
    },
    {
      path: '/regist',
      name: 'regist',
      component: Regist,
      meta: {
        title: '商家入驻',
        keepAlive: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: '登录',
        keepAlive: false
      }
    },
    {
      path: '/banner',
      name: 'banner',
      component: Banner,
      meta: {
        title: '首页Banner',
        keepAlive: false
      }
    },
    {
      path: '/',
      name: '/',
      redirect: '/home',
      component: Home,
      meta: {
        title: '商城后台',
        keepAlive: false
      }
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        title: '商城后台',
        keepAlive: false
      }
    },
    {
      path: '/user',
      name: 'user',
      component: My,
      meta: {
        title: '我的',
        keepAlive: false
      }
      /* children: [{
       path: '/myaddress',
       name: '我的地址',
       component: MyAddress
       }] */
    },
    {
      path: '/edit_user/:id',
      name: 'edit_user',
      component: EditUser,
      meta: {
        title: '我的',
        keepAlive: false
      }
    },
    {
      path: '/password',
      name: 'password',
      component: Password,
      meta: {
        title: '修改密码',
        keepAlive: false
      }
    },
    {
      path: '/sellers',
      name: 'sellers',
      component: Sellers,
      meta: {
        title: '店铺列表',
        keepAlive: false
      }
    },
    {
      path: '/seller_detail',
      name: 'seller_detail',
      component: SellerDetail,
      meta: {
        title: '店铺管理',
        keepAlive: false
      }
    },
    {
      path: '/mall_topic',
      name: 'mall_topic',
      component: Topic,
      meta: {
        title: '商城公告',
        keepAlive: false
      }
    },
    {
      path: '/coupons',
      name: 'coupons',
      component: Coupons,
      meta: {
        title: '优惠管理',
        keepAlive: false
      }
    },
    {
      path: '/edit_coupon',
      name: 'edit_coupon',
      component: EditCoupon,
      meta: {
        title: '优惠编辑',
        keepAlive: false
      }
    },
    {
      path: '/account_time',
      name: 'account_time',
      component: AccountTime,
      meta: {
        title: '到账时间',
        keepAlive: false
      }
    },
    {
      path: '/mall',
      name: 'mall',
      component: Mall,
      meta: {
        title: '商城管理',
        keepAlive: false
      }
    },
    {
      path: '/goods',
      name: 'goods',
      component: Goods,
      meta: {
        title: '商品管理',
        keepAlive: false
      }
    },
    {
      path: '/pick_from_seller',
      name: 'pick_from_seller',
      component: PickFromSeller,
      meta: {
        title: '店铺列表',
        keepAlive: false
      }
    },
    {
      path: '/edit_goods',
      name: 'edit_goods',
      component: EditGoods,
      meta: {
        title: '编辑商品',
        keepAlive: false
      }
    },
    {
      path: '/order_detail',
      name: 'order_detail',
      component: OrderDetail,
      meta: {
        title: '订单详情',
        keepAlive: false
      }
    },
    {
      path: '/edit_sub_price',
      name: 'edit_sub_price',
      component: EditSubPrice,
      meta: {
        title: '价格标签',
        keepAlive: false
      }
    },
    {
      path: '/clients',
      name: 'clients',
      component: Clients,
      meta: {
        title: '客户管理',
        keepAlive: false
      }
    },
    {
      path: '/assets',
      name: 'assets',
      component: Assets,
      meta: {
        title: '资金管理',
        keepAlive: false
      }
    },
    {
      path: '/income_list',
      name: 'income_list',
      component: Income,
      meta: {
        title: '收支明细',
        keepAlive: false
      }
    },
    {
      path: '/with_draw',
      name: 'with_draw',
      component: WithDraw,
      meta: {
        title: '提现',
        keepAlive: false
      }
    },
    {
      path: '/with_draw_list',
      name: 'with_draw_list',
      component: WithDrawList,
      meta: {
        title: '提现记录',
        keepAlive: false
      }
    },
    {
      path: '/statistic',
      name: 'statistic',
      component: Statistic,
      meta: {
        title: '数据统计',
        keepAlive: false
      }
    },
    {
      path: '/mycoupons',
      name: 'mycoupons',
      component: MyCoupons,
      meta: {
        title: '我的卡券',
        keepAlive: false
      }
    },
    {
      path: '/myguarantee',
      name: 'myguarantee',
      component: MyGuarantee,
      meta: {
        title: '我的押金',
        keepAlive: false
      }
    },
    {
      path: '/myaddress',
      name: 'myaddress',
      component: MyAddress,
      meta: {
        title: '收货地址',
        keepAlive: false
      }
    },
    {
      path: '/edit_address',
      name: 'edit_address',
      component: EditAddress,
      meta: {
        title: '收货地址',
        keepAlive: false
      }
    },
    {
      path: '/myfavor',
      name: 'myfavor',
      component: MyFavorite,
      meta: {
        title: '我的收藏',
        keepAlive: false
      }
    },
    {
      path: '/help',
      name: 'help',
      component: Help,
      meta: {
        title: '使用帮助',
        keepAlive: false
      }
    },
    {
      path: '/aboutus',
      name: 'aboutus',
      component: About,
      meta: {
        title: '关于友你',
        keepAlive: false
      }
    },
    {
      path: '/map',
      name: 'map',
      component: Map,
      meta: {
        title: '地图',
        keepAlive: false
      }
    },
    {
      path: '/geo',
      name: 'geo',
      component: Geo,
      meta: {
        title: '当前位置',
        keepAlive: false
      }
    },
    {
      path: '/goods_detail',
      name: 'goods_detail',
      component: GoodsDetail,
      meta: {
        title: '商品详情',
        keepAlive: false
      }
    },
    {
      path: '*',
      name: '404',
      component: NoPage,
      meta: {
        title: '迷路了',
        keepAlive: true
      }
    }
  ]
})
