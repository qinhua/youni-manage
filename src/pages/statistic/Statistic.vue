<template>
  <div class="statistic-con" v-cloak>
    <button-tab class="btn-tab-con">
      <button-tab-item selected @click.native="onItemClick(1)">订单量</button-tab-item>
      <button-tab-item @click.native="onItemClick(2)">销售量</button-tab-item>
      <button-tab-item @click.native="onItemClick(3)">浏览量</button-tab-item>
    </button-tab>
    <div class="bottom-col">
      <ul class="blist orders-list" v-show="curType==='orders'">
        <li v-for="itm in orders">
          <div class="left-con">
            <span>总订单金额：<i>{{itm.orderTotal}}</i></span>
            <span>成交金额：<i>{{itm.orderNum}}</i></span>
          </div>
          <span class="time">{{itm.analysisDate}}</span>
        </li>
        <li v-for="itm in orders">
          <div class="left-con">
            <span>总订单金额：<i>{{itm.orderTotal}}</i></span>
            <span>成交金额：<i>{{itm.orderNum}}</i></span>
          </div>
          <span class="time">{{itm.analysisDate}}</span>
        </li>
        <li v-for="itm in orders">
          <div class="left-con">
            <span>总订单金额：<i>{{itm.orderTotal}}</i></span>
            <span>成交金额：<i>{{itm.orderNum}}</i></span>
          </div>
          <span class="time">{{itm.analysisDate}}</span>
        </li>
        <li v-for="itm in orders">
          <div class="left-con">
            <span>总订单金额：<i>{{itm.orderTotal}}</i></span>
            <span>成交金额：<i>{{itm.orderNum}}</i></span>
          </div>
          <span class="time">{{itm.analysisDate}}</span>
        </li>
        <li v-for="itm in orders">
          <div class="left-con">
            <span>总订单金额：<i>{{itm.orderTotal}}</i></span>
            <span>成交金额：<i>{{itm.orderNum}}</i></span>
          </div>
          <span class="time">{{itm.analysisDate}}</span>
        </li>
        <li v-for="itm in orders">
          <div class="left-con">
            <span>总订单金额：<i>{{itm.orderTotal}}</i></span>
            <span>成交金额：<i>{{itm.orderNum}}</i></span>
          </div>
          <span class="time">{{itm.analysisDate}}</span>
        </li>
      </ul>
      <ul class="blist sales-list" v-show="curType==='sales'">
        <div class="item-top">
          <span>近七天</span>
          <button type="button" :class="['btn',curSaleIdx===2?'active':'']" @click="changeSaleType(2)">奶</button>
          <button type="button" :class="['btn',curSaleIdx===1?'active':'']" @click="changeSaleType(1)">水</button>
          <button type="button" :class="['btn',curSaleIdx===0?'active':'']" @click="changeSaleType(0)">全部</button>
        </div>
        <li v-for="itm in curSales">
          <div class="left-con">
            <span>销售额：<i>{{itm.saleTotal}}</i></span>
            <span>销售数量：<i>{{itm.saleNum}}</i></span>
          </div>
          <span class="time">{{itm.analysisDate}}</span>
        </li>
      </ul>
      <ul class="blist puv-list" v-show="curType==='puv'">
        <div class="item-top">
          <span>近七天</span>
        </div>
        <li v-for="itm in puv">
          <div class="left-con">
            <span>PV：<i>{{itm.pv}}</i></span>
            <span>UV：<i>{{itm.pv}}</i></span>
          </div>
          <span class="time">{{itm.puvDate}}</span>
        </li>
      </ul>

    </div>
  </div>
</template>

