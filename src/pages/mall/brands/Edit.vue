<template>
  <div class="edit-brand-con" v-cloak>
    <group>
      <popup-picker title="商品分类：" :data="types" :columns="1" v-model="tmpType" ref="picker1" @on-show=""
                    @on-hide="" @on-change="changeType"></popup-picker>
      <x-input title="品牌名称：" placeholder="品牌名称" required text-align="right" v-model="params.name"></x-input>
    </group>
    <group class="bottom">
      <x-textarea title="品牌说明：" :max="50" placeholder="一些品牌介绍…" @on-blur="" v-model="params.note"
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
    PopupPicker,
    XTextarea
  } from 'vux'
  import {brandsApi} from '../../../service/main.js'

  export default {
    name: 'brands-edit',
    data() {
      return {
        id: null,
        isPosting: false,
        types: [{
          key: 'goods_type.1',
          value: '水',
          name: '水'
        },
          {
            key: 'goods_type.2',
            value: '奶',
            name: '奶'
          }],
        tmpType: ['水'],
        params: {
          goodsType: '',
          name: '',
          note: ''
        }
      }
    },
    components: {
      Group,
      XInput,
      PopupPicker,
      XTextarea
    },
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getData()
    },
    watch: {
      '$route'(to, from) {
        if (to.name === 'edit_brands') {
          vm.getData()
        } else {
          vm.tmpType = ['水']
          vm.params = {
            goodsType: 'goodsType.1',
            name: '',
            note: ''
          }
        }
      }
    },
    methods: {
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
        if (vm.$route.query.thedata) {
          var data = JSON.parse(window.decodeURIComponent(vm.$route.query.thedata))
          vm.params = {
            brandId: data.key,
            goodsType: data.goodsType,
            name: data.value
            //note: ''
          }
          vm.switchData(vm.types, vm.params.goodsType, 'tmpType')
        } else {
          vm.switchData(vm.types, vm.tmpType, 'goodsType')
        }
        /*if (vm.isPosting) return false
        vm.isPosting = true
        vm.loadData(userApi.get, {couponId: id}, 'POST', function (res) {
          vm.isPosting = false
          if (res) {
            let resD = res.data.itemList
            /!*此处转换一些字段类型*!/
            vm.switchData(vm.types, vm.params.goodsType, 'tmpType')
            vm.coupons = resD
          }
        }, function () {
          vm.isPosting = false
        })*/
      },
      validate() {
        /* if (!vm.tmpType.length) {
         vm.toast('请选择商品分类！', 'warn')
         return false
         }*/
        if (!vm.tmpType.length) {
          vm.toast('请选择店铺类型！', 'warn')
          return false
        }
        if (!vm.params.name) {
          vm.toast('请填写品牌名！', 'warn')
          return false
        }
        /*if (!vm.params.note) {
          vm.toast('请填写品牌说明', 'warn')
          return false
        }*/
        return true
      },
      update() {
        if (vm.isPosting || !vm.validate()) return false
        let curApi
        if (!vm.params.brandId) {
          curApi = brandsApi.add
        } else {
          curApi = brandsApi.update
        }
        vm.isPosting = true
        vm.processing()
        vm.loadData(curApi, vm.params, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          if (res.success) {
            vm.toast(vm.params.id ? '已更新' : '添加成功')
            vm.jump('brands')
          } else {
            vm.toast('添加失败！', 'warn')
          }
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        }, true)
      },
      changeType(val) {
        vm.switchData(vm.types, vm.tmpType, 'goodsType')
        // console.log(val, vm.params.goodsType)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../../static/css/tools.less';

  .edit-brand-con {
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
