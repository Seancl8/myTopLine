<template>
  <div class="addComments">
      <!-- 添加评论区域 -->
    <van-search left-icon="" shape="round" v-model.trim="value" placeholder="写评论" show-action @search="onSearch">
        <div slot="action" @click="onSearch">发送</div>
    </van-search>
  </div>
</template>

<script>
// 导入给文章评论和回复评论的api
import { makeArticleComments, apiReplyComments } from '@/api/articles'
export default {
  props: ['artId', 'commentList', 'isa', 'itemObj'],
  data () {
    return {
    // 输入框的值
      value: ''
    }
  },
  methods: {
    //   添加评论的方法
    async onSearch () {
      // 判断不为空
      if (!this.value) {
        return
      }
      let res
      if (this.isa) {
        res = await makeArticleComments(this.$http, {
          target: this.artId,
          content: this.value
        })
      } else {
        // 获取评论的id
        let comId = this.itemObj.com_id
        res = await apiReplyComments(this.$http, {
          target: comId,
          content: this.value,
          artid: this.artId
        })
      }
      // 添加到评论数组
      this.commentList.unshift(res.new_obj)
      // 清空输入框
      this.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.addComments {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>
