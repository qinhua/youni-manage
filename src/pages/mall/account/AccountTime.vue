<template>
  <div class="account-time">
    <group>
      <popup-picker title="到账时间" :data="scopes" :columns="1" v-model="tmpScope" @on-change="changeType"></popup-picker>
    </group>
    <button type="button" class="btn btn-save" @click="update"><i class="fa fa-save"></i>&nbsp;保存</button>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {
    Group,
    Cell,
    XInput,
    PopupPicker
  } from 'vux'
  import {topicApi} from '../../../service/main.js'

  export default {
    name: 'account-time',
    data() {
      return {
        isPosting: false,
        scopes: [{key: 0, value: '请选择', name: '请选择'}, {key: 1, value: '1星期', name: '1星期'}, {
          key: 2,
          value: '1个月',
          name: '1个月'
        }, {
          key: 3,
          value: '3个月',
          name: '3个月'
        }],
        tmpScope: ['请选择'],
        params: {
          accountTime: ''
        }
      }
    },
    components: {
      Group,
      Cell,
      XInput,
      PopupPicker
    },
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
//      vm.getData()
    },
    watch: {
      '$route'(to, from) {
        if (to.name === 'banner') {
//          vm.getData()
        } else {
          vm.params.accountTime = ''
        }
      }
    },
    methods: {
      validate() {
        if (!vm.params.accountTime) {
          vm.toast('请选择到账时间！', 'warn')
          return false
        }
        return true
      },
      switchData(data, value, target) {
        let tmp
        if (typeof value === 'number') {
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
      changeType(val) {
        vm.switchData(vm.scopes, vm.tmpScope, 'accountTime')
      },
      getData() {
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.processing()
        vm.loadData(topicApi.list, {configKey: 'home_notice'}, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          if (res.data) {
            vm.topics = res.data.itemList[0].itemList
          }
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      update() {
        if (vm.validate()) {
          if (vm.isPosting) return false
          vm.isPosting = true
          vm.loadData(topicApi.set, params, 'POST', function (res) {
            vm.isPosting = false
            vm.jump('mall')
          }, function () {
            vm.isPosting = false
          })
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../../static/css/tools.less';

  .account-time {
    height: 100%;
    z-index: 1;
    overflow: hidden;
    .weui-cell {
      padding: 30/@rem 24/@rem !important;
    }
    .btn-save {
      .abs;
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
      &:disabled {
        .bdiy(#ccc);
      }
    }
  }

</style>
