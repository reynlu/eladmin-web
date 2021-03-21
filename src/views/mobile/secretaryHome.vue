
<template>
  <div class="login">
    <van-grid :column-num="3" square clickable>
        <van-grid-item v-for="router in routers" :key="router.text" :icon="router.icon" :text="router.text" :url="router.url"/>
    </van-grid>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import Shapes from '@/assets/images/Shapes.png'
import Harmony from '@/assets/images/Harmony.png'
import Play from '@/assets/images/Play.png'
import Radial from '@/assets/images/Radial.png'
import Trifecta from '@/assets/images/Trifecta.png'
import logo from '@/assets/images/logo.png'
export default {
  name: 'Login',
  data() {
    return {
      routers: [
          {
              url: 'https://axyz.run/mobile-secretary/schedule',
              icon: Shapes,
              text: '排班'
          },
          {
              url: 'https://axyz.run/mobile-secretary/assign-teacher',
              icon: Harmony,
              text: '带教老师'
          },
          {
              url: 'https://axyz.run/mobile-secretary/rotation-list',
              icon: Play,
              text: '查看轮转列表'
          },
          {
              url: '',
              icon: Radial,
              text: '活动'
          },
          {
              url: '',
              icon: Trifecta,
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
