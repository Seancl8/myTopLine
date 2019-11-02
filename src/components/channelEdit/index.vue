<template>
  <!-- 弹出层组件 -->
  <!-- 把v-model拆成了 value属性和input方法 -->
  <div class="showArea">
    <van-popup
      :overlay="true"
      :value="value"
      @input="$emit('input',false)"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '85%' }"
    >
      <!-- 我的频道 -->
      <div class="myChannel">
        <van-cell size="large" title="我的频道">
          <template slot="default">
            <!-- 点击编辑时候显示图标,点击完成时关闭图标 -->
            <van-button
              @click="showAcross=true"
              v-if="showAcross===false"
              plain
              hairline
              type="info"
              size="small"
              round
              color="#f85a5a"
            >编辑</van-button>
            <van-button
              @click="showAcross=false"
              v-if="showAcross===true"
              plain
              hairline
              type="info"
              size="small"
              round
              color="green"
            >完成</van-button>
          </template>
        </van-cell>
        <van-grid :gutter="10" clickable>
          <van-grid-item
            @click="selChannel(index)"
            :class="{activecolor: index==activeIndex}"
            class="my-channel"
            v-for="(item,index) in channelList"
            :key="index"
          >
            <template slot="text">
              {{item.name}}
              <!-- 阻止冒泡 -->
              <van-icon @click.stop="delMyChannel(index)" class="across" name="clear" v-show="showAcross&&index!==0"></van-icon>
            </template>
          </van-grid-item>
        </van-grid>
      </div>
      <!-- 频道推荐 -->
      <div class="channelRecommend">
        <van-cell size="large" title="频道推荐" />
        <van-grid :gutter="10" clickable>
          <van-grid-item class="my-channel" @click="addToMyChannel(item)" v-for="(item,index) in otherChannel" :key="index">
            <template slot="text">{{item.name}}</template>
          </van-grid-item>
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>

<script>
// 导入获取全部频道的方法
import { apiGetAllChannel, apiDelChannel, apiAddChannels } from '@/api/channel'
export default {
  props: ['value', 'channelList', 'activeIndex'],
  data () {
    return {
      // 图标的默认
      showAcross: false,
      // 所有的频道列表
      allChannelList: []
    }
  },
  methods: {
    // 切换组件里的频道
    selChannel (index) {
      this.$emit('update:activeIndex', index)
    },
    // 获取所有的频道
    async getAllChannel () {
      let res = await apiGetAllChannel(this.$http, {
        url: '/channels',
        method: 'GET'
      })
      this.allChannelList = res.channels
    },
    // 添加到我的频道里面
    async addToMyChannel (item) {
      // 在每一项中动态添加属性
      this.$set(item, 'pull', false)
      this.$set(item, 'up', false)
      this.$set(item, 'finished', false)
      this.$set(item, 'articlesList', [])
      this.$set(item, 'timestamp', 0)
      this.channelList.push(item)
      // 判断有无登录过
      let user = this.$store.state.user
      if (!user) {
        window.localStorage.setItem('localChannels', JSON.stringify(this.channelList))
      } else {
        // 根据用户频道数据生成channels
        let channels = this.channelList.slice(1).map((item, index) => {
          return {
            id: item.id,
            seq: index + 2
          }
        })
        // 发送axios请求
        let res = await apiAddChannels(this.$http, {
          url: '/user/channels',
          method: 'PUT',
          data: {
            channels
          }
        })
        console.log(res)
      }
    },
    // 删除我的频道
    async delMyChannel (index) {
      this.channelList.splice(index, 1)
      // 判断有无登录
      let user = this.$store.state.user
      if (!user) {
        // 如果没有登录过就删除并且保存在本地
        window.localStorage.setItem('localChannels', JSON.stringify(this.channelList))
      } else {
        // 根据用户频道数据生成channels
        let channels = this.channelList.slice(1).map((item, index) => {
          return {
            id: item.id,
            seq: index + 2
          }
        })
        // 向axios发送请求
        let res = await apiDelChannel(this.$http, {
          url: '/user/channels',
          method: 'PUT',
          data: {
            channels
          }
        })
        console.log(res)
      }
    }
  },
  computed: {
    otherChannel () {
      // 获取所有用户频道的id
      let ids = this.channelList.map(item => {
        return item.id
      })
      // 获取不包含用户频道id获取
      return this.allChannelList.filter(item => {
        return !ids.includes(item.id)
      })
    }
  },
  created () {
    this.getAllChannel()
  }
}
</script>

<style lang="less" scoped>
.myChannel {
  margin-top: 10%;
  margin-bottom: 40px;
}
.my-channel {
  position: relative;
  font-size: 14px;
  color: #0094ff;
  .across {
    position: absolute;
    top: 0;
    right: 0;
  }
}
.activecolor {
  color: red;
}
</style>
