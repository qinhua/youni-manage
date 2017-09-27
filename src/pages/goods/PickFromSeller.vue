<template>
  <div class="pick-seller-con" v-cloak>
    <div class="scroll-view" v-if="!showGoodsList">
      <div class="search-con">
        <search
          @result-click="resultClick"
          @on-change="getResult"
          v-model="value"
          placeholder="输入店铺名搜索"
          position="absolute"
          auto-scroll-to-top top="46px"
          @on-focus="onFocus"
          @on-cancel="onCancel"
          @on-submit="onSubmit"
          ref="search">
        </search>
        <!--过滤条-->
        <div class="bar-chamer">
          <div class="sellers-filter" ref="filtersMenu">
            <div class="v-filter-tabs">
              <ul class="v-f-tabs">
                <li :class="curFilterType==='types'?'mfilterActive':''" @click="showFilter('types',$event)">店铺分类<i
                  class="ico-arr-down"></i>
                </li>
                <li :class="curFilterType==='services'?'mfilterActive':''" @click="showFilter('services',$event)">业务分类<i
                  class="ico-arr-down"></i>
                </li>
                <li :class="curFilterType==='sorts'?'mfilterActive':''" @click="showFilter('sorts',$event)">排序<i
                  class="ico-arr-down"></i></li>
              </ul>
              <div class="filter-data" v-if="showFilterCon" :class="showFilterCon?'show':''" v-cloak>
                <ul class="filter-tags" v-show="curFilterDict">
                  <li v-for="(data,idx) in curFilterDict"
                      :class="curSelFilter[curFilterType].index==idx?'sfilterActive':''"
                      :data-key="data.key"
                      :data-value="data.value" @click="chooseFilter(idx,data.key,data.value,$event)" v-cloak>
                    {{data.value}}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="seller-list" @click="chooseGoods">
        <scroller class="inner-scroller" ref="sellerScroller" :on-refresh="refresh" :on-infinite="infinite"
                  refreshText="下拉刷新" noDataText="没有更多数据" snapping>
          <!-- content goes here -->
          <section class="v-items" v-for="(item, index) in results" :data-id="item.id" @click="chooseGoods(item.id)"
                   v-cloak>
            <section class="wrap">
              <div class="img-con" :style="item.headimgurl?('background-image:url('+item.headimgurl+')'):''"></div>
              <section class="infos">
                <h3>{{item.name}}<span :class="['service_type',item.serviceTypeCls]">{{item.serviceTypeName}}</span>
                  <span class="distance">{{(item.distance ? item.distance : 0) | toFixed(1, true)}}km</span>
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
                  <span class="dispatchTime" v-if="item.label" v-cloak>平均{{item.label}}分钟送达</span>
                </div>
              </section>
              <div class="bottom" v-if="item.ticket">
                <label class="note" v-if="item.ticket" v-cloak><i class="ico-hui"></i>{{item.ticket}}</label>
                <!--<span class="dispatchTime">平均{{item.dispatchTime}}分钟送达</span>-->
                <span class="dispatchTime">{{item.label}}</span>
              </div>
            </section>
            <section class="sleep-tips" v-if="item.isSleep" v-cloak>
              <div class="wrap">
                <h3>商家已打烊（{{item.runStartTime}}~{{item.runEndTime}}）<br><span>非营业时间仍可预定</span>
                  <button type="button" class="btn btn-reserve" @click="preBook(item.id)"><i class="fa fa-clock-o"
                                                                                             aria-hidden="true"></i>&nbsp;预定
                  </button>
                </h3>
              </div>
            </section>
          </section>
        </scroller>
      </div>

    </div>

    <goods-search :sellerId="curSellerId" @on-select="getGoodsData" v-else></goods-search>
  </div>
