
<template>
  <div class="login">
    <p style="margin: 16px;" v-if="isSecretaryDisplay">科室管理入口</p>
    <van-grid v-if="isSecretaryDisplay" :column-num="3" square clickable>
        <van-grid-item v-for="router in routers" :key="router.text" :icon="router.icon" :text="router.text" :url="router.url"/>
    </van-grid>
    <p style="margin: 16px;" v-if="isJiDiDisplay">基地管理入口</p>
    <van-grid v-if="isJiDiDisplay" :column-num="3" square clickable>
        <van-grid-item v-for="router in routersJiDi" :key="router.text" :icon="router.icon" :text="router.text" :url="router.url"/>
    </van-grid>
    <p style="margin: 16px;" v-if="isTeacherDisplay">带教老师管理入口</p>
    <van-grid v-if="isTeacherDisplay" :column-num="3" square clickable>
        <van-grid-item v-for="router in teacherRouters" :key="router.text" :icon="router.icon" :text="router.text" :url="router.url"/>
    </van-grid>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import 'vant/lib/index.css'
import store from '@/store'
import { Toast } from 'vant'
import physician_轮转计划 from '@/assets/images/entrance/physician_轮转计划.jpg'
import physician_变更申请 from '@/assets/images/entrance/physician_变更申请.jpg'
import physician_诊断录入 from '@/assets/images/entrance/physician_诊断录入.jpg'
import physician_诊断历史 from '@/assets/images/entrance/physician_诊断历史.jpg'
import physician_排班 from '@/assets/images/entrance/physician_排班.jpg'
import physician_匹配带教 from '@/assets/images/entrance/physician_匹配带教.jpg'
import physician_教学活动 from '@/assets/images/entrance/physician_教学活动.jpg'
export default {
  name: 'Login',
  data() {
    return {
      isJiDiDisplay: false,
      isSecretaryDisplay: false,
      isTeacherDisplay: false,
      routers: [
          {
              url: 'https://axyz.run/mobile-secretary/schedule',
              icon: physician_排班,
              text: '学员排班'
          },
          {
              url: 'https://axyz.run/mobile-secretary/assign-teacher',
              icon: physician_匹配带教,
              text: '带教老师'
          },
          {
              url: 'https://axyz.run/mobile-secretary/rotation-list',
              icon: physician_轮转计划,
              text: '查看科室轮转列表'
          },
          {
              url: 'https://axyz.run/mobile-secretary/teaching',
              icon: physician_教学活动,
              text: '教学活动'
          },
          {
              url: 'https://axyz.run/mobile-secretary/diagnosis-history',
              icon: physician_诊断历史,
              text: '科室诊断查询'
          }
      ],
      routersJiDi: [
          {
              url: 'https://axyz.run/mobile-secretary/jd/students',
              icon: physician_排班,
              text: '基地学员查询'
          },
          {
              url: 'https://axyz.run/mobile-secretary/jd/rotations',
              icon: physician_匹配带教,
              text: '基地轮转查询'
          },
          {
              url: 'https://axyz.run/mobile-secretary/jd/rotation-list',
              icon: physician_轮转计划,
              text: '查看轮转列表'
          },
          {
              url: 'https://axyz.run/mobile-secretary/jd/teaching',
              icon: physician_教学活动,
              text: '基地教学活动'
          }],
      teacherRouters: [
          {
              url: 'https://axyz.run/mobile-secretary/schedule',
              icon: physician_排班,
              text: '指导学员查询'
          },
          {
              url: 'https://axyz.run/mobile-secretary/assign-teacher',
              icon: physician_匹配带教,
              text: '教学活动'
          }],
      
    }
  },
  created() {
    const roles = store.getters.user.roles
    console.log(roles)
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "科室主任" || roles[i].name === "科室秘书") {
        this.isSecretaryDisplay = true
      }
      if (roles[i].name === "基地主任" || roles[i].name === "基地秘书") {
        this.isJiDiDisplay = true
      }
    }
    if (!this.isJiDiDisplay && !this.isSecretaryDisplay) {
      this.isTeacherDisplay = true
    }
  },
  mounted() {

  }
}
</script>
