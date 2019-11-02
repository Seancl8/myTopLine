<template>
  <div class="searchShow">
    <!-- 搜索列表顶部通栏 -->
    <van-nav-bar title="搜索列表" left-text="返回" left-arrow @click-left="onClickLeft" fixed :z-index="99"/>
    <!-- list上啦刷新 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- 内容列表 -->
     <van-cell-group>
      <van-cell @click="readArticle(item.art_id)" class="mycell" v-for="(item,index) in searchDataList" :key="index"  :title="item.title">
        <template slot="label">
          <!-- 图片 -->
          <van-grid :border="false" :column-num="3" v-if="item.cover.type > 0">
            <van-grid-item v-for="(imgs,imgIndex) in item.cover.images" :key="imgIndex">
              <!-- 专门缓存图片的网址 -->
              <!-- <van-image :src="`https://images.weserv.nl/?url=${imgs}`" /> -->
              <van-image lazy-load :src="imgs" />
            </van-grid-item>
          </van-grid>
          <!-- 信息 -->
          <div class="info">
            <span>{{item.aut_name}}</span>
            <span>{{item.comm_count}}条评论</span>
            <span>{{item.pubdate | relativetime}}</span>
          </div>
          <!-- 点赞 -->
          <van-grid :column-num="3" clickable>
            <van-grid-item>
              <template slot="default">
                <div class="mygrid">
                  <van-icon @click.stop="comment" class="gridIcon" name="comment-o" />{{item.comm_count}}
                </div>
              </template>
            </van-grid-item>
            <van-grid-item>
              <template slot="default">
                <div class="mygrid">
                  <van-icon @click.stop="praise" class="gridIcon" name="like-o" />{{item.like_count}}
                </div>
              </template>
            </van-grid-item>
            <van-grid-item>
              <template slot="default">
                <div class="mygrid">
                  <van-icon class="gridIcon" name="share" />{{item.collect_count}}
                </div>
              </template>
            </van-grid-item>
          </van-grid>
        </template>
      </van-cell>
     </van-cell-group>
    </van-list>
  </div>
</template>

<script>
// 导入获取搜索数据的api
import { apiSearchData } from '@/api/search.js'
export default {
  data () {
    return {
      // 搜索的关键字
      key: '',
      // 当前页
      page: 0,
      // 页容量
      perpage: 10,
      // 搜索到的数据源
      searchDataList: [],
      // list的加载状态
      loading: false,
      // list是否加载完毕
      finished: false,
      // 数据的总条数
      totalCount: 0
    }
  },
  methods: {
    // 点击返回
    onClickLeft () {
      this.$toast('返回')
      this.$router.back()
    },
    // 获取搜索的数据
    async searchList () {
      let res = await apiSearchData(this.$http, {
        page: this.page,
        perPage: this.perPage,
        q: this.key
      })
      this.searchDataList = [...this.searchDataList, ...res.results]
      // 进行判断 如果达到总条数 完成数据加载
      if (this.searchDataList.length === this.totalCount) {
        // 数据加载完毕
        this.finished = true
      }
      // 数据的总条数
      this.totalCount = res.total_count
      // 拿到数据的时候修改loading加载的状态
      this.loading = false
    },
    // list加载方法: list被加载 2.下拉触底 3.加载状态为true
    onLoad () {
      this.page++
      // 调用获取搜索数据的方法
      this.searchList() // 异步方法不影响下面代码执行 此时数据没变化 默认触底 会继续加载list
    },
    // 点击评论的方法
    comment () {
      // 获取user
      let user = this.$store.state.user
      // 判断是否登录过
      if (!user) {
        this.$toast.fail('请先登录再评论')
        this.$router.push('/login')
        return
      }
      alert('开始评论')
    },
    // 点赞的方法
    praise () {
      let results = this.$login()
      if (!results) {
        return
      }
      console.log('点赞开始')
    },
    // 点击阅读文章
    readArticle (artId) {
      this.$router.push(`/article/${artId}`)
    }
  },
  created () {
    // 得到用户传入的搜索关键字
    this.key = this.$route.params.key
  }
}
</script>

<style lang="less" scopd>
.searchShow {
  padding-top: 60px;
}
.van-nav-bar {
  background-color: #0094ff;
  .van-nav-bar__title {
    color: #fff;
  }
  .van-nav-bar__text {
    color: #fff;
  }
  .van-icon {
    color: #fff;
  }
}
.mygrid {
  display: flex;
  align-items: center;
  .gridIcon {
    font-size: 20px;
    margin: 5px;
  }
}
.info {
  margin-bottom: 10px;
  span {
    margin: 0 8px;
  }
}
.mycell {
  border-bottom: 10px solid #f4f5f6;
}
</style>
