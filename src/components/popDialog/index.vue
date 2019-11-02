<template>
<!-- 弹出框 -->
  <van-dialog
    :value="value"
    show-cancel-button
    @confirm="confirBtn"
    @cancel="cleBtn"
  >
    <van-cell-group v-if="isShow===false">
      <van-cell icon="close" title="隐藏" label="减少这类内容" @click="hideArticle" clickable />
      <van-cell icon="warning-o" title="举报" label="低俗,标题党等" is-link @click="isShow=true" />
      <van-cell icon="location-o" title="拉黑" @click="blackList" clickable/>
    </van-cell-group>
    <!-- 点击举报的页面 -->
    <van-cell-group v-if="isShow===true">
       <van-cell icon="arrow-left" title="返回" clickable @click="isShow=false"/>
       <!-- 举报的类型 -->
       <van-cell @click="report(item.id)" v-for="(item,index) in type" icon="location-o" :key="index" :title="item.name" />
    </van-cell-group>
  </van-dialog>
</template>

<script>
// 导入不喜欢文章的api
import { apiDislikeArticles, apiReportArticle } from '@/api/articles'
// 导入拉黑作者的api
import { apiAddBlackList } from '@/api/user'
export default {
  props: ['value', 'currentArticle', 'dataList'],
  data () {
    return {
      // 显示举报
      isShow: false,
      // 举报类型
      type: [
        { id: 0, name: '其他问题' },
        { id: 1, name: '标题夸张' },
        { id: 2, name: '低俗色情' },
        { id: 3, name: '错别字多' },
        { id: 4, name: '旧闻重复' },
        { id: 5, name: '广告软文' },
        { id: 6, name: '内容不实' },
        { id: 7, name: '涉嫌违法犯罪' },
        { id: 8, name: '侵权' }
      ]
    }
  },
  methods: {
    // 确定按钮
    confirBtn () {
      console.log(222)
    },
    // 取消按钮
    cleBtn () {
      this.$emit('input', false)
    },
    // 隐藏文章
    async hideArticle () {
      // 将当前文章从数据源中删除
      this.dataList.forEach((item, index) => {
        // 判断: 当前的文章的id 与数据源中的 id匹配时才能删除
        if (item.art_id === this.currentArticle.art_id) {
          this.dataList.splice(index, 1)
        }
      })
      //  关闭当前的面板
      this.$emit('input', false)
      //  提示用户隐藏成功
      this.$toast('将减少推荐类似内容')
      let user = this.$store.state.user
      if (user) {
        // 发送axiso请求
        let res = await apiDislikeArticles(this.$http, {
          url: `/article/dislikes/${this.currentArticle.art_id}`,
          method: 'DELETE'
        })
        console.log(res)
      }
    },
    // 举报文章
    async report (type) {
      let res = await apiReportArticle(this.$http, {
        target: this.currentArticle.art_id,
        type: type
      })
      console.log(res)
      // 回退到操作选项
      this.isShow = false
      // 关闭面板
      this.$emit('input', false)
      this.$toast.success('举报内容已经提交')
    },
    // 加入黑名单
    async blackList () {
      // 得到被拉黑的作者 id
      let authorId = this.currentArticle.aut_id
      // 提交到服务器
      let res = await apiAddBlackList(this.$http, authorId)
      console.log(res)
      this.$emit('input', false)
      this.$toast.success('拉黑用户成功')
    }
  }
}
</script>

<style>
</style>
