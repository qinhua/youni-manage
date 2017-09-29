<template>
  <div class="sellers-con" v-cloak>
    <tab class="sellers-tab" active-color="#4670fe">
      <!--<tab-item :selected="type===3?true:false" @on-item-click="filterSeller(3)"><i class="fa fa-th-large"></i>&nbsp;全部
      </tab-item>
      <tab-item :selected="type===1?true:false" @on-item-click="filterSeller(1)"><i
        class="fa fa-beer"></i>&nbsp;水
      </tab-item>
      <tab-item :selected="type===2?true:false" @on-item-click="filterSeller(2)"><i class="fa fa-flask"></i>&nbsp;奶
      </tab-item> -->
      <tab-item :selected="!type?true:false" @on-item-click="filterSeller">全部
      </tab-item>
      <tab-item :selected="type===1?true:false" @on-item-click="filterSeller(1)">水
      </tab-item>
      <tab-item :selected="type===2?true:false" @on-item-click="filterSeller(2)">奶
      </tab-item>
      <tab-item :selected="type===3?true:false" @on-item-click="filterSeller(3)">水&奶
      </tab-item>
    </tab>
    <div class="sellers-list">
      <scroller class="inner-scroller" ref="sellersScroller" height="100%" :on-refresh="refresh" :on-infinite="infinite"
                refreshText="下拉刷新"
                noDataText="就这么多了"
                snapping>
        <!-- content goes here -->
        <swipeout>
          <!--<swipeout-item @on-close="" @on-open="" transition-mode="follow" v-for="(item, index) in sellers"
                         :data-id="item.id" key="index" @click="toDetail(item.id)" v-cloak>-->
          <swipeout-item @on-close="" @on-open="" transition-mode="follow" v-for="(item, index) in sellers"
                         :data-id="item.id" key="index" v-cloak>
            <div slot="right-menu">
              <swipeout-button @click.native="auth(item.id)" type="success" class="btn-audit" v-if="item.status===1">审核
              </swipeout-button>
              <swipeout-button @click.native="block(item.id)" type="warn" v-if="item.status===2">封禁
              </swipeout-button>
              <swipeout-button @click.native="recovery(item.id)" type="primary" class="btn-recovery"
                               v-if="item.status===3">解禁
              </swipeout-button>
              <!--<swipeout-button @click.native="onButtonClick('delete',item.id)" type="warn">删除</swipeout-button>-->
            </div>
            <div slot="content" class="demo-content vux-1px-t">
              <section class="v-items" :data-id="item.id" @click="toDetail(item.id)">
                <section :class="['wrap',(item.status===3)?'disabled':'']">
                  <span class="r-status s01" v-if="item.status===3">已封禁</span>
                  <span class="r-status s02" v-if="item.status===1">待审核</span>
                  <div class="img-con" :style="item.headimgurl?('background-image:url('+item.headimgurl+')'):''"></div>
                  <section class="infos">
                    <h3>{{item.name}}<span :class="['service_type',item.serviceTypeCls]">{{item.serviceTypeName}}</span>
                      <span class="businessTime">{{item.businessTime === '24小时' ? '24小时营业' : item.businessTime}}</span>
                    </h3>
                    <section class="middle">
                      <div class="score-con">
                        <ol class="star" v-if="item.sellerScore" v-cloak>
                          <li v-for="star in item.sellerScore">★</li>
                        </ol>
                        <ol class="star gray" v-else>
                          <li v-for="star in 5">★</li>
                        </ol>
                        <span>{{item.sellerScore | toFixed(1)}}分</span>
                      </div>
                      <span class="hasSell">已售{{item.sellerCount}}单</span>
                    </section>
                    <div class="tags">
                      <label :class="item.authLevelCls">{{item.authLevelName}}</label>
                      <!--<span class="dispatchTime" v-if="item.label">平均{{item.label}}分钟送达</span>-->
                      <span class="dispatchTime"><a :href="'tel:'+item.phone">{{item.phone}}</a></span>
                    </div>
                  </section>
                  <div class="bottom" v-if="item.ticket">
                    <label class="note" v-if="item.ticket" v-cloak><i class="ico-hui"></i>{{item.ticket}}</label>
                    <!--<span class="dispatchTime">平均{{item.dispatchTime}}分钟送达</span>-->
                    <span class="dispatchTime">{{item.label}}</span>
                  </div>
                </section>
              </section>
            </div>
          </swipeout-item>
        </swipeout>
      </scroller>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Tab, TabItem, Swipeout, SwipeoutItem, SwipeoutButton} from 'vux'
  import {storeApi} from '../../service/main.js'

  export default {
    name: 'sellers',
    data() {
      return {
        type: 0,
        sellers: [],
        params: {
          pagerSize: 10,
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
      vm.getSellers()
      vm.$nextTick(function () {
        vm.$refs.sellersScroller.finishInfinite(true)
        vm.$refs.sellersScroller.resize()
      })
    },
    watch: {
      '$route'(to, from) {
        if (to.name === 'sellers') {
          vm.getSellers()
        }
      }
    },
    methods: {
      onButtonClick(type, id) {
        if (type === 'delete') {
          vm.del(id)
        } else {
          vm.block(id)
        }
      },
      toDetail(id) {
        vm.$router.push({name: 'seller_detail', query: {id: id}})
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
          if (resD.itemList.length) {
            for (var i = 0; i < resD.itemList.length; i++) {
              var cur = resD.itemList[i]
              switch (cur.authLevel) {
                case 'seller_level.1':
                  cur.authLevelName = '普通店铺'
                  cur.authLevelCls = 'c1'
                  break
                case 'seller_level.2':
                  cur.authLevelName = '官方认证'
                  cur.authLevelCls = 'c2'
                  break
                case 'seller_level.3':
                  cur.authLevelName = '金牌店铺'
                  cur.authLevelCls = 'c3'
                  break
              }
              switch (cur.serviceType) {
                case 'seller_service_type.1':
                  cur.serviceTypeName = '水'
                  cur.serviceTypeCls = 'water'
                  break
                case 'seller_service_type.2':
                  cur.serviceTypeName = '奶'
                  cur.serviceTypeCls = 'milk'
                  break
                case 'seller_service_type.3':
                  cur.serviceTypeName = '水&奶'
                  cur.serviceTypeCls = 'water-milk'
                  break
              }
              cur.sellerScore = Math.ceil(cur.sellerScore)
              // cur.isSleep = me.compareDate(cur.businessTime, '2017-10-12')
            }
          }
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
          // console.log(vm.sellers, '店铺数据')
        }, function () {
          vm.isPosting = false
        })
      },
      refresh(done) {
        // console.log('下拉加载')
        setTimeout(function () {
          vm.getSellers()
          vm.$refs.sellersScroller.finishPullToRefresh()
        }, 1000)
      },
      infinite(done) {
        // console.log('无限滚动')
        setTimeout(function () {
          vm.getSellers(true)
          vm.$refs.sellersScroller.finishInfinite(true)
        }, 1000)
      },
      filterSeller(type) {
        vm.type = type
        switch (type) {
          case 1:
            vm.params.serviceType = 'seller_service_type.1'
            break
          case 2:
            vm.params.serviceType = 'seller_service_type.2'
            break
          case 3 :
            vm.params.serviceType = 'seller_service_type.3'
            break
          default :
            delete vm.params.serviceType
        }
        vm.getSellers()
      },
      auth(id) {
        if (vm.isPosting) return false
        vm.confirm('确认通过审核？', '', function () {
          vm.isPosting = true
          vm.loadData(storeApi.audit, {sellerId: id, status: 2}, 'POST', function (res) {
            vm.isPosting = false
            if (res.success) {
              vm.toast('审核成功')
              vm.getSellers()
            } else {
              vm.toast('操作失败！')
            }
          }, function () {
            vm.isPosting = false
          })
        }, function () {
          // console.log('no')
        })
      },
      block(id) {
        if (vm.isPosting) return false
        vm.confirm('确认封禁此店铺？', null, function () {
          vm.isPosting = true
          vm.loadData(storeApi.updateStatus, {sellerId: id, status: 3}, 'POST', function (res) {
            vm.isPosting = false
            if (res.success) {
              vm.toast('已封禁')
              vm.getSellers()
            } else {
              vm.toast('封禁失败！')
            }
          }, function () {
            vm.isPosting = false
          })
        }, function () {
        })
      },
      recovery(id) {
        if (vm.isPosting) return false
        vm.confirm('确认解禁此店铺？', null, function () {
          vm.isPosting = true
          vm.loadData(storeApi.updateStatus, {sellerId: id, status: 2}, 'POST', function (res) {
            vm.isPosting = false
            if (res.success) {
              vm.toast('解禁成功')
              vm.getSellers()
            } else {
              vm.toast('解禁失败！')
            }
          }, function () {
            vm.isPosting = false
          })
        }, function () {
        })
      },
      del(id) {
        if (vm.isPosting) return false
        vm.confirm('确认删除？', null, function () {
          vm.isPosting = true
          vm.loadData(storeApi.del, {id: id}, 'POST', function (res) {
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
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
    .vux-swipeout-item {
      .bor-b;
    }
    .vux-swipeout-button {
      font-size: 14px;
    }
    .btn-block {
      background: #5d5454;
    }
    .btn-recovery {
      background: orange;
    }
    .btn-audit {
      background: #84ce36;
    }
    .vux-1px-t:before {
      .none;
    }
    .sellers-list {
      .inner-scroller {
        .borBox;
        padding: 44px 0 50px;
        .v-items {
          .rel;
          padding: 20/@rem;
          .bf;
          &:not(:last-child) {
            .bor-b;
          }
          .sleep-tips {
            .abs;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            .cf;
            .fz(30);
            .bdiy(rgba(0, 0, 0, .6));
            .wrap {
              .borBox;
              padding: 0 30/@rem;
              .abs-center-vertical;
              width: 100%;
            }
            h3 {
              .rel;
              width: 100%;
              .txt-normal;
              span {
                .fz(20)
              }
            }
            .btn-reserve {
              .abs-center-vertical;
              right: 0;
              .size(120, 60);
              line-height: 60/@rem;
              .fz(24);
              .cf;
              .borR(4px);
              .bdiy(rgba(45, 199, 108, 0.5))
            }
          }
          .wrap {
            .rel;
            &.disabled {
              .infos {
                .f-grey(.8);
              }
            }
          }
          .r-status {
            .abs;
            left: 0;
            top: 0;
            z-index: 2;
            padding: 1px 2px;
            .fz(20);
            .cf;
            &.s01 {
              background: #53ca18;
              -webkit-animation: flash 5s linear infinite alternate;
              animation: flash 5s linear infinite alternate;
            }
            &.s02 {
              background: #111;
            }
          }
          .img-con {
            .abs-center-vertical;
            .size(140, 140);
            overflow: hidden;
            background: #f5f5f5 url(../../../static/img/bg_nopic.jpg) no-repeat center;
            -webkit-background-size: cover;
            background-size: cover;
          }
          .infos {
            .flex;
            .flex-d-v;
            .borBox;
            width: 100%;
            .h(140);
            padding-left: 170/@rem;
            h3 {
              .flex-r(1);
              .fz(26);
              .txt-normal;
              .c3;
              .ellipsis;
            }
            .middle {
              .flex-r(1);
              .price {
              }
              span {
                &.price {
                  .c3;
                  .fz(24);
                  .txt-del;
                }
                &.hasSell {
                  padding-left: 30/@rem;
                  .fz(22);
                  .c9;
                }
              }
              .score-con {
                .fl;
                overflow: hidden;
                span {
                  .fl;
                  .fz(22);
                  line-height: 2;
                  .cdiy(#ff9900);
                }
                .star {
                  .fl;
                  overflow: hidden;
                  &.gray {
                    li {
                      .c9;
                    }
                  }
                  li {
                    .fl;
                    margin-right: 10/@rem;
                    .rfz(16);
                    .cdiy(#ff9900);
                  }
                }
              }
            }
            .tags {
              .flex-r(1);
              label {
                .fl;
                margin-right: 10/@rem;
                padding: 1px 8px;
                line-height: 1.8;
                .cf;
                .fz(16);
                .borR(4px);
                &.c1 {
                  .bdiy(#7facf9);
                }
                &.c2 {
                  .bdiy(#84ce36);
                }
                &.c3 {
                  .bdiy(#e8b52d);
                }
              }
              .dispatchTime {
                .fr;
                padding-top: 10/@rem;
                .c9;
                .block;
                .fz(24);
                a {
                  .cdiy(#597bde);
                }
              }
            }
            .businessTime {
              .abs;
              right: 0;
              top: 0;
              .c9;
              .fz(20);
            }
          }
          .bottom {
            overflow: hidden;
          }
          .note {
            .fl;
            .rel;
            padding: 10/@rem 0 0 30/@rem;
            .c6;
            .block;
            .fz(20);
            &:before {
              .abs;
              .block;
              left: 0;
              top: 12/@rem;
              content: '';
              .size(26, 26);
              background: url(../../../static/img/ico_hui.png) center;
              .ele-base;
            }
          }
        }
        .service_type {
          margin-left: 4px;
          padding: 0 2px;
          font-weight: normal;
          .cf;
          .fz(22);
          background: #2acaad;
          .borR(2px);
          &.water {
            background: #2acaad;
          }
          &.milk {
            background: #74c361;
          }
          &.water-milk {
            background: #ad64d2;
          }
        }
      }
    }
  }

</style>
