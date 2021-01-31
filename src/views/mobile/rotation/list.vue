<template>
  <div>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div v-for="(item, index) in list" :key="item.id" class="list-cell-container">
        <p class="list-cell-header">轮转计划第{{ index + 1 }}个月 - {{ item.recordYearMonth }}</p>
        <p><label class="list-cell-label">科室秘书</label>  {{ item.trainingDepartmentId }}</p>
        <p><label class="list-cell-label">带教老师</label>  {{ item.trainingTeacherName }}</p>
        <p><label class="list-cell-label">轮转状态</label>  {{ item.trainingDepartmentId }}</p>
        <p><label class="list-cell-label">学习内容</label>  {{ item.trainingDepartmentId }}</p>
      </div>
    </van-list>
  </div>
</template>
<script>
import 'vant/lib/index.css'
import store from '@/store'
import { getRotationRecords } from '@/api/mobile/rotation'
export default {
  data() {
    return {
      defaultForm: {
        residentId: store.getters.user.uid
      },
      list: [],
      total: 0,
      loading: false,
      finished: false
    }
  },
  methods: {
    onLoad() {
      getRotationRecords(this.defaultForm).then(response => {
        this.list = response.content
        this.total = response.totalElements
        this.loading = false
        this.finished = true
      })
    }
  }
}
</script>
<style lang="less">
.list {
  &-cell-container {
    width: 90%;
    height: 53vw;
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
    padding: 12px;
    background: #ff7700
  }
  &-cell-label {
    padding: 15px 0;
    font-size: 18px;
    text-align: center;
    padding-left: 12px;
    color: rgb(63, 57, 57);
  }
  &-cell-value {
    padding: 15px 0;
    font-size: 16px;
    text-align: center;
    color: rgb(2, 2, 2);
  }
}
</style>
