<template>
  <div class="pick-seller-con" v-cloak>
    <div class="scroll-view">
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
          ref="search" v-if="showSearch">
        </search>
        <!--过滤条-->
        <div class="bar-chamer">
          <div class="goods-filter" ref="filtersMenu">
            <div class="v-filter-tabs">
              <ul class="v-f-tabs">
                <li class="f-img" @click="showSearch=true"><i class="ico-search"></i>店铺搜索</li>
                <li :class="curFilterType==='types'?'mfilterActive':''" @click="showFilter('types',$event)">商品类目<i
                  class="ico-arr-down"></i>
                </li>
                <!--<li :class="curFilterType==='brands'?'mfilterActive':''" @click="showFilter('brands',$event)">品牌<i
                  class="ico-arr-down"></i>
                </li>-->
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

      <div class="seller-list">
        <scroller :class="['inner-scroller',showSearch?'padding-more':'']" ref="sellerScroller" :on-refresh="refresh"
                  :on-infinite="infinite"
                  refreshText="下拉刷新" :noDataText="goods.length?'没有更多数据':' '" snapping>
          <!-- content goes here -->
          <section class="v-items" v-for="(item, index) in goods" :data-id="item.goodsid">
            <!--<h4 class="item-top"><i class="ico-store"></i>&nbsp;{{item.sellerName}}&nbsp;&nbsp;<i
              class="fa fa-angle-right cc"></i><span>{{item.statusName}}</span></h4>-->
            <section class="item-middle">
              <div class="img-con"
                   :style="item.goodsImage?('background-image:url('+item.goodsImage+')'):''"></div>
              <div class="info-con">
                <h3><span
                  :class="item.goodsType==='goods_type.2'?'milk':''">{{item.goodsType === 'goods_type.2' ? '奶' : '水'}}</span>{{item.goodsName}}
                </h3>
                <section class="middle">
                  <span class="unit-price">售价：￥{{item.goodsPrice | toFixed}}元</span>
                  <span class="order-info">已售：{{item.goodsSaleCount}}件</span>
                </section>
                <label>来源：{{item.sellerName}}件</label>
              </div>
            </section>
            <section class="item-bottom">
              <!--<div class="extra-info">-->
              <!--<p v-for="(ext, idx) in item.extras">{{ext.name}}<span>￥{{ext.type ? '-' : ''}}{{ext.value}}.00</span></p>-->
              <!--</div>-->
              <!--<div class="total-price">共{{item.buyCount}}件商品&nbsp;合计：<span>￥{{item.total}}</span>.00（含上楼费）</div>-->
              <div class="btns">
                <!--<a class="btn btn-del" @click="editGoods(item)">编辑</a>-->
                <a class="btn btn-del" @click="add(item.goodsId)"><i class="fa fa-plus-circle">&nbsp;</i>上架</a>
                <!--<a class="btn btn-del" @click="setState(item.id,1)" v-else>上架</a>-->
                <!--<a class="btn btn-del" @click="delGoods(item.id||2)">删除</a>-->
              </div>
            </section>
          </section>
        </scroller>
      </div>

    </div>
    <div class="iconNoData abs-center-vh" v-if="!goods.length"><i></i>
      <p>暂无商品</p></div>
  </div>
