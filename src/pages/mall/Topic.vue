<template>
  <div class="s-topic" v-cloak>
    <div class="scroll-view">
      <div class="topic-col">
        <group>
          <x-input title="公告标题：" placeholder="标题（15字左右）" required text-align="right" v-model="params.name"></x-input>
          <x-input title="公告链接：" placeholder="跳转链接" text-align="right" v-model="params.url"></x-input>
        </group>
      </div>

      <ul class="topic-list" v-if="topics.length">
        <h3><i class="fa fa-tags"></i>&nbsp;公告列表<span>左滑可编辑</span></h3>
        <swipeout>
          <swipeout-item @on-close="" @on-open="" transition-mode="follow" v-for="(item, index) in topics"
                         :data-id="item.id" key="index">
            <div slot="right-menu">
              <!--<swipeout-button @click.native="onButtonClick('edit',item.id)" type="primary">编辑</swipeout-button>-->
              <swipeout-button @click.native="onButtonClick('delete',item.id)" type="warn">删除</swipeout-button>
            </div>
            <div slot="content" class="demo-content vux-1px-t">
              <li>
                <p><a :href="item.url">{{index+1}}.{{item.name}}</a></p>
              </li>
            </div>
          </swipeout-item>
        </swipeout>
      </ul>
    </div>
    <button type="button" class="btn btn-save" @click="add" :disabled="topics.length===4"><i class="fa fa-plus"></i>&nbsp;添加（最多4个）
    </button>
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
  import {commonApi, topicApi} from '../../service/main.js'

  export default {
    name: 's-topic',
    data() {
      return {
        isPosting: false,
        fileApi: commonApi.uploadImg,
        topics: [],
        params: {
          name: '',
          url: ''
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
        if (vm.topics.length === 4) {
          vm.toast('最多添加4个！')
          return false
        }
        if (!vm.params.name) {
          vm.toast('请填写标题！')
          return false
        }
        if (!vm.params.url) {
          vm.toast('请填写链接！')
          return false
        }
        if (vm.topics.length) {
          for (let i = 0; i < vm.topics.length; i++) {
            let cur = vm.topics[i];
            if (cur.name === vm.params.name && cur.url === vm.params.url) {
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
        vm.loadData(topicApi.list, null, 'POST', function (res) {
          vm.isPosting = false
//          vm.processing(0, 1)
          vm.topics = res.data.itemList
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
          vm.loadData(topicApi.add, vm.params, 'POST', function (res) {
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
          vm.loadData(topicApi.del, {bannerId: id}, 'POST', function (res) {
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
          vm.loadData(topicApi.update, vm.params, 'POST', function (res) {
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
          for (let i = 0; i < vm.topics.length; i++) {
            let cur = vm.topics[i];
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

  .s-topic {
    .rel;
    height: 100%;
    z-index: 1;
    overflow: hidden;
    .scroll-view {
      height: 100%;
      overflow: auto;
    }
    .topic-col {
      margin-bottom: 14/@rem;
    }
    .topic-list {
      .borBox;
      .bf;
      padding-bottom: 100/@rem;
      .bor-t(2px, solid, #9cb3ff);
      .vux-swipeout-button-primary {
        background: orange;
      }
      h3 {
        padding: 12/@rem;
        .fz(24);
        background: #f2f5fd;
        span {
          .fr;
          font-weight: normal;
          .fz(22);
          .c8;
        }
      }
      li {
        .rel;
        padding: 20/@rem 0;
        .bor-b;
        p {
          .borBox;
          padding: 0 20/@rem;
          .ellipsis-clamp-2;
          a {
            .block;
            .c3;
            .fz(26);
          }
        }
      }
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
