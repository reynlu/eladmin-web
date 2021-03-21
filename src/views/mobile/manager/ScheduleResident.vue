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

    <van-field
      v-model="resident"
      is-link
      readonly
      label="住院医师"
      placeholder="请选择住院医师"
      @click="showBegin = true"
    />

    <van-field
      v-model="trainingTeacherName"
      readonly
      label="带教老师"
      placeholder="未设置带教老师"
    />

    <van-cell title="选择该月份排班日期" :value="text" @click="showCalander = true" />
    <van-calendar v-model="showCalander" type="multiple" :min-date="minDate" :max-date="maxDate" @confirm="onDateConfirm" />

    <van-popup v-model="showBegin" round position="bottom">
      <van-cascader
        v-model="beforeValue"
        title="请选择住院医师"
        :options="rLables"
        @close="showBegin = false"
        @finish="onFinishBegin"
      />
    </van-popup>

    <van-popup v-model="showPicker" title="请选择年月" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onFinishYearMonth"
      />
    </van-popup>
  
    <div style="margin: 16px;">
      <van-button round block type="info" native-type="submit" @click="submit()">提交</van-button>
    </div>
  </div>
</template>
<script>
import 'vant/lib/index.css'
import store from '@/store'
import { Toast } from 'vant'
import { getRotationRecords, updateRotation, updateScheduleRotation } from '@/api/mobile/rotation'
import { getAllDepatments } from '@/api/mobile/department'
import { getPhysician, getPhysicians } from '@/api/mobile/physician'
import { assignSchedule } from '@/api/mobile/wx'

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
      defaultForm: {
        trainingDepartmentId: null,
        size: 2000
      },
      dpsForm: {
        page: 0,
        size: 40
      },
      postForm: {
        groupid: 1,
        items: [],
        yearmonth: 0
      },
      departments: [],
      rotations: [],
      rotationsWithYearMonth: [],
      physician: null,
      rLables: [],
      yearMonth: '',
      resident: null,
      trainingTeacherName: '',
      student: null,
      showBegin: false,
      showPicker: false,
      showCalander: false,
      beforeValue: null,
      afterValue: null,
      dStr: "",
      minDate: new Date(),
      maxDate: new Date()
    }
  },
  created() {
    getAllDepatments(this.dpsForm).then(response => {
      this.departments = response.content
    })
    this.init()
  },
  methods: {
    async init() {
        const p = await getPhysician({id: store.getters.user.uid})
        this.physician = p
        this.defaultForm.trainingDepartmentId = this.physician.departmentId
        const students = await getRotationRecords(this.defaultForm)
        this.rotations = students.content
    },
    getDepartment(departmentId) {
      for (let i = 0; i < this.departments.length; i++) {
        if (parseInt(this.departments[i].departmentId) === departmentId) {
          return this.departments[i]
        }
      }
    },
    getRotation(residentId) {
      for (let i = 0; i < this.rotations.length; i++) {
        if (this.rotations[i].residentId == residentId) {
          return this.rotations[i]
        }
      }
    },

    initRotations(yearMonth) {
      this.rotationsWithYearMonth = []
      for (var i = 0; i < this.rotations.length; i++) {
        if (this.rotations[i].recordYearMonth == yearMonth) {
          this.rotationsWithYearMonth.push(this.rotations[i])
        }
      }
      for (var i = 0; i < this.rotationsWithYearMonth.length; i++) {
        var item = {
          text: this.rotationsWithYearMonth[i].residentName + "(" + this.rotationsWithYearMonth[i].trainingDepartmentId + ")",
          value: this.rotationsWithYearMonth[i].residentId
        }
        this.rLables.push(item)
      }
    },
    onFinishYearMonth(value) {
      this.showPicker = false
      this.initRotations(value[0]+value[1])
      this.postForm.yearmonth = value[0]+value[1]
      this.yearMonth = `选择了 ${value[0]+value[1]}`
      this.resident = ''
      this.trainingTeacherName = ''
      this.student = null
      Toast.success('日期修改，请重新选择住院医师')
      this.minDate = new Date(parseInt(value[0]), parseInt(value[1]) - 1, 1)
      this.maxDate = new Date(parseInt(value[0]), parseInt(value[1]) - 1, 31)
    },
    onFinishBegin({selectedOptions}) {
      this.showBegin = false
      this.resident =  selectedOptions.map((option) => option.text).join('.')
      this.student = this.getRotation(selectedOptions[0].value)
      this.trainingTeacherName = this.student.trainingTeacherName
    },
    onDateConfirm(value) {
      this.postForm.items = []
      this.dStr = ""
      const nowDate = new Date()
      const day = nowDate.getDate()
      console.log(day)
      for (let i = 0; i < value.length; i++) {
        if (day < value[i].getDate()) {
          const item = {
            "userid": this.student.residentId,
            "day": value[i].getDate(),
            "schedule_id": 79
          }
          this.postForm.items.push(item)
          this.dStr = this.dStr + "," + value[i].getDate()
        }
      }
      console.log(this.dStr)
      this.showCalander = false
    },
    submit() {
      var _this = this
      assignSchedule(this.postForm).then(response => {
        this.resident = ''
        this.trainingTeacherName = ''
        this.student = null 
        Toast.success('设置成功成功，请继续后续操作');
      })    
      var form = {
        residentId: this.student.residentId,
        yearMonth: this.postForm.yearmonth,
        scheduleValue: this.dStr,
        synchronization: false
      }
      updateScheduleRotation(form).then(response => {
      })
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
