<template>
  <div class="seller-detail" v-cloak>

    <div class="scroll-view">
      <div class="seller-info">
        <div class="v-items" :data-id="seller.id">
          <div class="wrap">
            <div class="img-con" :style="seller.headimgurl?('background-image:url('+seller.headimgurl+')'):''"></div>
            <div class="infos">
              <h3>{{seller.name}}<span
                :class="['service_type',seller.serviceTypeCls]">{{seller.serviceTypeName}}</span>
                <span class="distance">{{(seller.distance ? seller.distance : 0) | toFixed(1, true)}}km</span>
              </h3>
              <div class="middle">
                <ol class="star" v-if="seller.sellerScore" v-cloak>
                  <li v-for="star in seller.sellerScore">★</li>
                </ol>
                <ol class="star" v-else>
                  <li class="gray" v-for="star in 5">★</li>
                </ol>
                <span
                  class="hasSell"><i>{{(seller.sellerScore || 0) | toFixed(1)}}分</i>已售{{seller.sellerCount}}单</span>
              </div>
              <div class="tags">
                <label class="c2">{{seller.authLevelName}}</label>
                <span class="dispatchTime" v-if="seller.label" v-cloak>平均{{seller.label}}分钟送达</span>
              </div>
            </div>
            <!--<div class="bottom">
              <label class="note" v-if="seller.note">{{seller.note || '商家特惠'}}</label>
            </div>-->
          </div>
        </div>
        <!--<div class="contacts">
          <p>配送电话：<a :href="'tel:'+seller.phone">{{seller.phone}}</a>，楼梯房需收取上楼费</p>
        </div>-->
      </div>

      <div class="operate-con">
        <h3><i class="fa fa-lightbulb-o"></i>&nbsp;当前状态：{{seller.statusName}}
          <button type="button" class="btn btn-audit" @click="auth(seller.id)" v-if="seller.status===1">审核</button>
          <button type="button" class="btn btn-block" @click="block(seller.id)" v-if="seller.status===2">封禁</button>
          <button type="button" class="btn btn-recovery" @click="recovery(seller.id)" v-if="seller.status===3">解禁
          </button>
        </h3>
      </div>
      <div class="operate-con">
        <h3><i class="fa fa-bullseye"></i>&nbsp;经营范围：{{seller.serviceTypeName}}
          <button type="button" class="btn btn-recovery" @click="changeSerType(seller.id)" v-if="seller.status===2">修改
          </button>
        </h3>
      </div>
      <!--<div class="operate-con">
        <h3><i class="fa fa-user-o"></i>&nbsp;收款账号：{{seller.serviceTypeName}}
          <button type="button" class="btn btn-recovery" @click="changeAccount(seller.id)" v-if="seller.status===2">变更
          </button>
        </h3>
      </div>-->
      <!--<div class="operate-con">
        <h3><i class="fa fa-clock-o"></i>&nbsp;到账时间：{{seller.serviceTypeName}}
          <button type="button" class="btn btn-recovery" @click="changeInTime(seller.id)" v-if="seller.status===2">修改
          </button>
        </h3>
      </div>-->
      <div class="bottom">
        <div class="detail-txt">
          <div class="title"><h3>基本信息<span>营业时间：{{seller.businessTime||'24小时'}}</span></h3></div>
          <div class="content basics">
            <p><i>公司名称：</i><span>{{seller.companyName}}</span></p>
            <p><i>公司地址：</i><span>{{seller.address}}</span></p>
            <p><i>联系电话：</i><span>{{seller.phone}}</span><a class="btn btn-dial" :href="'tel:'+seller.phone"><i
              class="fa fa-phone"></i>&nbsp;拨打</a></p>
          </div>
        </div>
      </div>

      <div class="bottom" v-if="seller.businessLicense" v-cloak>
        <div class="detail-txt">
          <div class="title"><h3>营业执照</h3></div>
          <div class="content license">
            <div>
              <img class="previewer-demo-img" v-lazy.container="seller.businessLicense" width="100"
                   @click="preview(0)">
            </div>
          </div>
        </div>
      </div>
      <div class="bottom" v-if="seller.idCardFace && seller.idCardBack" v-cloak>
        <div class="detail-txt">
          <div class="title"><h3>身份证(正/背)</h3></div>
          <div class="content ids">
            <div>
              <!-- <img class="previewer-demo-img" :src="seller.businessLicense" width="100"
                    @click="preview(1)">
               <img class="previewer-demo-img" :src="seller.businessLicense" width="100"
                    @click="preview(2)">-->
              <img class="previewer-demo-img" v-lazy.container="seller.idCardFace" width="100"
                   @click="preview(1)">
              <img class="previewer-demo-img" v-lazy.container="seller.idCardBack" width="100"
                   @click="preview(2)">
            </div>
          </div>
        </div>
      </div>

      <div class="bottom">
        <div class="detail-txt">
          <div class="title"><h3>店铺介绍</h3></div>
          <div class="content note">{{seller.note}}</div>
        </div>
      </div>
    </div>

    <div v-transfer-dom>
      <previewer :list="list" ref="previewer" :options="options"></previewer>
    </div>
  </div>
