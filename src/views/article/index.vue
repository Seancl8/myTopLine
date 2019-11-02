<template>
  <div class="articlePage">
      <!-- 顶部区域 -->
      <van-nav-bar title="文章详情" left-text="返回" left-arrow @click-left="onClickLeft" fixed :z-index="99"/>
      <!--文章标题 -->
      <van-cell :border="false" class="articleTitle" :title="articleDetailes.title" />
      <!--作者信息 -->
      <van-cell :border="false" :title="articleDetailes.aut_name" icon="location-o" value="内容" :label="articleDetailes.pubdate | relativetime" :center="true">
          <!-- 左侧图片 -->
          <template slot="icon">
            <van-image class="iconImg" round width="50" height="50" :src="articleDetailes.aut_photo" />
          </template>
          <!-- 右侧内容 -->
          <template slot="default">
            <van-button @click="operateFollow" v-if="articleDetailes.is_followed" type="info" size="small">已关注</van-button>
            <van-button @click="operateFollow" v-else type="primary" size="small">+关注</van-button>
          </template>
      </van-cell>
      <!-- 内容区域 -->
      <van-cell :border="false">
          <template slot="title">
              <div v-html="articleDetailes.content"></div>
          </template>
      </van-cell>
      <!-- 点赞 -->
      <div class="isLike">
        <van-button round type="danger">
            <van-icon name="good-job-o" /> 点赞
        </van-button>
        <van-button round type="primary">
            <van-icon name="delete" /> 不喜欢
        </van-button>
      </div>
      <!-- 显示评论组件 -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div v-for="(item,index) in commentList" :key="index">
          <allcomments :itemObj="item" v-model="showReply" :isa="true" />
        </div>
      </van-list>
      <!-- 评论输入框 -->
      <addcomments :artId="artId" :commentList="commentList" :isa="true" />
      <!-- 回复弹出层 -->
      <comment-reply v-model="showReply" :artId="artId" :isa="false" />
  </div>
</template>

<script>
// 导入评论组件
import allcomments from '@/components/comment'
import addcomments from '@/components/addcomments'
// 导入评论回复弹出层组件
import commentReply from '@/components/reply'
// 导入获的文章详情的api
import { apiReadArticle } from '@/api/articles'
// 导入关注和取消关注的api
import { apiFollow, apiUnFollow } from '@/api/user'
// 导入获取全部评论的api
import { apiGetAllComments } from '@/api/comment'
export default {
  components: {
    allcomments,
    addcomments,
    commentReply
  },
  data () {
    return {
      // 获得搜索的文章id
      artId: '',
      // 文章详情数据
      articleDetailes: {},
      // 文章评论数组
      commentList: [],
      // list的加载状态
      loading: false,
      // list的数据是否完结
      finished: false,
      // 文章的偏移量
      offset: '',
      // 每页的条数
      limit: 10,
      // 结束的id
      end_id: '',
      // 显示回复评论的弹出层
      showReply: false
    }
  },
  methods: {
    // list一加载执行
    async onLoad () {
      // 发送请求
      let res = await apiGetAllComments(this.$http, {
        source: this.artId,
        offset: this.offset || undefined,
        limit: this.limit
      })
      // 判断不为空
      // 赋值给数组
      this.commentList = [...this.commentList, ...res.results]
      // 更新偏移量
      this.offset = res.last_id
      // 保存end-id
      this.end_id = res.end_id
      // 当偏移量为end_id的时候 数据加载完毕
      if (this.offset === this.end_id) {
        this.finished = true
      }
      // 关闭加载状态
      this.loading = false
    },
    onClickLeft () {
      this.$toast('返回')
      this.$router.back()
    },
    // 获取文章的方法
    async getArticle () {
      let res = await apiReadArticle(this.$http, this.artId)
      this.articleDetailes = res
    },
    // 点击关注
    async operateFollow () {
      let isFollow = this.articleDetailes.is_followed
      //  判断有无关注
      if (isFollow) {
        await apiUnFollow(this.$http, this.articleDetailes.aut_id)
        // 将数据源中关注状态改为没有关注
        this.articleDetailes.is_followed = false
      } else {
        await apiFollow(this.$http, this.articleDetailes.aut_id)
        // 将数据源中关注状态改为已关注
        this.articleDetailes.is_followed = true
      }
    }
  },
  created () {
    this.artId = this.$route.params.aId
    this.getArticle()
  }
}
</script>

<style lang="less" scoped>
.articlePage {
  padding-top: 60px;
  padding-bottom: 60px;
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
.articleTitle {
    font-size: 24px;
}
.iconImg {
    margin-right: 5px;
}
.isLike {
  margin-top: 20px;
  margin-bottom: 40px;
  display: flex;
  justify-content: space-around;
}
</style>