<!--/* eslint-disable no-unused-vars */-->
<script>
  /* eslint-disable */
  let me
  let vm
  // import echarts from 'echarts'
  import {Tab, TabItem, ButtonTab, ButtonTabItem, Divider} from 'vux'
  import {statisticApi} from '../../service/main.js'

  export default {
    name: 'statistic-con',
    data() {
      return {
        seller: null,
        curType: 'orders',
        curSaleIdx: 0,
        curSaleType: 'goods.all',
        orders: [],
        sales: [],
        curSales: [],
        puv: [],
        statistic: [],
        isPosting: false,
        onFetching: false
      }
    },
    components: {Tab, TabItem, ButtonTab, ButtonTabItem, Divider},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.seller = vm.$store.state.global.userInfo || (me.sessions.get('ynAdminInfo') ? JSON.parse(me.sessions.get('ynAdminInfo')) : {})
      vm.getOrderData()
//      var myChart = vm.$refs.myChart
//      window.onresize = function () {
//        myChart.resize();
//      }
//      var myChart = echarts.init(document.getElementById('myChart'));
      /*myChart.setOption({
       color: vm.colors,

       tooltip: {
       trigger: 'none',
       axisPointer: {
       type: 'cross'
       }
       },
       legend: {
       data: ['PV', 'UV']
       },
       grid: {
       top: 70,
       bottom: 50
       },
       xAxis: [
       {
       type: 'category',
       axisTick: {
       alignWithLabel: true
       },
       axisLine: {
       onZero: false,
       lineStyle: {
       color: vm.colors[1]
       }
       },
       axisPointer: {
       label: {
       formatter: function (params) {
       return '浏览量  ' + params.value
       + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
       }
       }
       },
       data: ["2016-1", "2016-2", "2016-3", "2016-4", "2016-5", "2016-6", "2016-7", "2016-8", "2016-9", "2016-10", "2016-11", "2016-12"]
       },
       {
       type: 'category',
       axisTick: {
       alignWithLabel: true
       },
       axisLine: {
       onZero: false,
       lineStyle: {
       color: vm.colors[0]
       }
       },
       axisPointer: {
       label: {
       formatter: function (params) {
       return '浏览量  ' + params.value
       + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
       }
       }
       },
       data: ["2015-1", "2015-2", "2015-3", "2015-4", "2015-5", "2015-6", "2015-7", "2015-8", "2015-9", "2015-10", "2015-11", "2015-12"]
       }
       ],
       yAxis: [
       {
       type: 'value'
       }
       ],
       series: [
       {
       name: '2015 浏览量',
       type: 'line',
       xAxisIndex: 1,
       smooth: true,
       data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
       },
       {
       name: '2016 浏览量',
       type: 'line',
       smooth: true,
       data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7]
       }
       ]
       })*/
    },
    /*computed: {},*/
    watch: {
      '$route'(to, from) {
        if (to.name === 'statistic') {
          vm.getOrderData()
        }
      }
    },
    methods: {
      onItemClick(type) {
        switch (type) {
          case 1:
            vm.curType = 'orders'
            !vm.orders.length ? vm.getOrderData() : null
            break
          case 2:
            vm.curType = 'sales'
            !vm.sales.length ? vm.getSaleData() : null
            break
          case 3:
            vm.curType = 'puv'
            !vm.puv.length ? vm.getPuvData() : null
            break
        }
      },
      changeSaleType(type) {
        vm.curSaleIdx = type
        switch (type) {
          case 0:
            vm.curSaleType = 'goods.all'
            break
          case 1:
            vm.curSaleType = 'goods_type.1'
            break
          case 2:
            vm.curSaleType = 'goods_type.2'
            break
        }
        vm.getCurSale(vm.curSaleType)
      },
      getOrderData() {
        if (vm.onFetching) return false
        vm.processing()
        vm.onFetching = true
        vm.loadData(statisticApi.orderAnalysis, {days: 7}, 'POST', function (res) {
          var resD = res.data.itemList
          vm.orders = resD
          console.log(vm.orders, '订单统计数据')
          vm.onFetching = false
          vm.processing(0, 1)
        }, function () {
          vm.onFetching = false
          vm.processing(0, 1)
        })
      },
      getCurSale(type) {
        if (!type) {
          type = 'goods.all'
          vm.curSaleIdx = 0
          vm.curSaleType = 'goods.all'
        }
        let tmp
        if (vm.sales.length) {
          for (var i = 0; i < vm.sales.length; i++) {
            var cur = vm.sales[i]
            if (cur.goodsType === type) {
              tmp = cur.items
            }
          }
        }
        vm.curSales = tmp
      },
      getSaleData() {
        if (vm.onFetching) return false
        vm.processing()
        vm.onFetching = true
        vm.loadData(statisticApi.saleAnalysis, {days: 7}, 'POST', function (res) {
          var resD = res.data.itemList
          vm.sales = resD
          vm.getCurSale()
          console.log(vm.sales, '销售统计数据')
          vm.onFetching = false
          vm.processing(0, 1)
        }, function () {
          vm.onFetching = false
          vm.processing(0, 1)
        })
      },
      getPuvData() {
        if (vm.onFetching) return false
        vm.processing()
        vm.onFetching = true
        vm.loadData(statisticApi.puvAnalysis, {days: 7}, 'POST', function (res) {
          var resD = res.data.itemList
          vm.puv = resD
          console.log(vm.puv, '流量统计数据')
          vm.onFetching = false
          vm.processing(0, 1)
        }, function () {
          vm.onFetching = false
          vm.processing(0, 1)
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .statistic-con {
    .rel;
    height: 100%;
    overflow-x: hidden;
    .echarts {
      width: 400px;
      height: 400px;
    }
    .vux-button-group {
      margin-bottom: 10/@rem;
      .bf;
      a {
        &::after {
          .cf!important;
          /*border: 1px solid #ff7029 !important;*/
          border: 1px solid #4670fe !important;
        }
      }
      a.vux-button-group-current {
        /*background: #ff7029;*/
        background: #4670fe;
      }
    }
    .btn-tab-con {
      .fix;
      top: 0;
      width: 100%;
      z-index: 10;
      .borBox;
      padding: 20/@rem;
    }
    .bottom-col {
      margin-top: 120/@rem;
      padding-bottom: 40px;
    }
    .blist {
      li {
        .rel;
        .borBox;
        padding: 14/@rem 20/@rem;
        .bf;
        .bor-b;
        .left-con {
          span {
            .block;
            line-height: 1.5;
            .fz(24);
            .c3;
            i {
              font-style: normal;
              .c9;
            }
          }
        }
        .time {
          .abs-center-vertical;
          right: 24/@rem;
          .fz(24);
          .c9;
        }
      }
      .item-top {
        padding: 10/@rem 0;
        overflow: hidden;
        background: #eaeaea;
        .bor-t;
        span{
          .fl;
          padding: 0 20/@rem;
          line-height: 1.8;
          .c3;
          .fz(24);
        }
        button {
          .fr;
          margin-right: 15/@rem;
          padding: 2px 20/@rem;
          .fz(22);
          .c7;
          .bor(1px, solid, #ccc);
          .borR(3px);
          &.active {
            .cf;
            /*background: #ff7029;
            .bor(1px, solid, #ff7029);*/
            background: #4670fe;
            .bor(1px, solid, #4670fe);
          }
        }
      }
    }
  }
</style>
