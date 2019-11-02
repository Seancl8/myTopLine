<template>
  <div class="home">
    <!-- 页面顶部 -->
    <van-nav-bar title="首页" class="topBar" fixed />
    <!--频道区域  -->
    <div class="channels">
      <!-- tab标签页 -->
      <van-tabs v-model="activeIndex" animated sticky :offset-top="60" @click="onClick">
        <van-tab v-for="(item,index) in channelDataList" :key="index" :title="item.name">
          <!-- 下拉刷新 -->
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="加载成功">
            <!-- list列表 -->
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
              <van-cell v-for="(article,Index) in articleList" :key="Index" :title="article.title" />
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
      <!-- 图标按钮 -->
      <div class="rightIcon">
        <van-button icon="wap-nav" type="primary" @click="menuBtn"></van-button>
      </div>
      <!-- 弹出层 -->
      <van-popup
        v-model="show"
        closeable
        :overlay="false"
        close-icon-position="top-left"
        position="bottom"
        :style="{ height: '95%' }"
      >
      <!-- layout布局 -->
         <div class="popBox">
          <van-row gutter="60">
            <van-col span="16">我的频道</van-col>
            <van-col span="8">
              <van-button color="#7232dd" round plain hairline type="info">编辑</van-button>
            </van-col>
          </van-row>
         </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
// 导入发送获取频道的方法
import { getChannel } from '@/api/channel'
// 导入发送获取文章的方法
import { getArticles } from '../../api/articles.js'
export default {
  data () {
    return {
      // 点击的下标
      activeIndex: 0,
      loading: false,
      finished: false,
      isLoading: false,
      // 频道数组列表
      channelDataList: [],
      // 文章内容列表
      articleList: [],
      // 弹出框的显示
      show: false
    }
  },
  methods: {
    onLoad () {
      // this.dataList = [...this.dataList, '哈哈', 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
      // if (this.dataList.length > 100) {
      //   this.finished = true
      // }
    },
    onRefresh () {
      // 重置dataList中的数据
      // this.dataList = []
      // this.onLoad()
      this.isLoading = false
    },
    async getChannelList () {
      // 获取user信息
      let user = this.$store
      // 判断有无登录

      try {
        let res = await getChannel(this.$http, {
          url: '/user/channels',
          method: 'GET'
        })
        console.log(res)
        this.channelDataList = res.channels
      } catch {
        this.$toast.fail('获取信息失败')
      }
    },
    // 点击频道
    onClick (name, title) {
      this.getArticlesData()
    },
    // 获取文章内容
    async getArticlesData () {
      // 发送axios请求
      let res = await getArticles(this.$http, {
        url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
        method: 'GET',
        params: {
          channel_id: this.activeIndex,
          timestamp: Date.now(),
          with_top: 1
        }
      })
      console.log(res.results)
      this.articleList = res.results
      console.log(this.articleList)
    },
    // 点击菜单按钮的方法
    menuBtn () {
      console.log('1')
      this.show = true
    }
  },
  created () {
    // 获取频道列表
    this.getChannelList()
    // 获取文章内容
    this.getArticlesData()
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
.popBox {
  margin-top: 10%;
}
</style>
