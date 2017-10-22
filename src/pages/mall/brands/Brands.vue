<template>
  <div class="brands-con" v-cloak>
    <tab class="brands-tab" active-color="#4670fe">
      <tab-item :selected="!params.goodsType?true:false" @on-item-click="onItemClick">全部</tab-item>
      <tab-item :selected="params.goodsType=='goods_type.1'?true:false" @on-item-click="onItemClick(1)">水</tab-item>
      <tab-item :selected="params.goodsType=='goods_type.2'?true:false" @on-item-click="onItemClick(2)">奶</tab-item>
    </tab>
    <div class="brands-list">
      <scroller class="inner-scroller" ref="brandsScroller" :on-refresh="refresh" :on-infinite="infinite"
                refreshText="下拉刷新" noDataText="没有更多数据" snapping>
        <!-- content goes here -->
        <swipeout>
          <swipeout-item @on-close="" @on-open="" transition-mode="follow" v-for="(item, index) in brands"
                         :data-id="item.id" key="index">
            <div slot="right-menu">
              <swipeout-button @click.native="onButtonClick('edit',item.key,item)" background-color="orange">编辑
              </swipeout-button>
              <swipeout-button @click.native="onButtonClick('delete',item.key)" type="warn">删除</swipeout-button>
            </div>
            <div slot="content" class="demo-content vux-1px-t">
              <section class="v-items">
                <section class="wrap">
                  <!--<img :src="item.headimgurl">-->
                  <div class="info-con">
                    <h3>{{item.value}}<span
                      :class="item.goodsType==='goods_type.2'?'milk':''">{{item.goodsType === 'goods_type.2' ? '奶' : '水'}}</span>
                    </h3>
                  </div>
                </section>
              </section>
            </div>
          </swipeout-item>
        </swipeout>
      </scroller>
    </div>
    <div class="add-brand" v-jump="['edit_brands',null,3]"><i class="fa fa-plus"></i>&nbsp添加品牌</div>
  </div>
</template>
<!--/* eslint-disable no-unused-vars */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import {Tab, TabItem, Search, Swipeout, SwipeoutItem, SwipeoutButton} from 'vux'
  import {brandsApi} from '../../../service/main.js'

  export default {
    name: 'brands-con',
    data() {
      return {
        brands: [],
        noMore: false,
        isPosting: false,
        params: {
          pageSize: 10,
          pageNo: 1
        }
      }
    },
    components: {Tab, TabItem, Swipeout, SwipeoutItem, SwipeoutButton},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getBrands()
      vm.$nextTick(function () {
        vm.$refs.brandsScroller.finishInfinite(true)
        vm.$refs.brandsScroller.resize()
      })
    },
    computed: {},
    watch: {
      '$route'(to, from) {
        if (to.name === 'brands') {
          vm.getBrands()
        }
      }
    },
    methods: {
      refresh(done) {
        // console.log('下拉加载')
        setTimeout(function () {
          vm.getBrands()
          vm.$refs.brandsScroller.finishPullToRefresh()
        }, 1000)
      },
      infinite(done) {
        // console.log('无限滚动')
        setTimeout(function () {
          vm.getBrands(true)
          vm.$refs.brandsScroller.finishInfinite(true)
        }, 1000)
      },
      onItemClick(type) {
        type ? (vm.params.goodsType = (type === 1 ? 'goods_type.1' : 'goods_type.2')) : delete vm.params.goodsType
        vm.getBrands()
      },
      getBrands(isLoadMore) {
        if (vm.isPosting) return false
        vm.processing()
        vm.isPosting = true
        vm.loadData(brandsApi.list, vm.params, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          var resD = res.data.itemList
          vm.brands = resD
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      del(id) {
        vm.confirm('确认删除？', '删除后不可恢复！', function () {
          vm.loadData(brandsApi.del, {brandId: id}, 'POST', function (res) {
            vm.isPosting = false
            vm.getBrands()
          }, function () {
            vm.isPosting = false
          })
        }, function () {
        })
      },
      onButtonClick(type, id, linedata) {
        if (type === 'edit') {
          this.$router.push({
            name: 'edit_brands',
            query: {thedata: window.encodeURIComponent(JSON.stringify(linedata))}
          })
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

  .brands-con {
    height: 100%;
    overflow-y: auto;
    .brands-tab {
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
    .brands-list {
      .inner-scroller {
        .borBox;
        padding: 44px 0 20px 0;
        .v-items {
          .borBox;
          /*height: 150/@rem;*/
          margin-bottom: 10/@rem;
          .bf;
          .wrap {
            padding: 20/@rem 20/@rem;
            img {
              .size(80, 80);
              .abs-center-vertical;
              left: 20/@rem;
              .borR(50%);
            }
            .info-con {
              .borBox;
              /*padding-left: 100/@rem;*/
              h3 {
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
                span {
                  margin-left: 4px;
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
            }
          }
        }
      }
    }

    .add-brand {
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
