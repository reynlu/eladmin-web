<template>
  <div class="login">
      <el-form>
        <h3 class="title">
            红衣助手登录
        </h3>
        <p></p>
        <el-button :loading="loading" size="medium" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
        </el-button>
    </el-form>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import axios from 'axios'
import { getQueryObject } from '@/utils/index'
export default {
  name: 'Login',
  data() {
    return {
      codeUrl: '',
      cookiePass: '',
      weixinCode: '',
      loading: false,
      redirect: undefined
    }
  },
  created() {
    this.weixinCode = getQueryObject(window.location.href).userid
    this.redirect = getQueryObject(window.location.href).redirect
    console.log(this.redirect)
    if (!this.weixinCode) {
      const url = `http://axyz.run/wx-api/code2user-info?appId=1000006&response_type=code&scope&redirect=${this.redirect}`
      const encodeUrl = encodeURIComponent(url)
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=ww98802d1f88cae07b&redirect_uri=${encodeUrl}&response_type%3Dcode%26scope%3Dsnsapi_base%26state%3D%23wechat_redirect`
    }
  },
  mounted() {
    if (this.weixinCode) {
      this.handleLogin()
    }
  },
  methods: {
    handleLogin() {
      this.$store.dispatch('LoginWeixin', this.weixinCode).then(() => {
        this.loading = false
        this.$router.push({ path: this.redirect || '/' })
      }).catch(() => {
        this.loading = false
        this.getCode()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image:url(http://api.neweb.top/bing.php?type=rand);
    background-size: cover;
  }
  .title {
    margin: 0 auto 30px auto;
    text-align: center;
    color: #707070;
  }

  .login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 385px;
    padding: 25px 25px 5px 25px;
    .el-input {
      height: 38px;
      input {
        height: 38px;
      }
    }
    .input-icon{
      height: 39px;width: 14px;margin-left: 2px;
    }
  }
  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }
  .login-code {
    width: 33%;
    display: inline-block;
    height: 38px;
    float: right;
    img{
      cursor: pointer;
      vertical-align:middle
    }
  }
</style>
