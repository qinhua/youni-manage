<template>
  <div class="order-detail">
    <div :class="'status-col s' + details.status">
      <div class="left-con">
        <span v-if="details.status===1">待支付…<br><i>请尽快支付</i></span>
        <span v-if="details.status===2">待派送…<br><i>等待商家派达中</i></span>
        <span v-if="details.status===3">派送中…<br><i>商品正在途中</i></span>
        <span v-if="details.status===4">暂停中…<br><i>奶类订单已暂停派送</i></span>
        <span v-if="details.status===5">已完成…<br><i>交易已完成</i></span>
      </div>
      <div class="right-con"></div>
    </div>

    <div class="address-col">
      <div class="wrap">
        <i class="fa fa-map-marker i-map"></i>
        <div class="txt-con">
          <h3>收货人：{{details.userName}}<span>{{details.phone}}</span></h3>
          <p>地址：{{details.userAddress}}</p>
          <p>门牌号：{{details.houseCode}}</p>
        </div>
        <i class="fa fa-angle-right i-right"></i>
      </div>
    </div>

    <ul class="order-col">
      <li class="v-items" :data-id="details.id" :data-orderid="details.orderId"
          :data-orderNumber="details.appOrderNumber">
        <h4 class="item-top"><i class="ico-avatar"
                                :style="details.userImage?'background-image:url('+details.userImage+')':''"></i>&nbsp;{{details.userName}}&nbsp;&nbsp;<i
          class="fa fa-angle-right cc"></i><span>{{details.statusName}}</span><span class="remind-txt"
                                                                                    v-if="details.status===2&&details.remind">收到买家派送提醒</span>
        </h4>
        <ul>
          <li v-for="itm in details.goodsList" v-cloak>
            <section class="item-middle">
              <div class="img-con"
                   :style="itm.goodsImage?('background-image:url('+itm.goodsImage+')'):''"></div>
              <div class="info-con">
                <h3><span
                  :class="itm.goodsType==='goods_type.2'?'milk':''">{{itm.goodsType === 'goods_type.2' ? '奶' : '水'}}</span>{{itm.goodsName}}
                </h3>
                <section class="middle">
                  <span class="unit-price">￥{{itm.goodsPrice | toFixed}}元</span>
                  <span class="order-info" v-if="details.orderType===2">来自：水票兑换</span>
                  <div class="dispatch-info" v-if="itm.goodsType==='goods_type.2'">
                    <span>已送：{{itm.totalDispatcheNum}}件</span><span>待送：{{itm.waitDispatcheNum}}件</span>
                  </div>
                </section>
                <!--<label>{{itm.label}}</label>-->
              </div>
              <div class="price-con">
                <p class="price">总价：￥{{itm.goodsAmount | toFixed}}</p>
                <p class="buy-count">x{{itm.goodsNum}}</p>
              </div>
            </section>
          </li>
        </ul>
        <section class="item-bottom">
          <!--<div class="extra-info">
            <p v-for="(ext, idx) in item.extras">{{ext.name}}<span>￥{{ext.type ? '-' : ''}}{{ext.value}}.00</span>
            </p>
          </div>-->
          <!--<div class="total-price">
            共{{details.totalGoodsNum}}件商品&nbsp;合计：<span>￥{{details.payAmount | toFixed}}</span>（含上楼费）
          </div>-->
          <div class="total-price" v-if="details.payAmount!==details.totalAmount">共{{details.totalGoodsNum}}件商品&nbsp;&nbsp;合计：<i class="txt-normal txt-del c9">￥{{details.totalAmount | toFixed}}</i>&nbsp;&nbsp;实付：<span>￥{{details.payAmount | toFixed}}元</span>
          </div>
          <div class="total-price" v-else>共{{details.totalGoodsNum}}件商品&nbsp;&nbsp;合计：<span>￥{{details.payAmount | toFixed}}元</span></div>
          <!--<a class="btn btn-del" @click="cancelOrder(item.orderId)">取消订单</a>-->
          <!--<a class="btn btn-del" @click="delOrder(item.orderId)">删除订单</a>-->
          <!--<div class="btns" v-if="item.status===1">-->
          <!--<a class="btn btn-cancel" @click="pushPay(item.orderId)">提醒支付</a>-->
          <!--<a class="btn btn-del" @click="cancelOrder(item.orderId)">取消订单</a>-->
          <!--</div>-->
          <!--<div class="btns" v-if="details.status===2">
            <button type="button" class="btn btn-dispatch" @click="dispatchOrder(details.orderId)">派送</button>
          </div>-->
          <div class="btns" v-if="details.status===3">
            <div v-if="details.todayDispatch">
              <span class="status-txt">当天已派送</span>
              <span class="timestamp">{{details.createTime}}</span>
              <!--<button type="button" disabled class="btn btn-dispatch" @click="dispatch(details.orderId)">派送-->
              <!--</button>-->
            </div>
            <div v-else>
              <span class="status-txt disabled">当天未派送</span>
              <span class="timestamp">{{details.createTime}}</span>
              <!--<button type="button" class="btn btn-dispatch" @click="dispatch(details.orderId)">派送</button>-->
            </div>
          </div>
          <div class="score-info" v-if="details.status===5">
            <!--<span>买家评分：{{details.userScore}}星</span>-->
            <div class="has-score" v-if="details.userScore">
              <span>买家评分：</span>
              <ol class="star">
                <li v-for="star in details.userScore">★</li>
              </ol>
              <span>{{details.userScore}}星</span>
            </div>
            <span v-else>买家未评价</span>
          </div>
          <span class="timestamp">{{details.createTime}}</span>
        </section>
      </li>
    </ul>

    <div class="operate-col">
      <group class="list-modal">
        <!--<cell title="查看明细" link="/income_list">
          &lt;!&ndash;<i slot="icon" width="20" style="margin-right:5px;" class="fa fa-credit-card"></i>&ndash;&gt;
        </cell>-->
        <cell title="商家信息:" @click.native="toSeller(details.sellerId)">
          <h4 class="item-top"><i class="ico-seller"
                                  :style="details.sellerImage?'background-image:url('+details.sellerImage+')':''"></i>&nbsp;{{details.sellerName}} <i
            class="fa fa-chevron-right"></i>
          </h4>
        </cell>
      </group>
      <div class="btns">
        <a class="btn btn-dial" :href="'tel:'+details.phone"><i class="fa fa-phone"></i>&nbsp;联系买家</a>
        <a class="btn btn-dial" :href="'tel:'+details.sellerPhone"><i class="fa fa-phone"></i>&nbsp;联系卖家</a>
      </div>
    </div>

    <div class="extra-col">
      <p v-if="details.note">配送方式：{{JSON.parse(details.note).dispatchLabel}}</p>
      <p>派送时间：{{details.dispatchTime}}</p>
      <p>订单编号：{{details.appOrderNumber}}</p>
      <p>创建时间：{{details.createTime}}</p>
      <!--<p>付款时间：{{details.createTime}}</p>
      <p>派送时间：{{details.createTime}}</p>
      <p>成交时间：{{details.createTime}}</p>-->
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  let me
  let vm
  import {Group, Cell} from 'vux'
  import {orderApi} from '../../service/main.js'

  export default {
    name: 'order-detail',
    data() {
      return {
        id: null,
        details: {},
        isPosting: false
      }
    },
    components: {Group, Cell},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getDetail()
    },
    watch: {
      '$route'(to, from) {
        if (to.name === 'order_detail') {
          vm.getDetail()
        }
      }
    },
    methods: {
      toSeller(id) {
        vm.$router.push({name: 'seller_detail', query: {id: id}})
      },
      getDetail(cb) {
        vm.id = vm.$route.query.id
        if (vm.isPosting) return false
        vm.processing()
        vm.isPosting = true
        vm.loadData(orderApi.view, {orderId: vm.id}, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          if (res.success) {
            var resD = res.data
            resD.categoryName = (resD.type === 'goods_type.1') ? '水' : '奶'
            switch (resD.status) {
              case 1:
                resD.statusName = '待支付'
                break
              case 2:
                resD.statusName = '待派送'
                break
              case 3:
                resD.statusName = '派送中'
                break
              case 4:
                resD.statusName = '已暂停'
                break
              case 5:
                resD.statusName = '已完成'
                break
            }
            vm.details = resD
            // console.log(vm.details, '商品详情')
          }
          cb ? cb() : null
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      getAppraise(index) {
        vm.loadData(orderApi.appraise, {type: index || 0}, 'POST', function (res) {
          vm.appraiseData = vm.appraise = res.data.itemList
          // console.log(vm.appraiseData, '用户评价数据')
          cb ? cb() : null
        }, function () {
        })
      },
      delOrder(id) {
        if (vm.isPosting) return false
        vm.confirm('确认删除？', '订单删除后不可恢复！', function () {
          vm.isPosting = true
          vm.loadData(orderApi.del, {id: id}, 'POST', function (res) {
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
        })
      },
      cancelOrder(id) {
        if (vm.isPosting) return false
        vm.confirm('确认取消？', '订单取消后不可恢复！', function () {
          vm.isPosting = true
          vm.loadData(orderApi.cancel, {id: id}, 'POST', function (res) {
            vm.isPosting = false
            vm.toast('已取消')
          }, function () {
            vm.toast('取消失败')
            vm.isPosting = false
          })
        }, function () {
          // console.log('no')
        })
      },
      pushPay(id) {
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.loadData(orderApi.remind, {id: id}, 'POST', function (res) {
          vm.toast('提醒成功')
          vm.isPosting = false
        }, function () {
          vm.isPosting = false
        })
      },
      dispatchOrder(id) {
        if (vm.isPosting) return false
        vm.confirm('确认派送？', null, function () {
          vm.isPosting = true
          vm.loadData(orderApi.updateOrderStatus, {userType: 3, id: id, status: 3}, 'POST', function (res) {
            vm.isPosting = false
            vm.toast('派送成功')
            vm.getDetail()
          }, function () {
            vm.isPosting = false
          })
        }, function () {
        })
      },
      dispatch(id) {
        if (vm.isPosting) return false
        vm.isPosting = true
        /*var dispatchers = '<option value="">-请选择派送员-</option>'
         vm.loadData(orderApi.dispatcher, {orderId: id}, 'POST', function (res) {
         if (res.success) {
         if (res.data.itemList.length) {
         var resD = res.data.itemList
         for (var i = 0; i < resD.length; i++) {
         var cur = resD[i]
         dispatchers += '<option value="' + cur.id + ',' + cur.dispatcher + '">' + cur.dispatcher + '</option>'
         }
         } else {
         vm.toast('暂无派送员！')
         return
         }
         }
         vm.isPosting = false
         }, function () {
         vm.isPosting = false
         })
         vm.confirm('请选择派送员？', '<div class="despatchModal"><select name="dispatcher" id="dispatcher">' + dispatchers + '</select><!--<input id="dispatcher" type="text" placeholder="输入派送员姓名" required>--></div>', function () {
         var curVal = window.document.getElementById('dispatcher').value
         if (!curVal) {
         vm.toast('请选择派送员', 'warn')
         return false
         }
         vm.loadData(orderApi.dispatch, {orderId: id, dispatcher: curVal}, 'POST', function (res) {
         vm.isPosting = false
         if (res.success) {
         vm.toast('派送成功')
         } else {
         vm.toast(res.message || '支付失败！')
         }
         }, function () {
         vm.isPosting = false
         })
         }, function () {
         vm.isPosting = false
         }, '派送', null, true)*/

        vm.confirm('确认派送？', '', function () {
          vm.loadData(orderApi.dispatch, {orderId: id, dispatcher: ''}, 'POST', function (res) {
            vm.isPosting = false
            if (res.success) {
              vm.toast('派送成功')
              vm.getDetail()
            } else {
              vm.toast(res.message || '派送失败！')
            }
          }, function () {
            vm.isPosting = false
          })
        }, function () {
          vm.isPosting = false
        }, '派送')
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .order-detail {
    padding-bottom: 100/@rem;
    .status-col {
      height: 200/@rem;
      .cf;
      /* background: linear-gradient(left, #8ac4ff, #2352f1);
       background: -webkit-linear-gradient(left, #8ac4ff, #2352f1);*/
      &.s1 {
        background: url(../../../static/img/s1.png) no-repeat 88% center, linear-gradient(left, #8ac4ff, #2352f1);
        background: url(../../../static/img/s1.png) no-repeat 88% center, -webkit-linear-gradient(left, #8ac4ff, #2352f1);
        -webkit-background-size: auto 60%, auto 100%;
        background-size: auto 60%, auto 100%;
      }
      &.s2 {
        background: url(../../../static/img/s2.png) no-repeat 88% center, linear-gradient(left, #8ac4ff, #2352f1);
        background: url(../../../static/img/s2.png) no-repeat 88% center, -webkit-linear-gradient(left, #8ac4ff, #2352f1);
        -webkit-background-size: auto 60%, auto 100%;
        background-size: auto 60%, auto 100%;
      }
      &.s3 {
        background: url(../../../static/img/s3.png) no-repeat 88% center, linear-gradient(left, #8ac4ff, #2352f1);
        background: url(../../../static/img/s3.png) no-repeat 88% center, -webkit-linear-gradient(left, #8ac4ff, #2352f1);
        -webkit-background-size: auto 60%, auto 100%;
        background-size: auto 60%, auto 100%;
      }
      &.s4 {
        background: url(../../../static/img/s4.png) no-repeat right bottom, linear-gradient(left, #8ac4ff, #2352f1);
        background: url(../../../static/img/s4.png) no-repeat right bottom, -webkit-linear-gradient(left, #8ac4ff, #2352f1);
        -webkit-background-size: auto 60%, auto 100%;
        background-size: auto 60%, auto 100%;
      }
      &.s5 {
        background: url(../../../static/img/s6.png) no-repeat 88% center, linear-gradient(left, #8ac4ff, #2352f1);
        background: url(../../../static/img/s6.png) no-repeat 88% center, -webkit-linear-gradient(left, #8ac4ff, #2352f1);
        -webkit-background-size: auto 60%, auto 100%;
        background-size: auto 60%, auto 100%;
      }
      &.waitPay {
        background: #40ceca;
      }
      &.waitDispatch {
        background: #ffaa50;
      }
      &.dispatching {
        background: #ff7511;
      }
      &.paused {
        background: #8eaac3;
      }
      &.finished {
        background: #58c714;
      }
      .left-con {
        .fl;
        .rel;
        .borBox;
        width: 60%;
        height: 100%;
        padding: 24/@rem 0 24/@rem 24/@rem;
        span {
          .abs-center-vertical;
          left: 40/@rem;
          .fz(34);
          i {
            opacity: .8;
            font-style: normal;
            .fz(22);
          }
        }
      }
      .right-con {
        .fr;
        .rel;
        .borBox;
        width: 40%;
        height: 100%;
        padding: 24/@rem 24/@rem 24/@rem 0;
      }
    }

    .address-col {
      .rel;
      margin-bottom: 10/@rem;
      .bf;
      .bor-b;
      .wrap {
        padding: 20/@rem 0;
      }
      .i-map {
        .abs-center-vertical;
        left: 0;
        padding: 0 20/@rem;
        .fz(36);
        .cdiy(#6ba2fa);
      }
      .i-right {
        .abs-center-vertical;
        right: 0;
        padding: 0 20/@rem;
        .fz(40);
      }
      .txt-con {
        .borBox;
        padding: 0 55/@rem 0 70/@rem;
        h3 {
          width: 100%;
          padding: 10/@rem 0;
          .fz(24);
          .c3;
          .left;
          .txt-normal;
          overflow: hidden;
          span {
            .fr;
          }
        }
        p {
          .fz(22);
          .c6;
          line-height: 1.8;
        }
      }
      .add-address {
        width: 100%;
        padding: 24/@rem;
        .center;
        .cf;
        .fz(28);
        .bdiy(@c2);
      }
    }

    .order-col {
      .v-items {
        .borBox;
        margin-bottom: 14/@rem;
        .bf;
        .bor-t(1px, solid, #ddd);
        .item-top {
          padding: 14/@rem 20/@rem 14/@rem 14/@rem;
          .txt-normal;
          .c3;
          .fz(24);
          .bor-b;
          .ico-store {
            .fl;
            display: inline-block;
            margin-top: 2/@rem;
            font-size: inherit;
            .size(30, 30);
            background: url(../../../static/img/ico_store.png);
            .ele-base;
          }
          span {
            .fr;
            padding-left: 10/@rem;
            .fz(22);
            .cdiy(@c2);
            &.remind-txt {
              .cdiy(#78b933);
              padding-right: 14/@rem;
              .bor-r;
              -webkit-animation: flash 4.5s ease infinite;
              animation: flash 4.5s ease infinite;
            }
          }
        }
        .item-middle {
          .rel;
          padding: 14/@rem 20/@rem 14/@rem 14/@rem;
          min-height: 140/@rem;
          .bf8;
          .bor-b;
          .img-con {
            .abs;
            top: 14/@rem;
            .size(140, 140);
            overflow: hidden;
            background: #f5f5f5 url(../../../static/img/bg_nopic.jpg) no-repeat center;
            -webkit-background-size: cover;
            background-size: cover;
          }
          .info-con {
            .borBox;
            width: 100%;
            padding: 0 0 0 160/@rem;
            h3 {
              padding: 0 160/@rem 10/@rem 0;
              .txt-normal;
              .c3;
              .fz(26);
              .ellipsis-clamp-2;
              span {
                margin-right: 4px;
                padding: 0 2px;
                font-weight: normal;
                .cf;
                .fz(22);
                background: #2acaad;
                .borR(2px);
                &.milk {
                  background: #74c361;
                }
              }
            }
            .middle {
              .c9;
              .fz(22);
              .ellipsis-clamp-2;
              .unit-price {
                padding-right: 40/@rem;
                .c3;
                .fz(24);
              }
            }
            label {
              .fz(22);
              .progress {
                span {
                  padding-right: 20/@rem;
                }
              }
            }
          }
          .price-con {
            .abs;
            .borBox;
            padding: 14/@rem 20/@rem;
            height: 160/@rem;
            top: 0;
            right: 0;
            .price {
              padding-bottom: 10/@rem;
              .c3;
              .fz(24);
            }
            .buy-count {
              .fr;
              .right;
              .c9;
              .fz(22);
            }
          }
          .dispatch-info {
            padding-top: 8/@rem;
            span {
              padding-right: 28/@rem;
            }
          }
          .score-info {
            padding-top: 8/@rem;
            span {
              padding-right: 28/@rem;
            }
          }
        }
        &.grey {
          .c9!important;
        }
      }
      .item-bottom {
        .rel;
        .extra-info {
          margin-top: 2px;
          padding: 10/@rem 20/@rem;
          .bf8;
          p {
            .fz(22);
            .c3;
            span {
              .fr;
            }
            &:not(:last-child) {
              padding-bottom: 10/@rem;
            }
          }
        }
        .total-price {
          padding: 14/@rem 20/@rem;
          .right;
          .c3;
          .fz(22);
          span {
            .fz(30);
          }
        }
        .btns {
          padding: 20/@rem 20/@rem;
          overflow: hidden;
          .bor-t;
          button {
            .fr;
            padding: 4px 40/@rem;
            margin-left: 20/@rem;
            .c3;
            .fz(22);
            .bf;
            .borR(50px);
            &:disabled {
              .c9!important;
              .bor(1px, solid, #999) !important;
            }
            &.btn-cancel, &.btn-del {
              .c6;
              .bor(1px, solid, #ccc);
            }
            &.btn-push, &.btn-appraise, &.btn-pay, &.btn-dispatch {
              .cdiy(@c2);
              .bor(1px, solid, @c2);
            }
          }
          .status-txt {
            .fl;
            .cdiy(@c3);
            &.disabled {
              .c9;
            }
          }
          span {
            .fr;
          }
        }
        .score-info {
          margin-top: -20/@rem;
          .fl;
          overflow: hidden;
          padding: 20/@rem 20/@rem;
          .has-score {
            overflow: hidden;
            .fz(24);
            span {
              .fl;
            }
          }
          .star {
            .fl;
            margin-top: -6/@rem;
            overflow: hidden;
            li {
              .fl;
              margin-right: 10/@rem;
              .cdiy(#ff9900);
              .rfz(16);
              &.gray {
                .c9;
              }
            }
          }
          .noScore {
            padding: 0 22/@rem 20/@rem;
            .left;
            .cdiy(#9fb52b);
            .fz(24);
          }
        }
        .timestamp {
          display: block;
          padding: 0 22/@rem 20/@rem;
          .right;
          .c9;
          .fz(22);
        }
      }
    }

    .operate-col {
      .borBox;
      margin-bottom: 14/@rem;
      .bf;
      .item-top {
        padding: 10/@rem 0 10/@rem 0;
        .txt-normal;
        .c3;
        line-height: 54/@rem;
        .fz(24);
        .ico-seller {
          .size(50, 50);
        }
      }
      .weui-cell {
        line-height: inherit;
        padding: 18/@rem 24/@rem !important;
        .fz(26) !important;
      }
      .btns {
        padding: 10/@rem 20/@rem;
      }
      .btn-dial {
        .block;
        width: 100%;
        padding: 20/@rem 0;
        margin: 10/@rem auto;
        .cdiy(#47bd85);
        .fz(24);
        .borR(4px);
        .bor(1px, solid, #47bd85);
      }
    }

    .extra-col {
      .borBox;
      margin-bottom: 14/@rem;
      padding: 20/@rem;
      line-height: 1.6;
      .fz(22);
      .c7;
      .bf;
    }
  }

</style>
