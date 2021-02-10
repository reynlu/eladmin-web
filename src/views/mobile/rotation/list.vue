<template>
  <div>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div v-for="(item, index) in list" :key="item.id" class="list-cell-container">
        <p class="list-cell-header">轮转计划第{{ index + 1 }}个月 - {{ item.recordYearMonth }}</p>
        <p><label class="list-cell-label">带教老师</label>  {{ item.trainingTeacherName }}</p>
        <p><label class="list-cell-label">轮转科室</label>  {{ getDepartment(item.trainingDepartmentId).departmentName }}</p>
        <p><label class="list-cell-label">学习内容</label>  {{ getDepartment(item.trainingDepartmentId).departmentSubject }}</p>
        <p><label class="list-cell-label">科室秘书</label>  {{ getDepartment(item.trainingDepartmentId).departmentSecretary }}</p>
      </div>
    </van-list>
  </div>
</template>
<script>
import 'vant/lib/index.css'
import store from '@/store'
import { getRotationRecords } from '@/api/mobile/rotation'
import { getAllDepatments } from '@/api/mobile/department'

export default {
  data() {
    return {
      defaultForm: {
        residentId: store.getters.user.uid,
        size: 40
      },
      dpsForm: {
        page: 0,
        size: 40
      },
      departments: [],
      list: [],
      total: 0,
      loading: false,
      finished: false
    }
  },
  methods: {
    async onLoad() {
      const dps = await getAllDepatments(this.dpsForm)
      const rotations = await getRotationRecords(this.defaultForm)
      console.log(dps)
      console.log(rotations)
      this.departments = this.departments.concat(dps.content)
      this.list = rotations.content
      this.total = rotations.totalElements
      this.loading = false
      this.finished = true
    },
    getDepartment(departmentId) {
      for (let i = 0; i < this.departments.length; i++) {
        if (this.departments[i].departmentId) {
          return this.departments[i]
        }
      }
    }
  }
}
</script>
<style lang="less">
.list {
  &-cell-container {
    width: 95%;
    height: 56vw;
    display: block;
    border-radius: 4px;
    box-shadow: #2b2a2a;
    margin-left: 12px;
    margin-right: 12px;
    background: #f5e4d6
  }
  &-cell-header {
    padding-top: 12px;
    padding-bottom: 12px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    color: #ffffff;
    padding: 8px;
    background: #ff7700
  }
  &-cell-label {
    padding: 15px 0;
    font-size: 14px;
    text-align: center;
    padding-left: 12px;
    color: rgb(63, 57, 57);
  }
  &-cell-value {
    padding: 15px 0;
    font-size: 14px;
    text-align: center;
    color: rgb(2, 2, 2);
  }
}
</style>
