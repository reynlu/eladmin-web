<template>
  <div>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div v-for="(item) in list" :key="item.id" class="list-cell-container">
        <h3 class="list-cell-header">病人ID号： {{ item.diagnosisCardId }}</h3>
        <p><label class="list-cell-label">录入时间</label>  {{ item.createAt }}</p>
        <p><label class="list-cell-label">更新时间</label>  {{ item.updateAt }}</p>
        <p><label class="list-cell-label">状态</label>  {{ item.state }}</p>
        <p><label class="list-cell-label">备注</label>  {{ item.comment }}</p>
      </div>
    </van-list>
  </div>
</template>
<script>
import 'vant/lib/index.css'
import store from '@/store'
import { getDiagnosisRecords } from '@/api/mobile/diagnosis'
export default {
  data() {
    return {
      defaultForm: {
        residentId: store.getters.user.uid,
        page: 0
      },
      list: [],
      total: 0,
      loading: false,
      finished: false
    }
  },
  methods: {
    onLoad() {
      getDiagnosisRecords(this.defaultForm).then(response => {
        this.list = response.content
        this.total = response.totalElements
        this.loading = false
        this.defaultForm.page = this.defaultForm.page + 1
      })
    }
  }
}
</script>
<style lang="less">
.list {
  &-cell-container {
    width: 90%;
    height: 50vw;
    display: block;
    border-radius: 4px;
    box-shadow: #2b2a2a;
    margin-left: 12px;
    margin-right: 12px;
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
