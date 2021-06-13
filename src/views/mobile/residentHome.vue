<template>
  <div class="login">
    <van-grid :column-num="3" square clickable>
        <van-grid-item v-for="router in routers" :key="router.text" :icon="router.icon" :text="router.text" :url="router.url"/>
    </van-grid>
  </div>
</template>

<script>
import resident_轮转计划 from '@/assets/images/entrance/resident_轮转计划.jpg'
import resident_变更申请 from '@/assets/images/entrance/resident_变更申请.jpg'
import resident_诊断录入 from '@/assets/images/entrance/resident_诊断录入.jpg'
import resident_诊断历史 from '@/assets/images/entrance/resident_诊断历史.jpg'
import resident_排班 from '@/assets/images/entrance/resident_排班.jpg'
import resident_匹配带教 from '@/assets/images/entrance/resident_匹配带教.jpg'
import resident_教学活动 from '@/assets/images/entrance/resident_教学活动.jpg'
export default {
  name: 'Login',
  data() {
    return {
      routers: [
          {
              url: 'https://axyz.run/mobile/rotation/list',
              icon: resident_轮转计划,
              text: '轮转计划'
          },
          {
              url: 'https://axyz.run/mobile/rotation/exchange',
              icon: resident_变更申请,
              text: '变更申请'
          },
          {
              url: 'https://axyz.run/mobile/diagnosis/add',
              icon: resident_诊断录入,
              text: '诊断录入'
          },
          {
              url: 'https://axyz.run/mobile/diagnosis/history',
              icon: resident_诊断历史,
              text: '诊断历史'
          },
          {
              url: 'https://axyz.run/mobile/schedule-calendar',
              icon: resident_排班,
              text: '排班日历'
          },
          {
              url: 'https://axyz.run/mobile/teaching',
              icon: resident_教学活动,
              text: '教学活动'
          }
      ]
      
    }
  }
}
</script>
