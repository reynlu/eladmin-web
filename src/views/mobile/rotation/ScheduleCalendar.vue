<template>
  <div>
    <van-field
      v-model="yearMonth"
      is-link
      readonly
      label="时间"
      placeholder="请选择设置的时间"
      @click="showPicker = true"
    />

    <van-popup v-model="showPicker" title="请选择年月" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onFinishCalendar"
      />
    </van-popup>
    <van-cell title="该月份排班日期：" />
    <van-calendar v-model="showCalander" type="multiple" :min-date="minDate" :max-date="maxDate" :formatter="formatter"/>

    <div style="margin: 16px;">
      <van-button round block type="info" native-type="submit" @click="submit()">查询</van-button>
    </div>
  </div>
</template>
<script>
import 'vant/lib/index.css'
import store from '@/store'
import { Toast } from 'vant'
import { getSchedules } from '@/api/mobile/rotation'

export default {
  data() {
    return {
      columns: [
        // 第一列
        {
          values: ['2021', '2022', '2023', '2024'],
          defaultIndex: 0,
        },
        // 第二列
        {
          values: ['01', '02', '03', '04', '05', '06','07', '08', '09','10', '11', '12'],
          defaultIndex: 0,
        },
      ],
      showPicker: false,
      showCalander: false,
      schedules: [],
      days: [],
      dpsForm: {
        residentId: store.getters.user.uid,
        page: 0,
        size: 100
      },
      yearMonth: '',
      minDate: new Date(),
      maxDate: new Date()
    }
  },
  created() {
    getSchedules(this.dpsForm).then(response => {
      this.schedules = response.content
    })
    console.log(store.getters.user)
    console.log(store.getters.resident)
  },
  methods: {
    initDays(yearMonth) {
      this.days = []
      for (var i = 0; i < this.schedules.length; i++) {
        if (this.schedules[i].yearMonth === yearMonth) {
          this.days = this.schedules[i].scheduleValue.split(",")
          return
        }
      }
    },
    onFinishCalendar(value) {
      this.showPicker = false
      this.initDays(value[0]+value[1])
      this.minDate = new Date(parseInt(value[0]), parseInt(value[1]) - 1, 1)
      this.maxDate = new Date(parseInt(value[0]), parseInt(value[1]) - 1, 31)
      this.yearMonth = value[0]+value[1]
    },
    formatter(day) {
      const month = day.date.getMonth() + 1
      const date = day.date.getDate()
      if (this.days.indexOf(date.toString()) > 0) {
        day.bottomInfo = '班'
        console.log(day)
      }
      return day
    },
    submit() {
      this.showCalander = true
    }
  }
}
</script>
<style lang="less">
.list {
  &-cell-container {
    width: 95%;
    height: 53vw;
    display: block;
    border-radius: 4px;
    box-shadow: #2b2a2a;
    margin-left: 12px;
    margin-right: 12px;
    background: #09afe2;
  }
  &-cell-container2 {
    width: 95%;
    height: 53vw;
    display: block;
    border-radius: 4px;
    box-shadow: #2b2a2a;
    margin-left: 12px;
    margin-right: 12px;
    background: #f5e4d6;
  }
  &-cell-header {
    padding-top: 12px;
    padding-bottom: 12px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    color: #ffffff;
    padding: 12px;
    background: #00edfe;
  }
  &-cell-header2 {
    padding-top: 12px;
    padding-bottom: 12px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    color: #ffffff;
    padding: 12px;
    background: #ff7700;
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