</template>
<!--/* eslint-disable no-unused-vars */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import {Tab, TabItem,Search} from 'vux'
  import {storeApi} from '../../service/main.js'
  import goodsSearch from '../../components/GoodsSearch.vue'

  export default {
    name: 'pick-seller-con',
    data() {
      return {
        value: '',
        curSellerId: null,
        results: [],
        clients: [],
        isPosting: false,
        onFetching: false,
        noMore: false,
        params: {
          pageSize: 10,
          pageNo: 1,
          sellerLevel: '',
          sellerType: '',
          sortType: ''
        },
        /* filter start */
        showFilterCon: false,
        filterOffset: 0,
        filters: {
          types: [
            {
              key: '',
              value: '全部'
            },
            {
              key: 'seller_level.1',
              value: '普通店'
            },
            {
              key: 'seller_level.2',
              value: '官方认证'
            },
            {
              key: 'seller_level.3',
              value: '金牌店'
            }
          ],
          services: [
            {
              key: '',
              value: '全部'
            },
            {
              key: 'seller_service_type.1',
              value: '水'
            },
            {
              key: 'seller_service_type.2',
              value: '奶'
            },
            {
              key: 'seller_service_type.3',
              value: '水&奶'
            }
          ],
          sorts: [
            {
              key: '',
              value: '默认排序'
            },
            {
              key: 1,
              value: '离我最近'
            },
            {
              key: 2,
              value: '销量最高'
            }
          ]
        },
        curFilterType: '', // 当前筛选分类
        curFilterDict: null, // 当前的filter数据
        curSelFilter: {
          types: {
            index: '',
            key: '',
            value: ''
          },
          services: {
            index: '',
            key: '',
            value: ''
          },
          sorts: {
            index: '',
            key: '',
            value: ''
          }
        }, // 当前选择的过滤条件
        /* filter end */
        /*choose goods*/
        showGoodsList: false
      }
    },
    components: {Tab, TabItem, Search, goodsSearch},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getSellers()
      vm.$nextTick(function () {
        vm.$refs.sellerScroller.finishInfinite(true)
        vm.$refs.sellerScroller.resize()
        // 点击区域之外隐藏筛选栏
        document.addEventListener('click', function (e) {
          if (e.target.offsetParent) {
            if (JSON.stringify(e.target.offsetParent.classList).indexOf('filter') === -1) {
              vm.hideFilter()
              return false
            }
          }
        }, false)
      })
    },
    /*computed: {},*/
    watch: {
      '$route'(to, from) {
        if (to.name === 'pick_from_seller') {
          vm.getSellers()
        } else {
          vm.value = ''
          vm.showGoodsList = false
        }
      }
    },
    methods: {
      /*滚动检测*/
      onScroll() {
        // 监听dom的scroll事件
        vm.throttle(vm.scrollHandler, 1000)
      },
      scrollHandler() {
        // 滚动中的真正的操作
        let target = vm.$refs.filtersMenu
        let docs = vm.$refs.scrollView
        let winH = document.body.clientHeight;
        let docH = docs.offsetHeight;
        let scrollTop = vm.$refs.nearby.scrollTop
        !vm.filterOffset ? vm.filterOffset = target.offsetTop : null
        // console.info('文档高度：' + winH + '\n内容高度：' + docH + '\n滚动高度：' + scrollTop + '\n筛选条位置：' + vm.filterOffset)
        if (vm.showFilterCon) {
          vm.hideFilter()
        }
        if (scrollTop >= vm.filterOffset) {
          target.classList.add('fixed')
        } else {
          target.classList.remove('fixed')
        }
        if (scrollTop >= (docH - winH) - 44) {
          // console.log('到底部了，需要加载了…');
          vm.onPullUp();
        }
      },
      resetScroll() {
        setTimeout(function () {
          let target = vm.$refs.filtersMenu
          target.classList.remove('fixed')
        }, 100)
      },
      getGoodsData(data) {
        vm.showGoodsList = false
        vm.selGoodsName = data.name || ''
        vm.params.goodsId = data.id || null
      },
      onButtonClick(type, id) {
        if (type === 'delete') {
          vm.del(id)
        } else {
          vm.block(id)
        }
      },
      refresh(done) {
        console.log('下拉加载')
        setTimeout(function () {
          vm.getSellers()
          vm.$refs.sellerScroller.finishPullToRefresh()
        }, 1000)
      },
      infinite(done) {
        console.log('无限滚动')
        setTimeout(function () {
          vm.getSellers(true)
          vm.$refs.sellerScroller.finishInfinite(true)
        }, 1000)
      },

      /* 页面数据 */
      getSellers(isLoadMore) {
        if (vm.isPosting) return false
        !isLoadMore ? vm.params.pageNo = 1 : vm.params.pageNo++
        vm.isPosting = true
        vm.processing()
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
          console.log(vm.sellers, '附近卖家')
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      onPullDown() {
        if (vm.isPosting) {
          return false
        } else {
          setTimeout(function () {
            vm.getSellers()
          }, 1000)
        }
      },
      onPullUp() {
        if (vm.isPosting) {
          return false
        } else {
          setTimeout(function () {
            vm.getSellers(true)
          }, 1000)
        }
      },
      block(id) {
        if (vm.isPosting) return false
        vm.confirm('确认屏蔽此客户？', null, function () {
          vm.isPosting = true
          vm.loadData(clientApi.block, {id: id}, 'POST', function (res) {
            vm.isPosting = false
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
          vm.loadData(clientApi.del, {id: id}, 'POST', function (res) {
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
        })
      },
      resultClick(item) {
      },
      getResult(val) {
        if (val) {
          vm.results = []
          // vm.getClients()
          for (let i = 0; i < vm.clients.length; i++) {
            if (vm.clients[i].nickname.indexOf(val) > -1 || vm.clients[i].phone.indexOf(val) > -1) {
              vm.results.push(vm.clients[i])
            }
          }
        } else {
          vm.results = vm.clients
        }
      },
      onSubmit() {
        this.$refs.search.setBlur()
        this.$vux.toast.show({
          type: 'text',
          position: 'top',
          text: 'on submit'
        })
        vm.getClients()
      },
      onFocus() {
        // console.log('on focus')
        vm.hideFilter()
      },
      onCancel() {
        // console.log('on cancel')
      },

      /* 店铺筛选 */
      /*外部param指定筛选*/
      hasFilter() {
        var paramFilter = vm.$route.params.type
        if (paramFilter) {
          switch (paramFilter) {
            case '1':
              vm.params.sellerType = 'seller_service_type.1'
              vm.curSelFilter.services = {
                index: '1',
                key: 'seller_service_type.1',
                value: '水'
              }
              break
            case '2':
              vm.params.sellerType = 'seller_service_type.2'
              vm.curSelFilter.services = {
                index: '2',
                key: 'seller_service_type.2',
                value: '奶'
              }
              break
            case '3':
              vm.params.sellerType = 'seller_service_type.3'
              vm.curSelFilter.services = {
                index: '3',
                key: 'seller_service_type.3',
                value: '水&奶'
              }
              break
          }
        }
      },
      showFilter(type, e) {
        if (vm.showFilterCon) {
          if (vm.curFilterType === type) {
            vm.curFilterType = ''
            vm.showFilterCon = false
          } else {
            vm.curFilterType = type
            vm.curFilterDict = vm.filters[type]
            vm.showFilterCon = true
          }
        } else {
          vm.curFilterType = type
          vm.curFilterDict = vm.filters[type]
          vm.showFilterCon = true
        }
      },
      hideFilter() {
        if (vm.showFilterCon) {
          vm.showFilterCon = false
          vm.curFilterType = ''
        }
      },
      chooseFilter(idx, key, value, e) {
        // console.log(arguments)
        vm.curSelFilter[vm.curFilterType].index = idx
        vm.curSelFilter[vm.curFilterType].key = key
        vm.curSelFilter[vm.curFilterType].value = value
        // console.error(JSON.stringify(vm.curSelFilter, null, 2))
        vm.curSelFilter.types.key ? vm.params.sellerLevel = vm.curSelFilter.types.key : delete vm.params.sellerLevel
        vm.curSelFilter.services.key ? vm.params.sellerType = vm.curSelFilter.services.key : delete vm.params.sellerType
        vm.curSelFilter.sorts.key ? vm.params.sortType = vm.curSelFilter.sorts.key : delete vm.params.sortType
        vm.hideFilter()
        vm.getSellers()
      },

      /*选择商品*/
      chooseGoods() {
        vm.showGoodsList = true;
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .pick-seller-con {
    .rel;
    height: 100%;
    /*overflow: scroll; // 此两个属性至关重要，不写@scroll监听不到滚动*/
    .search-con {
      .rel;
      .bf;
      z-index: 10;
      .vux-search-box {
        /*top: 0 !important;*/
        /*position: fixed !important;*/
        /*z-index: 20;*/
      }
      .vux-search-fixed {
        .static!important;
        top: 0 !important;
      }
    }
    .bar-chamer {
      min-height: 80/@rem;
    }

    .sellers-filter {
      .rel;
      z-index: 10;
      &.fixed {
        width: 100%;
        .fix;
        top: 0;
      }
      .v-filter-tabs {
        width: 100%;
        margin-bottom: 1px;
        padding: 10/@rem 0;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
        .bdiy(#fdfdfd);
        .v-f-tabs {
          height: 60/@rem;
          li {
            .pointer;
            .rel;
            .borBox;
            .fl;
            width: 33.3333%;
            height: 60/@rem;
            line-height: 60/@rem;
            .c3;
            .center;
            font-size: 14px;
            .ico-arr-down {
              .abs-center-vertical;
              width: 30px;
              height: 30px;
              &:before {
                content: "";
                position: absolute;
                width: 6px;
                height: 6px;
                border: 1px solid #666;
                border-width: 1px 0 0 1px;
                -webkit-transform: rotate(-135deg);
                transform: rotate(-135deg);
                top: 10px;
                left: 7px;
                .transi(.2s);
              }
            }
            &.mfilterActive {
              .cdiy(#f1582a);
              .ico-arr-down {
                &:before {
                  border-color: #f1582a;
                  -webkit-transform-origin: 0 center;
                  transform-origin: 0 center;
                  -webkit-transform: rotate(45deg);
                  transform: rotate(45deg);
                }
              }
            }
            &:nth-child(2) {
              border-left: 1px solid #eee;
              border-right: 1px solid #eee;
            }
          }
        }
        .filter-data {
          .abs;
          z-index: 10;
          .borBox;
          margin-top: 8/@rem;
          opacity: 0;
          height: 0;
          width: 100%;
          .bf;
          border-top: 1px solid #eee;
          .bsd(0, 10px, 18px, 0, rgba(0, 0, 0, 0.25));
          .transi(.2s);
          &.show {
            opacity: 1;
            height: auto;
            padding: 30/@rem 18/@rem;
          }
          .filter-tags {
            overflow: hidden;
            li {
              .pointer;
              .fl;
              padding: 3px 10px;
              margin: 10/@rem;
              line-height: 1;
              font-size: 12px;
              .c6;
              .bf1;
              .borR(10px);
              &.sfilterActive {
                .cf;
                .bdiy(#f1582a);
              }
            }
          }
        }
      }
    }

    .seller-list {
      .vux-swipeout-button-primary {
        background: #5d5454;
      }
      .vux-1px-t:before {
        .none;
      }
      .inner-scroller {
        .borBox;
        padding: 44px 0 50px;
        .v-items {
          .borBox;
          /*height: 150/@rem;*/
          margin-bottom: 10/@rem;
          .bf;
          .wrap {
            padding: 14/@rem 20/@rem;
            img {
              .size(80, 80);
              .abs-center-vertical;
              left: 20/@rem;
              .borR(50%);
            }
            .info-con {
              .borBox;
              padding-left: 100/@rem;
              h3 {
                padding-bottom: 10/@rem;
                .txt-normal;
                .c3;
                .fz(26);
                .ellipsis-clamp-2;
                a {
                  .iblock;
                  padding: 0 0 10/@rem 20/@rem;
                  .fr;
                  .fz(24);
                  .cdiy(#67b35a);
                }
              }
              .nums {
                .fz(22);
                span {
                  padding-right: 20/@rem;
                }
              }
              .progress {
                padding: 20/@rem 0;
                > div {
                  height: auto;
                }
              }
            }
          }
        }
      }
    }
  }

</style>
