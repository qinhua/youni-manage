<template>
  <div class="s-topic" v-cloak>
    <div class="scroll-view">
      <div class="topic-col" v-show="isAdd||isEdit">
        <group>
          <x-input title="标题：" placeholder="标题（15字左右）" required text-align="right" v-model="name"></x-input>
          <x-input title="链接：" placeholder="跳转链接" text-align="right" v-model="url"></x-input>
        </group>
      </div>

      <ul class="topic-list" v-if="topics.length">
        <h3><i class="fa fa-tags"></i>&nbsp;头条列表<span>左滑可编辑</span></h3>
        <swipeout>
          <swipeout-item @on-close="" @on-open="" transition-mode="follow" v-for="(item, index) in topics"
                         :data-id="item.id" key="index">
            <div slot="right-menu">
              <swipeout-button @click.native="onButtonClick('edit',item.name)" type="primary">编辑</swipeout-button>
              <swipeout-button @click.native="onButtonClick('delete',item.name)" type="warn">删除</swipeout-button>
            </div>
            <div slot="content" class="demo-content vux-1px-t">
              <li>
                <p><a :href="item.url">{{index + 1}}.{{item.name}}</a></p>
              </li>
            </div>
          </swipeout-item>
        </swipeout>
      </ul>
      <div class="iconNoData abs-center-vh" v-else><i></i>
        <p>暂无记录</p></div>
    </div>
    <button type="button" class="btn btn-save" @click="isAdd=true" :disabled="topics.length===4" v-show="!isEdit"><i
      class="fa fa-plus"></i>&nbsp;添加（最多4个）
    </button>
    <button type="button" class="btn btn-save" @click="add" v-show="isAdd"><i class="fa fa-save"></i>&nbsp;保存
    </button>
    <button type="button" class="btn btn-save" @click="update(curEditIdx)" v-show="isEdit"><i class="fa fa-save"></i>&nbsp;保存
    </button>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import imgUploader from '../../../components/ImgUploader.vue'
  import {
    Group,
    Cell,
    XInput,
    Swipeout, SwipeoutItem, SwipeoutButton
  } from 'vux'
  import {topicApi} from '../../../service/main.js'

  export default {
    name: 's-topic',
    data() {
      return {
        isPosting: false,
        isAdd: false,
        isEdit: false,
        topics: [],
        lastData: [],
        name: '',
        url: ''
      }
    },
    components: {
      Group,
      Cell,
      XInput,
      Swipeout, SwipeoutItem, SwipeoutButton
    },
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getTopic()
    },
    watch: {
      '$route'(to, from) {
        if (to.name === 'banner') {
          vm.reset()
          vm.getTopic()
        }
      }
    },
    methods: {
      reset(){
        vm.isAdd = false,
          vm.isEdit = false,
          vm.lastData = [],
          vm.name = '',
          vm.url = ''
      },
      validate() {
        if (vm.topics.length === 4) {
          vm.toast('最多添加4个！', 'warn')
          return false
        }
        if (!vm.name) {
          vm.toast('请填写标题！', 'warn')
          return false
        }
        if (!vm.url) {
          vm.toast('请填写链接！', 'warn')
          return false
        }
        if (vm.topics.length) {
          for (let i = 0; i < vm.topics.length; i++) {
            let cur = vm.topics[i];
            if (cur.name === vm.name && cur.url === vm.url) {
              vm.toast('请修改后再提交！')
              return false
            }
          }
        }
        return true
      },
      getTopic() {
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
        },true)
      },
      add() {
        if (vm.validate()) {
          if (vm.isPosting) return false
          vm.isPosting = true
          vm.topics.push({
            name: vm.name,
            url: vm.url
          })
          var params = {
            configKey: 'home_notice',
            configValue:  JSON.stringify({
              itemList: vm.topics
            })
          }
          vm.loadData(topicApi.set, params, 'POST', function (res) {
            vm.isPosting = false
            vm.isAdd = false
            vm.isEdit = false
            vm.name = ''
            vm.url = ''
            vm.toast('添加成功')
            vm.getTopic()
          }, function () {
            vm.isPosting = false
          },true)
        }
      },
      del(name) {
        if (vm.isPosting) return false
        vm.confirm('确认删除？', '', function () {
          vm.isPosting = true
          for (var i = 0; i < vm.topics.length; i++) {
            if (vm.topics[i].name === name) {
              vm.topics.splice(i, 1)
            }
          }
          var params = {
            configKey: 'home_notice',
            configValue: {
              itemList: JSON.stringify(vm.topics)
            }
          }
          vm.loadData(topicApi.set, params, 'POST', function (res) {
            vm.isPosting = false
            vm.isAdd = false
            vm.isEdit = false
            vm.name = ''
            vm.url = ''
            vm.getTopic()
          }, function () {
            vm.isPosting = false
          },true)
        })
      },
      update(idx){
        if (vm.validate()) {
          if (vm.isPosting) return false
          vm.isPosting = true
          vm.topics[idx].name = vm.name
          vm.topics[idx].url = vm.url
          var params = {
            configKey: 'home_notice',
            configValue: JSON.stringify({
              itemList: vm.topics
            })
          }
          vm.loadData(topicApi.set, params, 'POST', function (res) {
            vm.isPosting = false
            vm.isAdd = false
            vm.isEdit = false
            vm.name = ''
            vm.url = ''
            vm.getTopic()
          }, function () {
            vm.isPosting = false
          },true)
        }
      },
      onButtonClick(type, name)
      {
        if (type === 'edit') {
          for (var i = 0; i < vm.topics.length; i++) {
            var cur = vm.topics[i]
            if (cur.name === name) {
              vm.curEditIdx = i
              vm.name = cur.name
              vm.url = cur.url
            }
          }
          vm.isEdit = true
        } else {
          vm.del(name)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../../static/css/tools.less';

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
