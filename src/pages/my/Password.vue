<template>
  <div class="login-con" v-cloak>
    <group>
      <x-input title="手机号：" placeholder="您的手机号" required type="tel" text-align="right" v-model="params.phone"></x-input>
      <x-input title="发送验证码：" class="weui-vcode">
        <x-button slot="right" type="primary" mini :text="btnText" v-model="params.code" :disabled="btnStatus"
                  @click.native="getCode">发送验证码
        </x-button>
      </x-input>
      <x-input title="旧密码：" placeholder="旧密码" required type="lastPassword" text-align="right"
               v-model="params.lastPasswd" v-if="sellerId"></x-input>
      <x-input title="密码：" placeholder="密码" required type="password" text-align="right"
               v-model="params.passwd"></x-input>
    </group>
    <div class="btn btn-login" @click="update">保存</div>
    <!--<a class="forgetPsw" href="#/reset_psw">忘记密码&nbsp;<i class="fa fa-question-circle"></i></a>-->
    <p class="b-txt">友你生活 | 开启崭新生活</p>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Group, Cell, XInput, XButton} from 'vux'
  import {commonApi} from '../../service/main.js'

  export default {
    name: 'password-con',
    data() {
      return {
        isPosting: false,
        btnText: '发送验证码',
        btnStatus: false,
        sellerId: null,
        params: {
          phone: null,
          code: null,
          passwd: null,
          lastPasswd: null
        }
      }
    },
    components: {Group, Cell, XInput, XButton},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      me.attachClick()
      vm.sellerId = vm.$route.query.id
    },
    methods: {
      getCode() {
        if (vm.isPosting) return false
        if (!vm.params.phone) {
          vm.toast('请填写手机号 ！', 'warn')
          return false
        }
        if (!vm.params.phone.match(/^(13|15|18|17)\d{9}$/)) {
          vm.toast('请填写正确的手机号 ！', 'warn')
          return false
        }
        vm.isPosting = true
        vm.loadData(commonApi.sendSms, {phone: vm.params.phone, useType: 3}, 'POST', function (res) {
          vm.btnStatus = true
          me.verCodeBtn(60, '.btn-vercode', function () {
            vm.btnStatus = false
          })
          vm.isPosting = false
        }, function () {
          vm.isPosting = false
        })
      },
      update() {
        if (vm.isPosting) return false
        if (!vm.params.phone) {
          vm.toast('请填写手机号 ！', 'warn')
          return false
        }
        if (!vm.params.phone.match(/^(13|15|18|17)\d{9}$/)) {
          vm.toast('请填写正确的手机号 ！', 'warn')
          return false
        }
        if (!vm.params.code) {
          vm.toast('请填写验证码 ！', 'warn')
          return false
        }
        if (vm.sellerId) {
          if (!vm.params.lastPasswd) {
            vm.toast('请填写旧密码 ！', 'warn')
            return false
          }
        }
        if (!vm.params.passwd) {
          vm.toast('请填写密码 ！', 'warn')
          return false
        }
        vm.isPosting = true
        vm.loadData(commonApi.updatePsw, vm.params, 'POST', function (res) {
          // console.log(res, '修改用户信息')
          vm.toast('密码已更新')
          vm.$router.back()
          vm.isPosting = false
        }, function () {
          vm.isPosting = false
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .login-con {
    .rel;
    height: 100%;
    .vux-no-group-title {
      margin-top: 0;
      .vux-x-input {
        padding: 26/@rem 30/@rem;
        .fz(28);
      }
    }
    .btn-login {
      width: 96%;
      margin: 20/@rem auto;
      .ma-w(640);
      .borBox;
      letter-spacing: 2px;
      padding: 24/@rem 0;
      .center;
      .cf;
      .fz(28);
      .bdiy(#16a542);
      .borR(4px);
    }
    .forgetPsw {
      .c6;
      .fz(24);
      .fr;
      padding: 10/@rem;
    }
    .b-txt {
      .abs;
      .center;
      width: 100%;
      bottom: 0;
      padding: 30/@rem 0;
      .cb;
      .fz(20);
    }
  }

</style>
