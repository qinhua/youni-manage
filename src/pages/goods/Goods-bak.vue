<template>
  <div class="goods-con" v-cloak>
    <tab class="goods-tab" active-color="#4670fe">
      <tab-item :selected="!params.saleStatus?true:false" @on-item-click="filterStatus">
        <!--<i class="fa fa-th-large"></i>&nbsp;-->
        全部
      </tab-item>
      <tab-item :selected="params.saleStatus===1?true:false" @on-item-click="filterStatus(1)">
        <!--<i class="fa fa-podcast"></i>&nbsp;-->
        出售
      </tab-item>
      <tab-item :selected="params.saleStatus===2?true:false" @on-item-click="filterStatus(2)">
        <!--<i class="fa fa-plug"></i>&nbsp;-->
        停售
      </tab-item>
    </tab>
    <div class="goods-list">
      <scroller class="inner-scroller" ref="goodsScroller" height="100%" :on-refresh="refresh" :on-infinite="infinite"
                refreshText="下拉刷新"
                noDataText="没有更多数据"
                snapping>
        <!-- content goes here -->
        <section class="v-items" v-for="(item, index) in goods" :data-id="item.id" :data-orderNumber="item.orderNumber">
          <!--<h4 class="item-top"><i class="ico-store"></i>&nbsp;{{item.sellerName}}&nbsp;&nbsp;<i
            class="fa fa-angle-right cc"></i><span>{{item.statusName}}</span></h4>-->
          <section class="item-middle">
            <div class="img-con">
              <img :src="item.imgurl">
            </div>
            <div class="info-con">
              <h3>{{item.name}}</h3>
              <section class="middle">
                <span class="unit-price">售价：￥{{item.price}}</span>
                <span class="order-info">已售：{{item.saleCount}}</span>
              </section>
              <label>库存：{{item.stock}}</label>
            </div>
            <!--<div class="price-con">-->
            <!--<p class="price">￥{{item.price}}</p>-->
            <!--<p class="buy-count">x{{item.buyCount}}</p>-->
            <!--</div>-->
          </section>
          <section class="item-bottom">
            <!--<div class="extra-info">-->
            <!--<p v-for="(ext, idx) in item.extras">{{ext.name}}<span>￥{{ext.type ? '-' : ''}}{{ext.value}}.00</span></p>-->
            <!--</div>-->
            <!--<div class="total-price">共{{item.buyCount}}件商品&nbsp;合计：<span>￥{{item.total}}</span>.00（含上楼费）</div>-->
            <div class="btns">
              <a class="btn btn-del" @click="editGoods(item)">编辑</a>
              <a class="btn btn-del" @click="setState(item.id,2)" v-if="item.saleStatus===1">下架</a>
              <a class="btn btn-del" @click="setState(item.id,1)" v-else>上架</a>
              <!--<a class="btn btn-del" @click="delGoods(item.id||2)">删除</a>-->
            </div>
          </section>
        </section>
      </scroller>
    </div>
    <div class="add-goods" v-jump="['edit_goods',null,3]"><i class="fa fa-plus"></i>&nbsp添加商品</div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Tab, TabItem} from 'vux'
  import {goodsApi} from '../../service/main.js'

  export default {
    name: 'goods',
    data() {
      return {
        goods: [],
        params: {
          type: 0,
          pageSize: 10,
          pageNo: 1,
          saleStatus: 0
        },
        noMore: false,
        isPosting: false
      }
    },
    components: {Tab, TabItem},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getGoods()
      vm.$nextTick(() => {
        vm.$refs.goodsScroller.finishInfinite(true)
        vm.$refs.goodsScroller.resize()
      })
    },
    /* computed: {
     'params.type' () {
     return this.$route.params.type
     }
     }, */
    watch: {
      '$route'(to, from) {
        vm.getGoods()
      }
    },
    methods: {
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
      },
      buy(id) {
        vm.$router.push({path: '/detail/' + id})
      },
      getGoods(isLoadMore, status) {
        if (vm.isPosting) return false
        !isLoadMore ? vm.params.pageNo = 1 : vm.params.pageNo++
        vm.isPosting = true
        vm.loadData(goodsApi.list, vm.params, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          var resD = res.data.pager
          if (!isLoadMore) {
            if (resD.totalCount < vm.params.pageSize) {
              vm.noMore = true
            } else {
              vm.noMore = false
            }
            vm.goods = resD.itemList
          } else {
            resD.itemList.length ? vm.goods.concat(resD.itemList) : vm.noMore = true
          }
          // console.log(vm.goods, '商品数据')
          vm.isPosting = false
        }, function () {
          vm.isPosting = false
        })
      },
      refresh(done) {
        // console.log('下拉加载')
        setTimeout(function () {
          vm.getGoods()
          vm.$refs.goodsScroller.finishPullToRefresh()
        }, 1200)
      },
      infinite(done) {
        // console.log('无限滚动')
        setTimeout(function () {
          vm.getGoods(true)
          vm.$refs.goodsScroller.finishInfinite(true)
        }, 1000)
      },
      filterStatus(status) {
        vm.params.saleStatus = status || 0
        vm.getGoods()
      },
      delGoods(id) {
        if (vm.isPosting) return false
        vm.confirm('确认删除？', '商品删除后不可恢复！', function () {
          vm.isPosting = true
          vm.loadData(goodsApi.delOrder + '?id=' + id, vm.params, 'POST', function (res) {
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
        })
      },
      setState(id, status) {
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.loadData(goodsApi.setSaleStatus, {id: id, saleStatus: status}, 'POST', function (res) {
          vm.toast(status === 1 ? '上架成功' : '已下架')
          vm.getGoods()
          vm.isPosting = false
        }, function () {
          vm.isPosting = false
        })
      }, function () {
      },
      editGoods(data) {
        vm.$router.push({name: 'edit_goods', query: {linedata: encodeURIComponent(JSON.stringify(data))}})
      },
      pushOrder(id) {
        if (vm.isPosting) return false
        vm.confirm('确认催单？', '请不要频繁催单！', function () {
          vm.isPosting = true
          vm.loadData(goodsApi.cancelOrder + '?id=' + id, vm.params, 'POST', function (res) {
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
          // console.log('no')
        })
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  @import '../../../static/css/tools.less';
  /*.goods-con{}*/

  .goods-tab {
    z-index: 10;
    .vux-tab-item {
      &.vux-tab-selected {
        /* .cdiy(#f34c18) !important;
        .cf!important;
          background: #f34c18 !important;*/
      }
    }
  }

  .goods-list {
    .inner-scroller {
      .borBox;
      padding: 44px 0 50px;
      .v-items {
        .borBox;
        margin-bottom: 10/@rem;
        .bf;
        .item-top {
          padding: 14/@rem 20/@rem;
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
            .fz(22);
            .cdiy(@c2);
          }
        }
        .item-middle {
          padding: 14/@rem 20/@rem;
          .flex;
          .img-con {
            .rel;
            .size(130, 130);
            overflow: hidden;
            img {
              width: 100%;
              .abs-center-vh;
            }
          }
          .info-con {
            .flex-r(2);
            padding: 0 14/@rem;
            h3 {
              padding-bottom: 10/@rem;
              .txt-normal;
              .c3;
              .fz(26);
              .ellipsis-clamp-2;
            }
            .middle {
              .c9;
              .fz(20);
              .ellipsis-clamp-2;
              .unit-price {
                padding-right: 40/@rem;
                .c3;
              }
            }
            label {
              .fz(20);
            }
          }
          .price-con {
            .flex-r(1);
            .right;
            .price {
              padding-bottom: 10/@rem;
              .c3;
              .fz(24);
            }
            .buy-count {
              .c9;
              .fz(22);
            }
          }
        }
        .item-bottom {
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
            padding: 10/@rem 20/@rem;
            .right;
            .c3;
            .fz(22);
            .bor;
            span {
              .fz(30);
            }
          }
          .btns {
            padding: 20/@rem 20/@rem;
            overflow: hidden;
            .bor-t;
            a {
              .fr;
              padding: 4px 40/@rem;
              margin-left: 20/@rem;
              .cf;
              .fz(22);
              .borR(50px);
              &.btn-cancel, &.btn-del {
                .c6;
                .bor(1px, solid, #ccc);
              }
              &.btn-push, &.btn-appraise, &.btn-pay {
                .cdiy(@c2);
                .bor(1px, solid, @c2);
              }
            }
          }
        }
        &.grey {
          .c9!important;
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
</style>
