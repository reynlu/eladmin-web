<template>
  <div class="login">
    <van-grid :column-num="3" square clickable>
        <van-grid-item v-for="router in routers" :key="router.text" :icon="router.icon" :text="router.text" :url="router.url"/>
    </van-grid>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import Angles from '@/assets/images/Angles.png'
import Harmony from '@/assets/images/Harmony.png'
import Play from '@/assets/images/Play.png'
import Radial from '@/assets/images/Radial.png'
import logo from '@/assets/images/logo.png'
export default {
  name: 'Login',
  data() {
    return {
      routers: [
          {
              url: 'http://axyz.run/mobile/rotation/list',
              icon: Angles,
              text: '轮转计划'
          },
          {
              url: 'http://axyz.run/mobile/rotation/exchange',
              icon: Harmony,
              text: '变更申请'
          },
          {
              url: 'http://axyz.run/mobile/diagnosis/add',
              icon: Play,
              text: '诊断录入'
          },
          {
              url: 'http://axyz.run/mobile/diagnosis/history',
              icon: Radial,
              text: '诊断历史'
          },
          {
              url: '',
              icon: logo,
              text: '活动'
          },
          {
              url: '',
              icon: logo,
              text: '其他'
          }
      ]
      
    }
  }
}
</script>