</template>

<!--/* eslint-disable no-unused-vars,indent */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import {Previewer, TransferDom} from 'vux'
  import {storeApi} from '../../service/main.js'

  export default {
    name: 'seller-detail',
    directives: {
      TransferDom
    },
    data() {
      return {
        sellerId: '',
        seller: {},
        isPosting: false,
        noMore: false,
        list: [],
        options: {
          getThumbBoundsFn(index) {
            // find thumbnail element
            let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
            // get window scroll Y
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            // optionally get horizontal scroll
            // get position of element relative to viewport
            let rect = thumbnail.getBoundingClientRect()
            // w = width
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
            // Good guide on how to get element coordinates:
            // http://javascript.info/tutorial/coordinates
          }
        }
      }
    },
    components: {Previewer},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getSeller()
    },
    watch: {
      '$route'(to, from) {
        if (to.name === 'seller_detail') {
          vm.getSeller()
        } else {
          try {
            vm.list = []
            vm.sellerId = ''
            vm.seller = {}
            this.$refs.previewer.close()
          } catch (e) {
            // console.log(e)
          }
        }
      }
    },
    methods: {
      preview(index) {
        this.$refs.previewer.show(index)
      },
      getSeller() {
        vm.sellerId = vm.$route.query.id
        vm.loadData(storeApi.view, {id: vm.sellerId}, 'POST', function (res) {
          if (res.data) {
            var resD = res.data
            switch (resD.authLevel) {
              case 'seller_level.1':
                resD.authLevelName = '普通店铺'
                break
              case 'seller_level.2':
                resD.authLevelName = '官方认证'
                break
              case 'seller_level.3':
                resD.authLevelName = '金牌店铺'
                break
            }
            switch (resD.status) {
              case 1:
                resD.statusName = '待审核'
                break
              case 2:
                resD.statusName = '正常营业'
                break
              case 3:
                resD.statusName = '已封禁'
                break
              case 4:
                resD.statusName = '已拒绝'
                break
            }
            switch (resD.serviceType) {
              case 'seller_service_type.1':
                resD.serviceTypeName = '水'
                resD.serviceTypeCls = 'water'
                break
              case 'seller_service_type.2':
                resD.serviceTypeName = '奶'
                resD.serviceTypeCls = 'milk'
                break
              case 'seller_service_type.3':
                resD.serviceTypeName = '水&奶'
                resD.serviceTypeCls = 'water-milk'
                break
            }
            resD.sellerScore = Math.ceil(resD.sellerScore)
            vm.seller = resD
            vm.seller.businessLicense ? vm.list.push({src: vm.seller.businessLicense}) : null
            vm.seller.idCardFace ? vm.list.push({src: vm.seller.idCardFace}) : null
            vm.seller.idCardBack ? vm.list.push({src: vm.seller.idCardBack}) : null
          }
        })
      },
      auth(id) {
        if (vm.isPosting) return false
        vm.confirm('确认通过审核？', '', function () {
          //同意
          vm.isPosting = true
          vm.loadData(storeApi.updateStatus, {sellerId: id, status: 2}, 'POST', function (res) {
            vm.isPosting = false
            if (res.success) {
              vm.toast('已通过审核')
              vm.getSeller()
            } else {
              vm.toast('操作失败！')
            }
          }, function () {
            vm.isPosting = false
          })
        }, function () {
          //拒绝
          vm.isPosting = true
          vm.loadData(storeApi.updateStatus, {sellerId: id, status: 4}, 'POST', function (res) {
            vm.isPosting = false
            if (res.success) {
              vm.toast('已拒绝')
              vm.getSeller()
            } else {
              vm.toast('操作失败！')
            }
          }, function () {
            vm.isPosting = false
          })
        }, '通过', '拒绝')
      },
      block(id) {
        if (vm.isPosting) return false
        vm.confirm('确认封禁此店铺？', null, function () {
          vm.isPosting = true
          vm.loadData(storeApi.updateStatus, {sellerId: id, status: 3}, 'POST', function (res) {
            vm.isPosting = false
            if (res.success) {
              vm.toast('已封禁')
              vm.getSeller()
            } else {
              vm.toast('封禁失败！')
            }
          }, function () {
            vm.isPosting = false
          })
        }, function () {
          vm.isPosting = false
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
              vm.getSeller()
            } else {
              vm.toast('解禁失败！')
            }
          }, function () {
            vm.isPosting = false
          })
        }, function () {
          vm.isPosting = false
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
      changeSerType(id){
        vm.confirm('请选择营业范围', '<div class="customModal"><select id="serviceType"><option value="seller_service_type.3">全部</option><option value="seller_service_type.1">水</option><option value="seller_service_type.2">奶</option></select></div>', function () {
          if (vm.isPosting) return false
          vm.isPosting = true
          var curVal = window.document.getElementById('serviceType').value
          vm.loadData(storeApi.update, {
            sellerId: id,
            serviceType: curVal
          }, 'POST', function (res) {
            vm.isPosting = false
            if (res.success) {
              vm.$vux.confirm.hide()
              vm.toast('修改成功')
              vm.getSeller()
            } else {
              vm.toast(res.message || '操作失败！', 'warn')
            }
          }, function () {
            vm.isPosting = false
          }, true)
        }, function () {
          vm.isPosting = false
        }, null, null, true)
        setTimeout(function () {
          window.document.getElementById('serviceType').value = vm.seller.serviceType
        }, 100)
      },
      changeAccount(id){
        vm.confirm('请填写收款人', '<div class="customModal"><input id="wxAccount" type="text" placeholder="输入收款人微信号" required></div>', function () {
          /*if (!me.isWeixin) {
           vm.toast('请在微信中操作！')
           return
           }*/
          if (vm.isPosting) return false
          vm.isPosting = true
          var curVal = window.document.getElementById('wxAccount').value
          if (!curVal) {
            vm.toast('请填写收款人', 'warn')
            return false
          }
          vm.loadData(storeApi.setAccount, {
            sellerId: id,
            account: curVal
          }, 'POST', function (res) {
            vm.isPosting = false
            if (res.success) {
              vm.$vux.confirm.hide()
              vm.toast('已变更')
              vm.getSeller()
            } else {
              vm.toast(res.message || '操作失败！', 'warn')
            }
          }, function () {
            vm.isPosting = false
          }, true)
        }, function () {
          vm.isPosting = false
        }, null, null, true)
      },
      changeInTime(id){
        vm.confirm('请选择营业范围', '<div class="customModal"><select id="inTime"><option value="seller_service_type.3">全部</option><option value="seller_service_type.1">水</option><option value="seller_service_type.2">奶</option></select></div>', function () {
          if (vm.isPosting) return false
          vm.isPosting = true
          var curVal = window.document.getElementById('inTime').value
          vm.loadData(storeApi.updateTime, {
            sellerId: id,
            serviceType: curVal
          }, 'POST', function (res) {
            vm.isPosting = false
            if (res.success) {
              vm.$vux.confirm.hide()
              vm.toast('修改成功')
              vm.getSeller()
            } else {
              vm.toast(res.message || '操作失败！', 'warn')
            }
          }, function () {
            vm.isPosting = false
          }, true)
        }, function () {
          vm.isPosting = false
        }, null, null, true)
        setTimeout(function () {
          window.document.getElementById('inTime').value = vm.seller.serviceType
        }, 100)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .seller-detail {
    .rel;
    height: 100%;
    z-index: 1;
    overflow: hidden;
    .scroll-view {
      height: 100%;
      overflow: auto;
    }
    .swiper-shop {
      margin-bottom: 10/@rem;
      .swiper-pagination {
        bottom: 5px;
      }
      .swiper-pagination-bullet-active {
        background: #eee;
      }
    }

    .seller-info {
      background: url(../../../static/img/bg_seller.jpg) no-repeat top center;
      .rbg-size(100%, 100%);
      .v-items {
        .rel;
        padding: 20/@rem;
        .wrap {
          .rel;
        }
        .img-con {
          .abs;
          top: 0;
          .size(150, 150);
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
          .h(150);
          padding-left: 170/@rem;
          h3 {
            .flex-r(1);
            .fz(28);
            .txt-normal;
            .cf;
            .ellipsis;
          }
          .middle {
            .flex-r(1);
            .price {
            }
            span {
              &.price {
                .cf;
                .fz(24);
                .txt-del;
              }
              &.hasSell {
                .ce;
                .fz(22);
                i {
                  .iblock;
                  padding: 6/@rem 30/@rem 0 0;
                  .txt-normal;
                  .cdiy(#ff9900);
                }
              }
            }
            .star {
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
          }
          .tags {
            .flex-r(1);
            label {
              .fl;
              margin-right: 10/@rem;
              padding: 1px 8px;
              line-height: 1.8;
              .cf;
              .fz(20);
              .borR(4px);
              &.c1 {
                .bdiy(#fd5900);
              }
              &.c2 {
                .bdiy(#78c725);
              }
              &.c3 {
                .bdiy(#c77e25);
              }
            }
            .dispatchTime {
              .fr;
              padding-top: 10/@rem;
              .cc;
              .block;
              .fz(20);
            }
          }
          .distance {
            .abs;
            right: 0;
            top: 0;
            .cc;
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
          .cd;
          .block;
          .fz(20);
          &:before {
            .abs;
            .block;
            left: 0;
            top: 16/@rem;
            content: '惠';
            .size(26, 26);
            .center;
            line-height: 26/@rem;
            background: #f38918;
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
      .contacts {
        padding: 5px 20/@rem;
        .fz(20);
        .cf;
        background: rgba(0, 0, 0, .5);
        p {
          .ellipsis-clamp-2;
        }
        a {
          .cdiy(#38aee8);
        }
      }
    }

    .operate-con {
      .borBox;
      padding: 20/@rem 26/@rem;
      .bf;
      &:not(:last-child) {
        /*margin-bottom: 10/@rem;*/
        .bor-b;
      }
      h3 {
        .rel;
        font-weight: normal;
        .fz(24);
      }
      .btn {
        .abs-center-vertical;
        right: 0;
        .fz(24);
        .cf;
        .block;
        padding: 4/@rem 20/@rem;
        .borR(4px);
        &.btn-audit {
          background: #5bc331;
        }
        &.btn-block {
          background: #ec1f14;
        }
        &.btn-recovery {
          background: #f9a11e;
        }
      }
    }

    .list-modal {
      .weui-cells {
        margin-top: 10/@rem;
        padding: 0;
      }
      .weui-cell {
        padding: 26/@rem !important;
        .fz(26) !important;
      }
    }

    .bottom {
      margin-top: 14/@rem;
      .title {
        .borBox;
        padding: 20/@rem 0 10/@rem;
        .bf;
        .bor-t;
        .bor-b;
        h3 {
          padding-left: 20/@rem;
          .fz(24);
          background: #fff;
          .bor-l(3px, solid, #4670fe);
          span {
            .fr;
            padding-right: 20/@rem;
            font-weight: normal;
            .c9;
          }
        }
      }
      .content {
        .borBox;
        padding: 24/@rem 30/@rem;
        min-height: 100/@rem;
        .fz(24);
        .c3;
        .bf;
        &.basics {
          .c3;
          p {
            .rel;
            padding: 12/@rem 0;
            overflow: hidden;
            > i {
              font-style: normal;
              .fl;
            }
            span {
              .block;
              .c6;
              overflow: hidden;
            }
          }
          .btn-dial {
            .abs-center-vertical;
            right: 0;
            .fz(24);
            .cf;
            .block;
            padding: 10/@rem 20/@rem;
            background: #5bc331;
            .borR(4px);
          }
        }
        &.license {
          img {
            width: 30%;
            margin-right: 10/@rem;
          }
        }
        &.ids {
          overflow: hidden;
          img {
            .fl;
            width: 48%;
            max-height: 200/@rem;
            margin-right: 10/@rem;
          }
        }
        &.note {
          padding: 30/@rem 30/@rem;
          margin-bottom: 40px;
        }
      }
    }
  }

</style>
