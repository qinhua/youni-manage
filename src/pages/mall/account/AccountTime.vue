<template>
  <div class="account-time">
    <group>
      <x-input title="到账时间：" placeholder="请输入天数" text-align="right" type="number" v-model="params.accountTime"></x-input>
      <!--<popup-picker title="到账时间" :data="scopes" :columns="1" v-model="tmpScope" @on-change="changeType"></popup-picker>-->
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
    XInput
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
          accountTime: null
        }
      }
    },
    components: {
      Group,
      Cell,
      XInput
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
        if (to.name === 'account_time') {
          vm.getData()
        } else {
          // vm.tmpScope = ['请选择']
          vm.params.accountTime = null
        }
      }
    },
    methods: {
      validate() {
        if (!vm.params.accountTime) {
          vm.toast('请输入到账天数！', 'warn')
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
        vm.loadData(topicApi.get, {configKey: 'account_time'}, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          if (res.data) {
            vm.params.accountTime = res.data.configValue
            // vm.switchData(vm.scopes, vm.params.accountTime, 'tmpScope')
          }
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        }, true)
      },
      update() {
        if (vm.validate()) {
          if (vm.isPosting) return false
          vm.isPosting = true
          var params = {
            configKey: 'account_time',
            configValue: vm.params.accountTime
          }
          vm.loadData(topicApi.set, params, 'POST', function (res) {
            vm.isPosting = false
            vm.toast('已保存', 'success')
            vm.jump('mall')
          }, function () {
            vm.isPosting = false
          }, true)
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
