<template>
  <div class="coupon-edit-con" v-cloak>
    <group>
      <!--<x-switch title="新用户优惠" v-model="newUser"></x-switch>-->
      <popup-picker title="店铺类型" :data="serTypes" :columns="1" v-model="tmpSerType" @on-show=""
                    @on-hide="" @on-change="changeSeller"></popup-picker>
      <div v-if="!newUser">
        <popup-picker title="商品类型：" :data="types" :columns="1" v-model="tmpType" ref="picker3" @on-show=""
                      @on-hide="" @on-change="changeType"></popup-picker>
        <!--<x-input title="优惠名称：" placeholder="优惠名称" required text-align="right" v-model="params.name"></x-input>-->
        <x-input title="优惠折扣：" placeholder="如1折" required text-align="right" v-model="params.discountRate"></x-input>
        <x-input title="最大优惠：" placeholder="最高优惠金额" required text-align="right"
                 v-model="params.maxDiscountAmount"></x-input>
        <x-input title="优惠券数量：" placeholder="优惠券数量" required text-align="right" type="number"
                 v-model="params.couponNum"></x-input>
        <!--<datetime title="开始时间" required v-model="params.beginTime" @on-change="onChange"></datetime>-->
        <x-switch title="是否过期" v-model="needExpire"></x-switch>
        <datetime title="过期时间：" v-model="params.expireTime" @on-change="onChange" v-show="needExpire"></datetime>
      </div>
      <div v-else>
        <x-input title="优惠折扣：" placeholder="如1折" required text-align="right" v-model="params.discountRate"></x-input>
        <x-input title="最大优惠：" type="number" placeholder="最高优惠金额" required text-align="right"
                 v-model="params.maxDiscountAmount"></x-input>
      </div>
    </group>
    <group class="bottom" v-if="!newUser">
      <x-textarea title="优惠说明：" :max="20" placeholder="如水票买20送1" @on-blur="" v-model="params.discountNote"
                  show-clear></x-textarea>
    </group>
    <div class="btn btn-save" @click="update"><i class="fa fa-save"></i>&nbsp;保存</div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {
    Group,
    XInput,
    Datetime,
    PopupPicker,
    XTextarea,
    XSwitch
  } from 'vux'
  import {couponApi, commonApi} from '../../../service/main.js'

  export default {
    name: 'coupon-edit',
    data() {
      return {
        formatValueFunction(val) {
          return val.replace(/-/g, '$')
        },
        isPosting: false,
        couponId: null,
        needExpire: false,
        newUser: true,
        types: [
          {
            key: '全部',
            value: '全部',
            name: '全部'
          },
          {
            key: 'goods_type.1',
            value: '水',
            name: '水'
          },
          {
            key: 'goods_type.2',
            value: '奶',
            name: '奶'
          },
          /*{
           key: 'goods_type.3',
           value: '水票',
           name: '水票'
           }*/
        ],
        serTypes: [{key: 1, value: '直营店', name: '直营店'}, {key: 2, value: '非直营店', name: '非直营店'}],
        tmpType: ['全部'],
        tmpSerType: ['直营店'],
        params: {
          // newUser: true,
          sellerType: '',
          discountRate: '',
          maxDiscountAmount: ''
        }
      }
    },
    components: {
      Group,
      XInput,
      Datetime,
      PopupPicker,
      XTextarea,
      XSwitch
    },
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
//      vm.params.id ? vm.getData() : null
      vm.switchData(vm.serTypes, vm.tmpSerType, 'sellerType')
    },
    watch: {
      needExpire() {
        !vm.needExpire ? vm.params.expireTime = '' : null
      },
      'newUser'() {
        if (vm.newUser) {
          vm.params = {
            sellerType: '',
            discountRate: '',
            maxDiscountAmount: ''
          }
        } else {
          vm.params = {
            newUser: false,
            goodsType: '',
            sellerType: '',
            discountRate: '',
            couponNum: 0,
            maxDiscountAmount: '',
            expireTime: '',
            couponNote: ''
          }
        }
      }
    },
    methods: {
      setToday() {
        let now = new Date()
        let cmonth = now.getMonth() + 1
        let day = now.getDate()
        if (cmonth < 10) cmonth = '0' + cmonth
        if (day < 10) day = '0' + day
        vm.params.beginTime = now.getFullYear() + '-' + cmonth + '-' + day
      },
      switchData(data, value, target) {
        let tmp
        if (!me.isArray(value)) {
          tmp = []
          for (let i = 0; i < data.length; i++) {
            if (value === data[i].key) {
              tmp.push(data[i].name)
            }
          }
          vm[target] = tmp
        } else {
          let tt = value.join('')
          for (let i = 0; i < data.length; i++) {
            if (tt === data[i].name) {
              tmp = data[i].key
            }
          }
          vm.params[target] = tmp
        }
      },
      getData() {
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.loadData(userApi.get, {couponId: id}, 'POST', function (res) {
          vm.isPosting = false
          if (res) {
            let resD = res.data.itemList
            /*此处转换一些字段类型*/
            vm.switchData(vm.types, vm.params.goodsType, 'tmpType')
            vm.switchData(vm.serTypes, vm.params.sellerType, 'tmpSerType')
            vm.coupons = resD
          }
        }, function () {
          vm.isPosting = false
        })
      },
      validate() {
        if (vm.newUser) {
          if (!vm.params.discountRate) {
            vm.toast('请填写优惠折扣！', 'toast')
            return false
          }
          if (!vm.params.maxDiscountAmount) {
            vm.toast('请填写最大优惠金额！', 'toast')
            return false
          }
        } else {
          /* if (!vm.tmpType.length) {
           vm.toast('请选择商品类型！', 'toast')
           return false
           }*/
          if (!vm.tmpSerType.length) {
            vm.toast('请选择店铺类型！', 'toast')
            return false
          }
          if (!vm.params.discountRate) {
            vm.toast('请填写优惠折扣！', 'toast')
            return false
          }
          if (!vm.params.maxDiscountAmount) {
            vm.toast('请填写最大优惠金额！', 'toast')
            return false
          }
          if (!vm.params.couponNum) {
            vm.toast('请填写优惠券数量！', 'toast')
            return false
          }
          /*if (!vm.params.beginTime) {
           vm.toast('请选择开始时间！')
           return false
           }*/
          if (vm.needExpire && !vm.params.expireTime) {
            vm.toast('请选择过期时间！', 'toast')
            return false
          }
        }
        return true
      },
      update() {
        if (vm.isPosting || !vm.validate()) return false
        /*此处转换一些字段类型*/
        if (vm.tmpType === '全部') {
          vm.params.goodsType = ''
        }
        let curApi
        if (vm.couponId) {
          curApi = couponApi.add
          vm.params.id = vm.couponId
        } else {
//          delete vm.params.id
          curApi = couponApi.add
        }
        vm.isPosting = true
        vm.processing()
        vm.loadData(curApi, vm.params, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          if (res.success) {
            vm.toast('添加成功', 'toast')
            vm.jump('coupons')
          } else {
            vm.toast('添加失败！', 'toast')
          }
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      onChange(val) {
        // console.log('change', val)
      },
      changeType(val) {
        if (val.indexOf('全部') > -1) {
          vm.params.goodsType = ''
        } else {
          vm.switchData(vm.types, vm.tmpType, 'goodsType')
        }
        // console.log(val, vm.params.goodsType)
      },
      changeSeller(val) {
        vm.switchData(vm.serTypes, vm.tmpSerType, 'sellerType')
        // console.log(val, vm.params.sellerType)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../../static/css/tools.less';

  .coupon-edit-con {
    padding-bottom: 50px;
    .bottom {
      margin-top: 10/@rem;
    }
    .vux-no-group-title {
      margin-top: 0;
      .vux-x-input {
        padding: 24/@rem 30/@rem;
      }
      .checker-group {
        .rel;
        .flex;
        padding: 24/@rem 30/@rem;
        .fz(26);
        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: 15px;
          right: 0;
          height: 1px;
          border-top: 1px solid #D9D9D9;
          color: #D9D9D9;
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
          -webkit-transform: scaleY(0.5);
          transform: scaleY(0.5);
        }
        label {
          .abs-center-vertical;
        }
        .vux-checker-box {
          .flex-r(1);
          .vux-checker-item {
            .fr;
            margin-left: 4px;
          }
        }
      }
      .vux-x-switch {
        .fz(24) !important;
        .weui-switch:checked {
          border-color: #4670fe;
          background-color: #4670fe;
        }
      }
      .vux-x-input, .address-area, .vux-selector, .vux-cell-box, .vux-x-textarea {
        .fz(26);
      }
    }
    .btn-save {
      .fix;
      bottom: 0;
      z-index: 20;
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
