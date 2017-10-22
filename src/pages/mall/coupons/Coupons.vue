<template>
  <div class="my-coupons" v-cloak>
    <!--<tab class="order-tab" active-color="#4670fe">
      <tab-item :selected="!params.goodsType?true:false" @on-item-click="onItemClick">全部</tab-item>
      <tab-item :selected="params.goodsType=='goods_type.1'?true:false" @on-item-click="onItemClick(1)">水</tab-item>
      <tab-item :selected="params.goodsType=='goods_type.2'?true:false" @on-item-click="onItemClick(2)">奶</tab-item>
    </tab>-->
    <div class="coupon-list">
      <scroller class="inner-scroller" ref="couponScroller" :on-refresh="refresh" :on-infinite="infinite"
                refreshText="下拉刷新" noDataText="没有更多数据" snapping>
        <!-- content goes here -->
        <swipeout>
          <swipeout-item @on-close="" @on-open="" transition-mode="follow" v-for="(item, index) in coupons"
                         :data-id="item.id" key="index">
            <div slot="right-menu">
              <!--<swipeout-button @click.native="onButtonClick('edit',item.id)" background-color="orange">编辑
              </swipeout-button>-->
              <swipeout-button @click.native="onButtonClick('delete',item.id)" type="warn">删除</swipeout-button>
            </div>
            <div slot="content" class="demo-content vux-1px-t">
              <section class="v-items">
                <!--<div :class="('stamp type0'+item.type) + (!item.status?' expired':'')">-->
                <div :class="'stamp type01' + (item.expired?' expired':'')">
                  <div class="wrap">
                    <div class="par">
                      <!--<p>{{item.sellerName}}</p>-->
                      <div class="content">
                        <h3 class="value">{{item.discountRate}}折<sub class="type" v-if="item.goodsTypeName">{{item.goodsTypeName}}</sub>
                        </h3>
                        <sub class="sign">最多抵扣￥{{item.maxDiscountAmount | toFixed}}元</sub>
                        <!--<sub class="type">{{item.goodsTypeName}}</sub>-->
                      </div>
                      <p class="info">{{item.couponNote || '平台优惠'}}<span v-if="item.newUser">首单优惠</span></p>
                    </div>
                    <div class="copy" v-if="item.expireTime&&!item.expired">{{item.label}}<p>
                      {{item.createTime+ '~' + item.expireTime}}
                    </p>
                    </div>
                    <div class="copy" v-else-if="!item.expireTime"><span class="exp">永久有效</span></div>
                    <div class="copy" v-else><span class="exp">已过期</span></div>
                  </div>
                  <i></i>
                </div>
              </section>
            </div>
          </swipeout-item>
        </swipeout>
      </scroller>
    </div>
    <div class="add-goods" v-jump="['edit_coupon',null,3]"><i class="fa fa-plus"></i>&nbsp添加优惠</div>
  </div>
