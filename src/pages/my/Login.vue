<template>
  <div class="login-con" v-cloak>
    <group>
      <x-input title="手机号：" placeholder="您的手机号" required type="tel" text-align="right" v-model="params.phone">
        <!--<img slot="label" style="padding-right:10px;display:block;" src="http://dn-placeholder.qbox.me/110x110/FF2D55/000" width="24" height="24">-->
      </x-input>
      <x-input title="验证码：" placeholder="验证码" class="weui-vcode" v-model="params.passwd" v-if="params.logintype===2">
        <x-button class="btn-vercode" slot="right" type="primary" mini :disabled="btnStatus" @click.native="getCode">
          {{btnText}}
        </x-button>
      </x-input>
      <x-input title="密码：" placeholder="密码" required type="password" text-align="right"
               v-model="params.passwd" v-else></x-input>
    </group>
    <div class="btn btn-login" @click="login">登录</div>
    <!--<div class="btn btn-regist" v-jump="['regist']">注册</div>-->
    <div class="bottom-col">
      <a class="loginType" href="javascript:;" @click="changeLogin">{{loginText}}[切换]</a>
      <!--<a class="forgetPsw" href="#/password">忘记密码&nbsp;<i class="fa fa-question-circle"></i></a>-->
    </div>
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
    name: 'login-con',
    data() {
      return {
        isPosting: false,
        params: {
          phone: null,
          passwd: null,
          logintype: 1
        },
        btnText: '发送验证码',
        btnStatus: false
      }
    },
    components: {Group, Cell, XInput, XButton},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      me.attachClick()
      vm.params.phone = vm.$route.query.phone || null
      vm.params.passwd = vm.$route.query.psw || null
      window.addEventListener('keydown', function (e) {
        if (e.keyCode === 13) {
          vm.login()
        }
      }, false)
    },
    computed: {
      loginText() {
        return this.params.logintype === 1 ? '密码登录' : '验证码登录'
      }
    },
    methods: {
      changeLogin() {
        vm.params.passwd = null
        vm.params.logintype = (vm.params.logintype === 1) ? 2 : 1
      },
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
        vm.loadData(commonApi.sendSms, {phone: vm.params.phone, useType: 1}, 'POST', function (res) {
          vm.btnStatus = true
          me.verCodeBtn(60, '.btn-vercode', function () {
            vm.btnStatus = false
          })
          vm.isPosting = false
        }, function () {
          vm.isPosting = false
        })
      },
      login() {
        if (vm.isPosting) return false
        if (!vm.params.phone) {
          vm.toast('请填写手机号 ！', 'warn')
          return false
        }
        if (!vm.params.phone.match(/^(13|15|18|17)\d{9}$/)) {
          vm.toast('请填写正确的手机号 ！', 'warn')
          return false
        }
        if (vm.params.logintype === 1 && !vm.params.passwd) {
          vm.toast('请填写密码 ！', 'warn')
          return false
        }
        if (vm.params.logintype === 2 && !vm.params.passwd) {
          vm.toast('请填写验证码 ！', 'warn')
          return false
        }
        vm.isPosting = true
        vm.processing()
        vm.loadData(commonApi.login, vm.params, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          if (res.data.success) {
            vm.isPosting = false
            vm.toast('登录成功 ！')
            /* 保存用户信息 */
            vm.$store.commit('storeData', {key: 'isLogin', data: true})
            me.sessions.set('logYn', true)
            vm.jump('home')
          } else {
            vm.toast(res.message || '手机号或密码错误 ！')
          }
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
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
    .btn-regist {
      width: 96%;
      margin: 20/@rem auto;
      .ma-w(640);
      .borBox;
      letter-spacing: 2px;
      padding: 24/@rem 0;
      .center;
      .c3;
      .fz(28);
      .bf;
      .bor;
      .borR(4px);
    }
    .bottom-col {
      padding: 10/@rem;
      overflow: hidden;
    }
    .loginType {
      .fr;
      .c3;
      .fz(24);
      padding: 10/@rem;
      i {
        font-style: normal;
        font-weight: normal;
      }
    }
    .forgetPsw {
      .fr;
      .c6;
      .fz(24);
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
