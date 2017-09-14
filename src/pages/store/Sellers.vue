<template>
  <div class="sellers-con" v-cloak>
    <tab class="sellers-tab" active-color="#4670fe">
      <tab-item :selected="type===3?true:false" @on-item-click="filterSeller(3)"><i class="fa fa-th-large"></i>&nbsp;全部
      </tab-item>
      <tab-item :selected="type===1?true:false" @on-item-click="filterSeller(1)"><i
        class="fa fa-beer"></i>&nbsp;水
      </tab-item>
      <tab-item :selected="type===2?true:false" @on-item-click="filterSeller(2)"><i class="fa fa-flask"></i>&nbsp;奶
      </tab-item>
    </tab>
    <div class="sellers-list">
      <scroller class="inner-scroller" ref="sellersScroller" height="100%" :on-refresh="refresh" :on-infinite="infinite"
                refreshText="下拉刷新"
                noDataText="就这么多了"
                snapping>
        <!-- content goes here -->
        <section class="v-items" v-for="(item, index) in sellers" :data-id="item.id"
                 :data-orderNumber="item.orderNumber">
          <h4 class="item-top"><i class="ico-store"></i>&nbsp;{{item.sellerName}}&nbsp;&nbsp;<i
            class="fa fa-angle-right cc"></i><span>{{item.statusName}}</span></h4>
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
          </section>
          <section class="item-bottom">
            <div class="btns">
              <a class="btn btn-del" @click="auth(item.id)" v-if="item.status===1">通过审核</a>
              <a class="btn btn-del" @click="setState(item.id,3)" v-else>冻结</a>
              <a class="btn btn-del" @click="setState(item.id,1)" v-else>恢复</a>
              <a class="btn btn-del" @click="del(item.id)">删除</a>
            </div>
          </section>
        </section>
      </scroller>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Tab, TabItem} from 'vux'
  import {storeApi} from '../../service/main.js'

  export default {
    name: 'sellers',
    data() {
      return {
        type:3,
        sellers: [],
        params: {
          type: '',
          pagerSize: 10,
          pageNo: 1
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
      vm.getSellers()
      vm.$nextTick(() => {
        vm.$refs.sellersScroller.finishInfinite(true)
        vm.$refs.sellersScroller.resize()
      })
    },
    /* computed: {
     'params.type' () {
     return this.$route.params.type
     }
     }, */
    watch: {
      '$route'(to, from) {
        vm.getSellers()
      }
    },
    methods: {
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
      },
      getSellers(isLoadMore, status) {
        if (vm.isPosting) return false
        !isLoadMore ? vm.params.pageNo = 1 : vm.params.pageNo++
        vm.processing()
        vm.isPosting = true
        vm.loadData(storeApi.list, vm.params, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          var resD = res.data.pager
          if (!isLoadMore) {
            if (resD.totalCount < vm.params.pageSize) {
              vm.noMore = true
            } else {
              vm.noMore = false
            }
            vm.sellers = resD.itemList
          } else {
            resD.itemList.length ? vm.sellers.concat(resD.itemList) : vm.noMore = true
          }
          console.log(vm.sellers, '店铺数据')
        }, function () {
          vm.isPosting = false
        })
      },
      refresh(done) {
        console.log('下拉加载')
        setTimeout(function () {
          vm.getSellers()
          vm.$refs.sellersScroller.finishPullToRefresh()
        }, 1200)
      },
      infinite(done) {
        console.log('无限滚动')
        setTimeout(function () {
          vm.getSellers(true)
          vm.$refs.sellersScroller.finishInfinite(true)
        }, 1000)
      },
      filterSeller(type) {
        switch (type) {
          case 1:
            vm.params.type = 'seller_type.1'
            break
          case 2:
            vm.params.type = 'seller_type.2'
            break
          case 3 :
            vm.params.type = 'seller_type.3'
            break
        }
        vm.getSellers()
      },
      del(id) {
        if (vm.isPosting) return false
        vm.confirm('确认删除？', '商品删除后不可恢复！', function () {
          vm.isPosting = true
          vm.loadData(storeApi.del,{id:id}, 'POST', function (res) {
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
        vm.loadData(storeApi.updateStatus, {sellerId: id, status: status}, 'POST', function (res) {
          vm.isPosting = false
          vm.toast(status === 3 ? '已冻结' : '已恢复')
          vm.getSellers()
        }, function () {
          vm.isPosting = false
        })
      }, function () {
      },
      auth(id) {
        if (vm.isPosting) return false
        vm.confirm('确认通过审核？', '', function () {
          vm.isPosting = true
          vm.loadData(storeApi.audit,{sellerId:id}, 'POST', function (res) {
            vm.isPosting = false
            vm.toast('已审核')
            vm.getSellers()
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

  .sellers-con {
    .sellers-tab {
      z-index: 10;
      .vux-tab-item {
        &.vux-tab-selected {
          /*   .cf!important;
             background: #f34c18 !important;*/
        }
      }
    }

    .sellers-list {
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
  }

</style>
