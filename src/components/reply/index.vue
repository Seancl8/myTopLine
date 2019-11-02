<template>
  <div class="popup">
   <van-popup class="mypop" @input="$emit('input', $event)" :value="value" closeable close-icon="close" position="bottom" :style="{ height: '80%' }" >
     <!-- 标题 -->
     <van-cell :value="`${itemObj.reply_count}条回复`" value-class="replycount" />
     <!-- 该条评论显示区 -->
     <allcomments :itemObj="itemObj" :isa="false" />
     <!-- 标题 -->
     <van-cell value="全部回复" />
     <!-- 该条评论回复区 -->
     <div v-for="(itemArr,index) in commentReplyList" :key="index">
       <allcomments :itemObj="itemArr" :isa="false"/>
     </div>
     <!-- 添加评论区 -->
     <addcomments :isa="false" :itemObj="itemObj" :artId="artId" :commentList="commentReplyList" />
   </van-popup>
  </div>
</template>

<script>
// 导入底部的添加评论
import addcomments from '@/components/addcomments'
// 导入评论组件
import allcomments from '@/components/comment'
// 导入获取评论回复的api
import { apiGetReplyComments } from '@/api/comment'
// 导入eventBus
import Bus from '@/utils/bus'
export default {
  components: {
    addcomments,
    allcomments
  },
  props: ['value', 'artId', 'isa'],
  data () {
    return {
      // 评论数据源
      itemObj: {},
      limit: 10,
      // 评论id
      commentId: '',
      // 评论回复数组
      commentReplyList: []
    }
  },
  methods: {
    // 获取评论回复
    async getReplycommentList () {
      let res = await apiGetReplyComments(this.$http, {
        source: this.commentId.toString(),
        offset: undefined,
        limit: this.limit
      })
      console.log(res)
      this.commentReplyList = res.results
      console.log(this.commentReplyList)
    }
  },
  // 在页面创建的时候接收eventBus传来的itemObj
  created () {
    Bus.$on('passvalue', (value) => {
      // 赋值
      this.itemObj = value
    })
  },
  watch: {
    itemObj: function () {
      if (this.itemObj) {
        // 侦听当打开回复面板数据源存在的时候 获取评论id
        this.commentId = this.itemObj.com_id
        // 调用方法获取评论回复
        this.getReplycommentList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.mypop {
  padding-bottom: 50px;
}
.replycount {
  text-align: center;
}
</style>
