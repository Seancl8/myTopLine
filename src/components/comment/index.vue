<template>
  <div>
    <!-- 评论内容 -->
    <van-cell>
      <template slot="title">
        <div class="comInfo">
          <div class="picIcon">
            <van-image class="iconImg" round width="50" height="50" :src="itemObj.aut_photo" />
            <span style="font-size: 16px;color: blue">{{itemObj.aut_name}}</span>
          </div>
          <div>
            <van-icon class="likeIcon" name="like" color="red" />{{itemObj.like_count}}
          </div>
        </div>
        <div class="comtext">{{itemObj.content}}</div>
        <div class="comtext">
          <span style="margin-right: 10px;">{{itemObj.pubdate | relativetime}}</span>
          <van-button v-if="isa === true" @click="replyBtn" plain round size="small" hairline type="primary">回复{{itemObj.reply_count}}</van-button>
        </div>
      </template>
    </van-cell>
  </div>
</template>

<script>
// 导入eventBus
import Bus from '@/utils/bus'
export default {
  props: ['itemObj', 'value', 'isa'],
  data () {
    return {
      // 是否是文章
      isA: true
    }
  },
  methods: {
    // 回复评论
    replyBtn () {
      // 点击的时候需要打开回复弹出层
      this.$emit('input', true)
      // 把itemObj传入回复组件
      Bus.$emit('passvalue', this.itemObj)
    }
  }
}
</script>

<style lang="less" scoped>
.likeIcon {
  font-size: 24px;
}
.comInfo {
  display: flex;
  justify-content: space-between;
  .picIcon {
    display: flex;
    align-items: top;
  }
}
.iconImg {
  margin-right: 10px;
}
.comtext {
  margin-left: 60px;
  font-size: 16px;
}
</style>
