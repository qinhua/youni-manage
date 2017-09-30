<template>
  <div class="goods-con" v-cloak>
    <!--<tab class="goods-tab" active-color="#4670fe">-->
    <!--&lt;!&ndash;<tab-item :selected="!params.saleStatus?true:false" @on-item-click="filterStatus"><i class="fa fa-th-large"></i>&nbsp;全部-->
    <!--</tab-item>-->
    <!--<tab-item :selected="params.saleStatus===1?true:false" @on-item-click="filterStatus(1)"><i-->
    <!--class="fa fa-podcast"></i>&nbsp;出售-->
    <!--</tab-item>-->
    <!--<tab-item :selected="params.saleStatus===2?true:false" @on-item-click="filterStatus(2)"><i class="fa fa-plug"></i>&nbsp;停售-->
    <!--</tab-item>&ndash;&gt;-->
    <!--<tab-item :selected="!params.goodsType?true:false" @on-item-click="filterStatus">全部-->
    <!--</tab-item>-->
    <!--<tab-item :selected="params.goodsType==='goods_type.1'?true:false" @on-item-click="filterStatus(1)">水-->
    <!--</tab-item>-->
    <!--<tab-item :selected="params.goodsType==='goods_type.2'?true:false" @on-item-click="filterStatus(2)">奶-->
    <!--</tab-item>-->
    <!--</tab>-->
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

    <div class="goods-list">
      <scroller :class="['inner-scroller',showSearch?'padding-more':'']" ref="goodsScroller" height="100%"
                :on-refresh="refresh" :on-infinite="infinite"
                refreshText="下拉刷新"
                :noDataText="goods&&goods.length?'没有更多数据':' '"
                snapping>
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
                <span class="unit-price">售价：￥{{item.goodsPrice|toFixed}}元</span>
                <span class="order-info">已售：{{item.goodsSaleCount}}件</span>
              </section>
              <label>来源：{{item.sellerName}}件</label>
            </div>
            <!--<div class="operate-con"></div>-->
            <!--<button type="button" class="btn btn-add" >添加首页</button>-->
            <!--<button type="button" class="btn btn-remove">下架</button>-->
          </section>
          <section class="item-bottom">
            <!--<div class="extra-info">-->
            <!--<p v-for="(ext, idx) in item.extras">{{ext.name}}<span>￥{{ext.type ? '-' : ''}}{{ext.value}}.00</span></p>-->
            <!--</div>-->
            <!--<div class="total-price">共{{item.buyCount}}件商品&nbsp;合计：<span>￥{{item.total}}</span>.00（含上楼费）</div>-->
            <div class="btns">
              <!--<a class="btn btn-del" @click="editGoods(item)">编辑</a>-->
              <a class="btn btn-del" @click="remove(item.goodsId)"><i class="fa fa-minus-circle"></i>&nbsp;下架</a>
              <!--<a class="btn btn-del" @click="setState(item.id,1)" v-else>上架</a>-->
              <!--<a class="btn btn-del" @click="delGoods(item.id||2)">删除</a>-->
            </div>
          </section>
        </section>
      </scroller>
    </div>
    <div class="add-goods" v-jump="['pick_from_seller']"><i class="fa fa-plus"></i>&nbsp添加商品</div>

    <div class="iconNoData abs-center-vh" v-if="!goods.length"><i></i>
      <p>暂无商品</p></div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Tab, TabItem,Search} from 'vux'
  import {goodsApi} from '../../service/main.js'

  export default {
    name: 'goods',
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
    components: {Tab, TabItem, Search},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getGoods()
      vm.$nextTick(function () {
        vm.$refs.goodsScroller.finishInfinite(true)
        vm.$refs.goodsScroller.resize()
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
        if (to.name === 'goods') {
          vm.getGoods()
        } else {
          vm.value = ''
        }
      }
    },
    methods: {
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
      },
      toDetail(id) {
        vm.$router.push({path: '/detail/' + id})
      },
      getGoods(isLoadMore) {
        vm.params.type = this.$route.params.type || 0
        if (vm.isPosting) return false
        !isLoadMore ? vm.params.pageNo = 1 : vm.params.pageNo++
        vm.isPosting = true
        vm.processing()
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
            /*if (resD.itemList.length) {
             for (var i = 0; i < resD.itemList.length; i++) {
             var cur = resD.itemList[i];
             vm.goods.push(cur)
             }
             } else {
             vm.noMore = true
             }*/
            resD.itemList.length ? vm.goods.concat(resD.itemList) : vm.noMore = true
          }
          console.log(vm.goods, '商品数据')
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
        status ? (vm.params.goodsType = status === 1 ? 'goods_type.1' : 'goods_type.2') : delete vm.params.goodsType
        vm.getGoods()
      },
      delGoods(id) {
        if (vm.isPosting) return false
        vm.confirm('确认删除？', '商品删除后不可恢复！', function () {
          vm.isPosting = true
          vm.loadData(goodsApi.delOrder, {id: id}, 'POST', function (res) {
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
        })
      },
      remove(id) {
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.loadData(goodsApi.remove, {goodsId: id}, 'POST', function (res) {
          vm.isPosting = false
          vm.toast('已下架')
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
<style scoped lang='less'>
  @import '../../../static/css/tools.less';

  .goods-con {
    .rel;
    height: 100%;
    .goods-tab {
      z-index: 10;
      /* .vux-tab-item {
        &.vux-tab-selected {
            .cf!important;
             background: #f34c18 !important;
        }
      }*/
    }

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
                .bdiy(#f1582a);
              }
            }
          }
        }
      }
    }

    .goods-list {
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
