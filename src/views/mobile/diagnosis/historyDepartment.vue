<template>
  <div>
    <van-search v-model="value" placeholder="请输入搜索学员姓名" @search="onSearch"/>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="doSearch">
      <div v-for="(item) in list" :key="item.id" class="list-cell-container">
        <h3 class="list-cell-header">病人ID号： {{ item.diagnosisCardId }}</h3>
        <p><label class="list-cell-label">录入时间</label>  {{ parseTime(item.createAt) }}</p>
        <p><label class="list-cell-label">更新时间</label>  {{ parseTime(item.updateAt) }}</p>
        <p><label class="list-cell-label">轮转科室</label>  {{ getDepartment(item.trainingDepartmentId).departmentName }}</p>
        <p><label class="list-cell-label">学习内容</label>  {{ getDepartment(item.trainingDepartmentId).departmentSubject }}</p>
        <p><label class="list-cell-label">备注</label>  {{ item.comment }}</p>
        <p><label class="list-cell-label">诊断医师</label>  {{ item.residentName }}</p>
      </div>
    </van-list>
  </div>
</template>
<script>
import 'vant/lib/index.css'
import store from '@/store'
import { parseTime } from '@/utils/index'
import { getDiagnosisRecords } from '@/api/mobile/diagnosis'
import { getAllDepatments } from '@/api/mobile/department'

export default {
  data() {
    return {
      list: [],
      total: 0,
      page: 0,
      form: {
        blurry: null,
        page: 0,
        size: 10
      },
      dpsForm: {
        page: 0,
        size: 40
      },
      departments: [],
      loading: false,
      finished: true,
      value: null
    }
  },
  created() {
      this.init()
  },
  methods: {
    parseTime,
    async init() {
      const dps = await getAllDepatments(this.dpsForm)
      this.departments = this.departments.concat(dps.content)
    },
    formatState(state) {
      if (state === 1) {
        return '已经录入'
      } else if (state === 2) {
        return '已经更新'
      } else {
        return '未知'
      }
    },
    getDepartment(departmentId) {
      for (let i = 0; i < this.departments.length; i++) {
        if (this.departments[i].departmentId) {
          return this.departments[i]
        }
      }
    },
    onSearch(value) {
      this.list = []
      this.form.blurry = value
      this.form.page = 0
      this.doSearch()
    },
    async doSearch() {
      console.log(this.form)
      if(this.form.blurry === null) {
          this.loading = false
          return
      }
      const response = await getDiagnosisRecords(this.form)
      this.list = this.list.concat(response.content)
      this.total = response.totalElements
      this.loading = false
      console.log(this.list.length)
      if (response.content.length < 10) {
        this.finished = true
      } else {
        this.form.page = this.form.page + 1
        this.finished = false
      }
    }
  }
}
</script>
<style lang="less">
.list {
  &-cell-container {
    width: 95%;
    height: 50vw;
    display: block;
    border-radius: 4px;
    box-shadow: #2b2a2a;
    margin-left: 12px;
    margin-right: 12px;
    font-size: 12px;
    background: #cfe1f4
  }
  &-cell-header {
    padding-top: 12px;
    padding-bottom: 12px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    color: #ffffff;
    padding: 12px;
    font-size: 10px;
    background: #1989fa
  }
  &-cell-label {
    padding: 2px 0;
    font-size: 10px;
    text-align: center;
    padding-left: 12px;
    color: rgb(63, 57, 57);
  }
  &-cell-value {
    padding: px 0;
    font-size: 10px;
    text-align: center;
    color: rgb(2, 2, 2);
  }
}
</style>