</template>
<!--/* eslint-disable no-unused-vars */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import {Tab, TabItem, Search, Swipeout, SwipeoutItem, SwipeoutButton} from 'vux'
  import {couponApi} from '../../../service/main.js'

  export default {
    name: 'my-coupons',
    data() {
      return {
        show: false,
        curOrderFilter: '',
        coupons: [],
        params: {
          type: 0,
          pageSize: 10,
          pageNo: 1
        },
        noMore: false,
        isPosting: false
      }
    },
    components: {Tab, TabItem, Swipeout, SwipeoutItem, SwipeoutButton},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getCoupons()
      vm.$nextTick(function () {
        vm.$refs.couponScroller.finishInfinite(true)
        vm.$refs.couponScroller.resize()
      })
    },
    computed: {},
    watch: {
      '$route'(to, from) {
        if (to.name === 'coupons') {
          vm.getCoupons()
        }
      }
    },
    methods: {
      refresh(done) {
        // console.log('下拉加载')
        setTimeout(function () {
          vm.getCoupons()
          vm.$refs.couponScroller.finishPullToRefresh()
        }, 1000)
      },
      infinite(done) {
        // console.log('无限滚动')
        setTimeout(function () {
          vm.getCoupons(true)
          vm.$refs.couponScroller.finishInfinite(true)
        }, 1000)
      },
      onItemClick(type) {
        type ? (vm.params.goodsType = (type === 1 ? 'goods_type.1' : 'goods_type.2')) : delete vm.params.goodsType
        vm.getCoupons()
      },
      getCoupons(isLoadMore) {
        if (vm.isPosting) return false
        vm.processing()
        vm.isPosting = true
        vm.loadData(couponApi.list, vm.params, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          var resD = res.data.itemList
          for (var i = 0; i < resD.length; i++) {
            resD[i].expired = me.compareCurrentDate(resD[i].expireTime)
            switch (resD[i].goodsType) {
              case 'goods_type.1':
                resD[i].goodsTypeName = '水'
                break
              case 'goods_type.2':
                resD[i].goodsTypeName = '奶'
                break
            }
            resD[i].createTime = resD[i].createTime ? resD[i].createTime.split(' ')[0] : ''
            resD[i].expireTime = resD[i].expireTime ? resD[i].expireTime.split(' ')[0] : ''
          }
          vm.coupons = resD
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      del(id) {
        vm.confirm('确认删除？', '删除后不可恢复！', function () {
          vm.loadData(couponApi.del, {id: id}, 'POST', function (res) {
            vm.isPosting = false
            vm.getCoupons()
          }, function () {
            vm.isPosting = false
          })
        }, function () {
        })
      },
      onButtonClick(type, id) {
        if (type === 'edit') {
          this.$router.push({name: 'edit_coupon', query: {id: id}})
        } else {
          vm.del(id)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../../static/css/tools.less';

  .my-coupons {
    height: 100%;
    overflow-y: auto;
    .order-tab {
      z-index: 10;
      .vux-tab-item {
        .rel;
        .vux-tab-item-badge {
          top: -20px;
          right: 0;
        }
      }
    }
    .vux-swipeout-content {
      .no-bg;
    }
    .demo-content.vux-1px-t {
      &:before {
        .none;
      }
    }
    .coupon-list {
      .inner-scroller {
        .borBox;
        /*padding: 50px 0 20px 0;*/
        padding: 10px 0 20px 0;
        .v-items {
          .borBox;
          width: 100%;
          margin-bottom: 10/@rem;
          .stamp {
            .rel;
            .borBox;
            width: 94%;
            min-height: 200/@rem;
            padding: 0 30/@rem;
            margin: 0 auto 16/@rem;
            overflow: hidden;
            &:before {
              .abs;
              .block;
              top: 0;
              left: 0;
              width: 20px;
              height: 100%;
              content: '';
            }
            &:after {
              .abs;
              .block;
              top: 0;
              right: 0;
              width: 20px;
              height: 100%;
              content: '';
            }
            .wrap {
              .flex;
              .borBox;
              .abs;
              padding: 20/@rem 0 20/@rem 20/@rem;
              content: '';
              top: 0;
              bottom: 0;
              left: 10px;
              right: 10px;
              z-index: -1;
              background-color: #e0552e;
            }
            i {
              position: absolute;
              right: -20%;
              top: 120/@rem;
              height: 300/@rem;
              width: 320px;
              z-index: 5;
              .fz(24);
              background-color: rgba(255, 255, 255, .15);
              transform: rotate(-30deg);
            }
            .par {
              .rel;
              .flex-r(3);
              z-index: 5;
              .left;
              border-right: 2px dashed rgba(255, 255, 255, .3);
              p {
                .rel;
                padding-top: 5/@rem;
                color: #fff;
                .fz(24);
                span {
                  .abs;
                  right: 14/@rem;
                  padding: 0 2px;
                  .fz(22);
                  color: rgba(255, 255, 255, .8);
                  .bor(1px, solid, rgba(255, 255, 255, .8));
                  .borR(2px);

                }
              }
              .content {
                padding: 10/@rem 0;
                .value {
                  .fz(34);
                  color: #fff;
                  font-weight: normal;
                  margin-right: 14/@rem;
                  line-height: 60/@rem;
                  sub {
                    padding: 2px;
                    line-height: 1;
                    .fr;
                    .fz(24);
                    color: rgba(255, 255, 255, .8);
                    .bor(1px, solid, rgba(255, 255, 255, .8));
                    .borR(2px);
                  }
                }
                .sign {
                  .block;
                  .fz(24);
                  color: rgba(255, 255, 255, .8);
                }
                .info {
                  .cdiy(#ffe041);
                }
              }
            }
            .copy {
              .rel;
              .flex-r(1);
              .rel;
              z-index: 5;
              padding: 30/@rem;
              .fz(26);
              .center;
              color: rgb(255, 255, 255);
              .exp {
                .abs-center-vh;
              }
              p {
                .fz(18);
                margin-top: 10/@rem;
              }
            }
            /*&.type-coupon {*/
            &.type01 {
              &:before {
                background: -webkit-radial-gradient(transparent 0, transparent 5px, #f1a83f 5px) repeat-y;
                background: radial-gradient(transparent 0, transparent 5px, #f1a83f 5px) repeat-y;
                background-size: 20px 18px;
                background-position: -10px 3px;
              }
              &:after {
                background: -webkit-radial-gradient(transparent 0, transparent 5px, #f1a83f 5px) repeat-y;
                background: radial-gradient(transparent 0, transparent 5px, #f1a83f 5px) repeat-y;
                background-size: 20px 18px;
                background-position: 10px 3px;
              }
              .wrap {
                background-color: #f1a83f;
              }
            }
            /*&.type-ticket {*/
            &.type02 {
              &:before {
                background: -webkit-radial-gradient(transparent 0, transparent 5px, #3fa1f1 5px) repeat-y;
                background: radial-gradient(transparent 0, transparent 5px, #3fa1f1 5px) repeat-y;
                background-size: 20px 18px;
                background-position: -10px 3px;
              }
              &:after {
                background: -webkit-radial-gradient(transparent 0, transparent 5px, #3fa1f1 5px) repeat-y;
                background: radial-gradient(transparent 0, transparent 5px, #3fa1f1 5px) repeat-y;
                background-size: 20px 18px;
                background-position: 10px 3px;
              }
              .wrap {
                background-color: #3fa1f1;
              }
            }
            /*&.type-redpacket {*/
            &.type03 {
              &:before {
                background: -webkit-radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
                background: radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
                background-size: 20px 18px;
                background-position: -10px 3px;
              }
              &:after {
                background: -webkit-radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
                background: radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
                background-size: 20px 18px;
                background-position: 10px 3px;
              }
              .wrap {
                background-color: #e0552e;
              }
            }
            &.type04 {
              &:before {
                background: -webkit-radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
                background: radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
                background-size: 20px 18px;
                background-position: -10px 3px;
              }
              &:after {
                background: -webkit-radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
                background: radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
                background-size: 20px 18px;
                background-position: 10px 3px;
              }
              .wrap {
                background-color: #e0552e;
              }
            }
            /*&.type-expired {*/
            &.expired {
              &:before {
                background: -webkit-radial-gradient(transparent 0, transparent 5px, #bbb 5px) repeat-y;
                background: radial-gradient(transparent 0, transparent 5px, #bbb 5px) repeat-y;
                background-size: 20px 18px;
                background-position: -10px 3px;
              }
              &:after {
                background: -webkit-radial-gradient(transparent 0, transparent 5px, #bbb 5px) repeat-y;
                background: radial-gradient(transparent 0, transparent 5px, #bbb 5px) repeat-y;
                background-size: 20px 18px;
                background-position: 10px 3px;
              }
              .wrap {
                background-color: #bbb;
              }
            }
          }
        }
      }
    }

    .add-goods {
      .fix;
      bottom: 0;
      width: 100%;
      .ma-w(640);
      .borBox;
      letter-spacing: 2px;
      padding: 24/@rem;
      .center;
      .cf;
      .fz(28);
      .bdiy(#4670fe);
    }

  }


</style>
