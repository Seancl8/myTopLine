<template>
  <div class="layout">
    <!-- 路由出口 -->
    <router-view />
    <!-- 底部标签栏-->
    <van-tabbar v-model="active" fixed  active-color="#07c160" inactive-color="#000" router>
      <van-tabbar-item  replace to="/layout/home" icon="wap-home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/search" icon="comment-o">问答</van-tabbar-item>
      <van-tabbar-item icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item icon="contact">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0
    }
  }
}
</script>

<style>
</style>