</template>
<!--/* eslint-disable no-unused-vars */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import {Tab, TabItem, Search} from 'vux'
  import {goodsApi} from '../../service/main.js'
  import goodsSearch from '../../components/GoodsSearch.vue'

  export default {
    name: 'pick-seller-con',
    data() {
      return {
        value: '',
        showSearch: false,
        goods: [],
        result: [],
        isPosting: false,
        onFetching: false,
        noMore: false,
        params: {
          pageSize: 10,
          pageNo: 1
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
              key: 'goods_type.1',
              value: '桶装水'
            },
            {
              key: 'goods_type.2',
              value: '奶'
            }
          ],
          brands: [
            {
              key: '',
              value: '全部'
            },
            {
              key: 1,
              value: '怡宝'
            },
            {
              key: 2,
              value: '康师傅'
            },
            {
              key: 3,
              value: '百岁山'
            },
            {
              key: 4,
              value: '花果山'
            },
            {
              key: 5,
              value: '水老官'
            },
            {
              key: 6,
              value: '一方人'
            },
            {
              key: 7,
              value: '农夫山泉'
            },
            {
              key: 8,
              value: '八宝山'
            },
            {
              key: 9,
              value: '昆仑山'
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
          brands: {
            index: '',
            key: '',
            value: ''
          }
        }, // 当前选择的过滤条件
        /* filter end */
      }
    },
    components: {Tab, TabItem, Search, goodsSearch},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getGoods()
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
    watch: {
      '$route'(to, from) {
        if (to.name === 'pick_from_seller') {
          vm.getGoods()
        } else {
          vm.value = ''
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
      refresh(done) {
        // console.log('下拉加载')
        setTimeout(function () {
          vm.getGoods()
          vm.$refs.sellerScroller.finishPullToRefresh()
        }, 1000)
      },
      infinite(done) {
        // console.log('无限滚动')
        setTimeout(function () {
          vm.getGoods(true)
          vm.$refs.sellerScroller.finishInfinite(true)
        }, 1000)
      },

      /* 页面数据 */
      getGoods(isLoadMore) {
        if (vm.isPosting) return false
        !isLoadMore ? vm.params.pageNo = 1 : vm.params.pageNo++
        vm.isPosting = true
        vm.processing()
        vm.loadData(goodsApi.listAlone, vm.params, 'POST', function (res) {
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
            if (resD.itemList.length) {
              for (var i = 0; i < resD.itemList.length; i++) {
                var cur = resD.itemList[i];
                vm.goods.push(cur)
              }
            } else {
              vm.noMore = true
            }
          }
          // console.log(vm.goods, '商品数据')
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
            vm.getGoods()
          }, 1000)
        }
      },
      onPullUp() {
        if (vm.isPosting) {
          return false
        } else {
          setTimeout(function () {
            vm.getGoods(true)
          }, 1000)
        }
      },
      add(id) {
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.loadData(goodsApi.add, {goodsId: id}, 'POST', function (res) {
          vm.isPosting = false
          vm.toast('已上架')
          vm.getGoods()
        }, function () {
          vm.isPosting = false
        })
      },
      resultClick(item) {
      },
      getResult(val) {
        if (val) {
          vm.params.sellerName = val
        } else {
          delete vm.params.sellerName
        }
        vm.getGoods()
      },
      onSubmit() {
        this.$refs.search.setBlur()
        this.$vux.toast.show({
          type: 'text',
          position: 'top',
          text: 'on submit'
        })
        vm.getGoods()
      },
      onFocus() {
        vm.hideFilter()
      },
      onCancel() {
        vm.value = ''
        vm.showSearch = false
      },

      /* 商品筛选 */
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
        vm.curSelFilter.types.key ? vm.params.goodsType = vm.curSelFilter.types.key : delete vm.params.goodsType
        // vm.curSelFilter.brands.key ? vm.params.brandId = vm.curSelFilter.brands.key : delete vm.params.brandId
        vm.hideFilter()
        vm.getGoods()
      }
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

    .goods-filter {
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
            width: 50%;
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
              .cdiy(#4670fe);
              .ico-arr-down {
                &:before {
                  border-color: #4670fe;
                  -webkit-transform-origin: 0 center;
                  transform-origin: 0 center;
                  -webkit-transform: rotate(45deg);
                  transform: rotate(45deg);
                }
              }
            }
            &:nth-child(2) {
              border-left: 1px solid #eee;
              /*border-right: 1px solid #eee;*/
            }
            &.f-img {
              .ico-search {
                .abs-center-vertical;
                width: 30px;
                height: 30px;
                &:before {
                  content: "";
                  position: absolute;
                  width: 16px;
                  height: 16px;
                  background: url(../../../static/img/ico_search.png) center;
                  .ele-base;
                  top: 7px;
                  left: -22px;
                }
              }
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
                .bdiy(#4670fe);
              }
            }
          }
        }
      }
    }

    .seller-list {
      .inner-scroller {
        .borBox;
        padding: 84/@rem 0 50px;
        &.padding-more {
          padding: 170/@rem 0 50px;
        }
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
            .rel;
            padding: 14/@rem 20/@rem 14/@rem 14/@rem;
            min-height: 140/@rem;
            .bf;
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
                padding-bottom: 10/@rem;
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
                .fz(24);
                .ellipsis-clamp-2;
                .unit-price {
                  padding-right: 40/@rem;
                  .cdiy(@c2);
                }
                .order-info {
                  .fr;
                }
              }
              label {
                .fz(20);
              }
            }
            .operate-con {
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
              padding: 14/@rem 20/@rem;
              overflow: hidden;
              .bor-t;
              a {
                .fr;
                padding: 4px 40/@rem;
                margin-left: 20/@rem;
                .cf;
                .fz(22);
                .borR(5px);
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
