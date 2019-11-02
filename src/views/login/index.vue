<template>
  <div class="login">
    <!-- 页面顶部 -->
    <van-nav-bar title="登录" class="topBar" />
    <!-- 输入框 -->
    <van-cell-group>
      <van-field
        left-icon="phone-circle"
        v-model="user.mobile"
        clearable
        label="手机号"
        placeholder="请输入手机号"
        @click-right-icon="$toast('question')"
        :error-message="errorPhone"
      />
      <van-field
        left-icon="lock"
        v-model="user.code"
        clearable
        label="密码"
        placeholder="请输入验证码"
        :error-message="errorCode"
      >
        <van-button
          slot="button"
          size="small"
          type="primary"
          :disabled="isDisable"
          @click="countDown"
        >{{timer ? `${countTime}秒后发验证码` : '点击发送验证码'}}</van-button>
      </van-field>
    </van-cell-group>
    <!-- 登录按钮 -->
    <div class="login-btn">
      <van-button type="info" :disabled="!!timer" class="l-btn" size="large" @click="valiDate">主要按钮</van-button>
    </div>
  </div>
</template>

<script>
// 导入登录界面的发送axios方法
import { userLogin } from '@/api/user'
export default {
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810'
      },
      // 错误的信息
      errorPhone: '',
      errorCode: '',
      // 发送验证码倒计时的时间
      countTime: 10,
      // 计时器句柄
      timer: null,
      // 是否禁用
      isDisable: false
    }
  },
  methods: {
    // async 修饰异步代码所在的函数
    // await 修饰异步代码
    // 验证
    async valiDate () {
      if (this.user.mobile.trim().length !== 11) {
        this.errorPhone = '手机号码必须为11位'
        return
      }
      this.errorPhone = ''
      if (this.user.code.trim().length !== 6) {
        this.errorCode = '验证码必须为6位'
        return
      }
      this.errorCode = ''
      // 调用方法 发送请求
      try {
        let res = await userLogin(this.$http, {
          url: '/authorizations',
          method: 'POST',
          data: this.user
        })
        // 将用户数据保存到仓库中
        this.$store.commit('setUser', res)
        this.$toast.allowMultiple()
        this.$toast.loading({
          loadingType: 'spinner',
          duration: 600,
          mask: true,
          message: '登陆中...'
        })
        setTimeout(() => {
          if (this.$route.path !== '/login') {
            this.$router.back()
          } else {
            this.$router.push('/layout/home')
          }
          this.$toast({
            message: '恭喜你登录成功...'
          })
        }, 700)
      } catch {
        setTimeout(() => {
          this.$toast.fail('很遗憾,登录失败')
        }, 500)
      }
    },
    // 点击发送验证码
    countDown () {
      // 点击的时候禁止按钮
      this.isDisable = true
      // 创建一个计时器
      this.timer = setInterval(() => {
        this.countTime--
        if (this.countTime === 0) {
          // 关闭计时器
          clearInterval(this.timer)
          // 把时间归位
          this.countTime = 10
          // 清除句柄
          this.timer = null
          this.isDisable = false
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.topBar {
  background-color: #3296fa;
  color: #fff;
}
.login-btn {
  margin: 20px;
}
.l-btn {
  border-radius: 5px;
}
</style>
