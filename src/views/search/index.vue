<template>
  <div>
    <van-search
      background="#0094ff"
      v-model.trim="search"
      placeholder="请输入搜索关键词"
      show-action
      @search="onSearch"
      @input="valueChange"
      @cancel="onCancel"
    />
    <!-- 历史记录区域 -->
    <van-cell-group v-if="thinkList.length <= 0">
      <van-cell title="历史记录">
        <van-icon @click="showIcon=false" slot="right-icon" name="delete" style="line-height: inherit;" v-if="showIcon===true" />
        <template slot="default" v-if="showIcon===false">
          <span @click="clearUp" class="custom-title">清空</span>
          <span @click="showIcon=true" class="custom-title">完成</span>
        </template>
      </van-cell>
      <!-- 显示历史记录 -->
      <van-grid :column-num="2" clickable >
        <van-grid-item class="myGrid" @click="onSearch(item)" v-for="(item,index) in historyList" :key="index" :text="item">
          <template slot="icon">
            <van-icon class="delIcon" @click.stop="delItem(index)" name="cross" />
        </template>
        </van-grid-item>
      </van-grid>
    </van-cell-group>
    <!-- 联想区域 -->
    <van-cell-group class="thinkplace">
      <van-cell icon="search" clickable v-for="(item,index) in thinkList" :key="index">
      <!-- 自定义左侧内容 -->
      <template slot="title">
        <div v-html="item.colorItem" @click="onSearch(item.defaultItem)"></div>
      </template>
      <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <van-icon slot="right-icon" name="cross" style="line-height: inherit;"/>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
// 导入搜索联想的api
import { apiThinkSearch } from '@/api/search'
export default {
  data () {
    return {
      search: '',
      // 搜索联想数组
      thinkList: [],
      // 防抖的定时器
      timer: null,
      // 图标显示
      showIcon: true,
      // 所有的历史记录
      historyList: JSON.parse(window.localStorage.getItem('historyList')) || []
    }
  },
  methods: {
    // 按下回车键触发
    onSearch (key) {
      this.search = key
      // 判断 不为空
      if (!this.search) {
        this.$toast('请输入要搜索的内容')
        return
      }
      // 添加到历史记录数组
      this.historyList.unshift(key)
      // 1.0 数组的去重
      this.historyList = [...new Set(this.historyList)]
      // 保存到本地
      window.localStorage.setItem('historyList', JSON.stringify(this.historyList))
      // 跳转到搜索展示页面
      this.$router.push(`/searchShow/${key}`)
    },
    // 输入框内容变化时触发
    valueChange () {
      // 清除定时器
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        // 判断 如果不为空发送axios请求
        if (this.search) {
          let res = await apiThinkSearch(this.$http, this.search)
          // 遍历数组
          let results = res.options.map(item => {
            return {
              colorItem: item.split(this.search).join(`<span style="color: blue;">${this.search}</span>`),
              defaultItem: item
            }
          })
          // 进行赋值
          this.thinkList = results
        }
      }, 200)
    },
    // 点击取消时触发
    onCancel () {
      console.log(1)
      this.$router.push('/layout/home')
    },
    // 点击清空历史记录
    clearUp () {
      console.log(1)
      // 判断是否要删除
      this.$dialog.confirm({
        message: '你确认要删除吗?'
      }).then(() => {
        this.historyList = []
        window.localStorage.removeItem('historyList')
      }).catch((err) => {
        console.log(err)
      })
    },
    // 点击xx删除
    delItem (index) {
      console.log(index)
      // 根据下标删除该项
      this.historyList.splice(index, 1)
      // 重新保存到本地
      window.localStorage.setItem('historyList', JSON.stringify(this.historyList))
    }
  },
  watch: {
    // 监听search,当他为空,联想列表也应该为空
    search: function () {
      if (this.search.length === 0) {
        this.thinkList = []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-search__action {
  color: #fff;
}
.van-search__action:active {
    color: gold;
    background-color: #0094ff
}
.custom-title {
  margin: 0 5px;
  color: red;
}
.myGrid {
  position: relative;
  .delIcon {
    position: absolute;
    top: 0;
    right: 0;
    color: red;
  }
}
</style>
