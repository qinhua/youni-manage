<template>
  <div class="s-banner" v-cloak>
    <div class="banner-col">
      <group>
        <img-uploader title="banner图片：" :api="fileApi" :limit="1" @on-uploaded="getImgUrl"></img-uploader>
        <!--<x-input title="banner标题：" placeholder="banner标题" required text-align="right"
                 v-model="params.title"></x-input>-->
        <x-input title="banner链接：" placeholder="跳转链接" text-align="right" v-model="params.linkUrl"></x-input>
        <button type="button" class="btn btn-save" @click="add" :disabled="banners.length===4"><i
          class="fa fa-plus"></i>&nbsp;添加（最多4个）
        </button>
      </group>
    </div>

    <ul class="banner-list" v-if="banners.length">
      <swipeout>
        <swipeout-item @on-close="" @on-open="" transition-mode="follow" v-for="(item, index) in banners"
                       :data-id="item.id" key="index">
          <div slot="right-menu">
            <!--<swipeout-button @click.native="onButtonClick('edit',item.id)" type="primary">编辑</swipeout-button>-->
            <swipeout-button @click.native="onButtonClick('delete',item.id)" type="warn">删除</swipeout-button>
          </div>
          <div slot="content" class="demo-content vux-1px-t">
            <li>
              <div class="img-con" :style="'background-image:url('+item.image+')'"></div>
              <div class="right-con">
                <p>{{item.linkUrl}}</p></div>
            </li>
          </div>
        </swipeout-item>
      </swipeout>
    </ul>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import imgUploader from '../../components/ImgUploader.vue'
  import {
    Group,
    Cell,
    XInput,
    XTextarea,
    Swipeout, SwipeoutItem, SwipeoutButton
  } from 'vux'
  import {commonApi, bannerApi} from '../../service/main.js'

  export default {
    name: 's-banner',
    data() {
      return {
        isPosting: false,
        fileApi: commonApi.uploadImg,
        banners: [],
        params: {
          // title: '',
          image: '',
          linUrl: ''
        }
      }
    },
    components: {
      Group,
      Cell,
      XInput,
      XTextarea,
      imgUploader,
      Swipeout, SwipeoutItem, SwipeoutButton
    },
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      // me.attachClick()
      vm.getBanners()
    },
    watch: {
      '$route'(to, from) {
        if (to.name === 'banner') {
          vm.getBanners()
        }
      }
    },
    methods: {
      getImgUrl(data) {
        if (me.isArray(data)) {
          vm.params.image = data.join(',')
        } else {
          vm.params.image = ''
        }
      },
      validate() {
        if (vm.banners.length === 4) {
          vm.toast('最多添加4个！')
          return false
        }
        if (!vm.params.image) {
          vm.toast('请选择图片！')
          return false
        }
        /*if (!vm.params.title) {
          vm.toast('请填写标题！')
          return false
        }*/
        if (!vm.params.linkUrl) {
          vm.toast('请填写链接！')
          return false
        }
        if (vm.banners.length) {
          for (let i = 0; i < vm.banners.length; i++) {
            let cur = vm.banners[i];
            if (cur.image === vm.params.image && cur.linkUrl === vm.params.linkUrl) {
              vm.toast('请修改后再提交！')
              return false
            }
          }
        }
        return true
      },
      getBanners() {
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.processing()
        vm.loadData(bannerApi.list, null, 'POST', function (res) {
          vm.isPosting = false
//          vm.processing(0, 1)
          vm.banners = res.data.itemList
          vm.params = {}
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      add() {
        if (vm.validate()) {
          if (vm.isPosting) return false
          vm.isPosting = true
          // vm.processing()
          vm.loadData(bannerApi.add, vm.params, 'POST', function (res) {
            vm.isPosting = false
            vm.processing(0, 1)
            vm.getBanners()
          }, function () {
            vm.isPosting = false
            vm.processing(0, 1)
          })
        }
      },
      del(id) {
        if (vm.isPosting) return false
        vm.confirm('确认删除？', '', function () {
          vm.isPosting = true
          // vm.processing()
          vm.loadData(bannerApi.del, {bannerId: id}, 'POST', function (res) {
            vm.isPosting = false
            vm.processing(0, 1)
            vm.getBanners()
          }, function () {
            vm.isPosting = false
            vm.processing(0, 1)
          })
        })
      },
      update() {
        if (vm.validate()) {
          if (vm.isPosting) return false
          vm.isPosting = true
          vm.processing()
          vm.loadData(bannerApi.update, vm.params, 'POST', function (res) {
            vm.isPosting = false
            vm.processing(0, 1)
            vm.getBanners()
          }, function () {
            vm.isPosting = false
            vm.processing(0, 1)
          })
        }
      },
      onButtonClick(type, id) {
        if (type === 'edit') {
          vm.params = {}
          for (let i = 0; i < vm.banners.length; i++) {
            let cur = vm.banners[i];
            if (cur.id === id) {
              for (var val in cur) {
                console.log(val, cur[val], 5)
                vm.params[val] = cur[val]
              }
              console.log(vm.params, 5)
            }
          }
          // this.$router.push({name: 'edit_banner', query: {id: id}})
        } else {
          vm.del(id)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .s-banner {
    height: 100%;
    padding-bottom: 50px;
    .banner-col {
      margin-bottom: 14/@rem;
    }
    .weui-label {
      .left;
    }
    .weui-uploader__file {
      width: 100% !important;
      height: 200/@rem !important;
    }
    .banner-list {
      .borBox;
      .bf;
      padding-left: 20/@rem;
      .bor-t(2px, solid, #9cb3ff);
      .vux-swipeout-button-primary {
        background: orange;
      }
      li {
        .rel;
        padding: 14/@rem 0;
        height: 130/@rem;
        .bor-b;
        .img-con {
          .abs-center-vertical;
          left: 0;
          .size(130, 130);
          background-position: center;
          -webkit-background-size: cover;
          background-size: cover;
        }
        .right-con {
          .borBox;
          padding: 0 18/@rem 0 150/@rem;
          p {
            .ellipsis-clamp-3;
          }
        }
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
      &:disabled {
        .bdiy(#ccc);
      }
    }
  }

</style>
