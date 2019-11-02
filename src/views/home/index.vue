<template>
  <div class="home">
    <!-- 页面顶部 -->
    <van-nav-bar title="首页" class="topBar" fixed />
    <!--频道区域  -->
    <div class="channels">
      <!-- tab标签页 -->
      <van-tabs v-model="activeIndex" animated sticky :offset-top="60">
        <van-tab v-for="(item,index) in channelList" :key="index" :title="item.name">
          <!-- 下拉刷新 -->
          <!-- 把各自的属性添加到对应的频道里面 -->
          <van-pull-refresh v-model="item.pull" @refresh="onRefresh" success-text="加载成功">
            <!-- list列表 -->
            <!-- 页面一加载的时候就会执行onLoad -->
            <van-list
              v-model="item.up"
              :finished="item.finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <van-cell
                v-for="(articles,subIndex) in item.articlesList"
                :key="subIndex"
                :title="articles.title"
              >
              <!-- 内容区域 -->
                  <template slot="label">
                      <!-- 图片区域 -->
                    <van-grid :border="false" :column-num="3" :gutter="10">
                      <van-grid-item v-for="(imgs,imgIndex) in articles.cover.images" :key="imgIndex">
                      </van-grid-item>
                    </van-grid>
                      <!-- 文本区域 -->
                      <div class="text">
                        <div class="text-left">
                          <span>{{ articles.aut_name }}</span>
                          <span>{{ articles.comm_count }} 评论</span>
                          <!-- 使用过滤器处理时间 -->
                          <span>{{ articles.pubdate | relativetime }}</span>
                        </div>
                        <div class="text-right" @click="operateBox(articles, item.articlesList)">
                          <van-icon size="20px" color="red" name="cross" />
                        </div>
                      </div>
                  </template>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
      <!-- 图标按钮 -->
      <div class="rightIcon">
        <van-button icon="wap-nav" type="primary" @click="menuBtn"></van-button>
      </div>
    </div>
    <!--弹出层 -->
    <channel-edit v-model="show" :channelList="channelList" :activeIndex.sync="activeIndex"/>
    <!-- 弹出框 -->
    <!-- 传入两个参数 当前的文章对象 当前的数据源 -->
    <pop-dialog v-model="showDialog" :currentArticle="currentArticle" :dataList="dataList" />
  </div>
</template>

<script>
// 导入频道组件
import channelEdit from '@/components/channelEdit'
// 导入对话框组件
import popDialog from '../../components/popDialog'
// 导入发送获取频道的方法
import { apiGetChannel } from '@/api/channel'
// 导入获取频道下文章的方法
import { apiGetArticles } from '@/api/articles.js'
export default {
  components: {
    channelEdit,
    popDialog
  },
  props: ['value'],
  data () {
    return {
      // 点击的下标
      activeIndex: 0,
      // 频道数组列表
      channelList: [],
      // 控制弹出层
      show: false,
      // 控制弹出框
      showDialog: false,
      // 当前操作的文章对象
      currentArticle: {},
      // 当前显示的数据源
      dataList: []
    }
  },
  methods: {
    async onLoad () {
      // 获取频道数组里的每一项
      let channelsItem = this.channelList[this.activeIndex]
      // 获取每一项的id
      let channelId = channelsItem.id
      // 发送axios请求获取频道下的文章
      let res = await apiGetArticles(this.$http, {
        url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
        method: 'GET',
        query: {
          channel_id: channelId,
          // 判断是否第一次请求
          timestamp: channelsItem.timestamp === 0 ? Date.now() : channelsItem.timestamp,
          with_top: 0
        }
      })
      // 获取到频道数据并进行赋值
      // channelsItem.articlesList = res.results
      channelsItem.articlesList = [
        ...channelsItem.articlesList,
        ...res.results
      ]
      // 保存新的时间戳
      channelsItem.timestamp = res.pre_timestamp
      // 如果返回的时间戳为空,就没有返回数据,数据加载完毕
      if (res.pre_timestamp === null) {
        channelsItem.finished = true
      }
      // // 关闭加载状态
      channelsItem.up = false
    },
    onRefresh () {
      // console.log('执行了')
      // console.log(this.channelList[this.activeIndex])
      // 把数据清空
      this.channelList[this.activeIndex].articlesList = []
      // 把时间戳设置为0 数据设为初始值
      this.channelList[this.activeIndex].timestamp = 0
      this.channelList[this.activeIndex].finished = false
      this.channelList[this.activeIndex].up = false
      this.onLoad()
      this.channelList[this.activeIndex].pull = false
    },
    // 获取频道列表
    async getChannelList () {
      try {
        // 获取user
        let user = this.$store.state.user
        // 判断有无登陆
        if (!user) {
          // 判断本地有无保存频道
          let localChannels = JSON.parse(
            window.localStorage.getItem('localChannels')
          )
          if (localChannels) {
            this.channelList = localChannels
          } else {
            // 发送请求获取默认的7条频道
            let res = await apiGetChannel(this.$http, {
              url: '/user/channels',
              method: 'GET'
            })
            this.channelList = res.channels
          }
          // 如果登陆就发送请求获取全部频道信息
        } else {
          let res = await apiGetChannel(this.$http, {
            url: '/user/channels',
            method: 'GET'
          })
          // 把获取到的值赋给数组
          this.channelList = res.channels
        }
        // 动态向 channlesLIst 中添加额外的属性
        this.addProp()
      } catch {
        this.$toast.fail('获取信息失败')
      }
    },
    // 遍历频道添加属性的方法
    addProp () {
      this.channelList.forEach(item => {
        // 在每一项中动态添加属性
        this.$set(item, 'pull', false)
        this.$set(item, 'up', false)
        this.$set(item, 'finished', false)
        this.$set(item, 'articlesList', [])
        this.$set(item, 'timestamp', 0)
      })
    },
    // 点击菜单栏按钮
    menuBtn () {
      this.show = true
    },
    // 点击x操作
    operateBox (articles, dataList) {
      this.currentArticle = articles
      this.dataList = dataList
      this.showDialog = true
    }
  },
  created () {
    // 获取频道列表
    this.getChannelList()
  }
}
</script>

<style lang="less" scoped>
.home {
  padding-top: 60px;
  padding-bottom: 50px;
}
.topBar {
  background-color: #3296fa;
  color: #fff;
  height: 60px;
}
.channels {
  position: relative;
  .rightIcon {
    position: fixed;
    top: 60px;
    right: 0;
  }
}
.home /deep/ .van-tabs__nav.van-tabs__nav--line {
  width: 85%;
}
.text {
  display: flex;
  justify-content: space-between;
  span {
    margin: 5px;
    font-size: 14px;
  }
}
.myPic {
  margin: 20px;
}
</style>
