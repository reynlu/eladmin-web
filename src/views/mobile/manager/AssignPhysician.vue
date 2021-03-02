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
      v-model="fieldValue"
      is-link
      readonly
      label="住院医师"
      placeholder="请选择住院医师"
      @click="showBegin = true"
    />

    <van-field
      v-model="fieldValue2"
      is-link
      readonly
      label="带教老师"
      placeholder="请选择该住院医师的带教老师"
      @click="showEnd = true"
    />
    <van-popup v-model="showBegin" round position="bottom">
      <van-cascader
        v-model="beforeValue"
        title="请选择住院医师"
        :options="rLables"
        @close="showBegin = false"
        @finish="onFinishBegin"
      />
    </van-popup>

    <van-popup v-model="showEnd" round position="bottom">
      <van-cascader
        v-model="beforeValue"
        title="请选择该住院医师的带教老师"
        :options="pLables"
        @close="showEnd = false"
        @finish="onFinishEnd"
      />
    </van-popup>

    <van-popup v-model="showPicker" title="请选择年月" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onFinishCalendar"
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
import { getRotationRecords, updateRotation } from '@/api/mobile/rotation'
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
        
      },
      departments: [],
      rotations: [],
      rotationsWithYearMonth: [],
      physician: null,
      physicians: [],
      rLables: [],
      pLables: [],
      yearMonth: '',
      student: null,
      teacher: null,      
      showBegin: false,
      showEnd: false,
      showPicker: false,
      fieldValue: null,
      fieldValue2: null,
      beforeValue: null,
      afterValue: null
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
        const tearchers = await getPhysicians({departmentId: this.physician.departmentId, size: 100})
        const students = await getRotationRecords(this.defaultForm)
        this.rotations = students.content
        this.physicians = tearchers.content
        this.initOptions()
    },
    getDepartment(departmentId) {
      for (let i = 0; i < this.departments.length; i++) {
        if (this.departments[i].departmentId) {
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
    getTeacher(physicianId) {
      for (let i = 0; i < this.physicians.length; i++) {
        if (this.physicians[i].physicianId == physicianId) {
          return this.physicians[i]
        }
      }
    },
    initOptions() {
      for (var i = 0; i < this.physicians.length; i++) {
        var item = {
          text: this.physicians[i].name + "(" + this.physicians[i].physicianId + ")",
          value: this.physicians[i].physicianId
        }
        this.pLables.push(item)
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
    onFinishBegin({selectedOptions}) {
      this.showBegin = false
      this.fieldValue =  selectedOptions.map((option) => option.text).join('.')
      this.student = this.getRotation(selectedOptions[0].value)
    },
    onFinishEnd({selectedOptions}) {
      this.showEnd = false
      this.fieldValue2 = selectedOptions.map((option) => option.text).join('.')
      this.teacher = this.getTeacher(selectedOptions[0].value)
    },
    onFinishCalendar(value) {
      this.showPicker = false
      this.initRotations(value[0]+value[1])
      this.yearMonth = `选择了 ${value[0]+value[1]} 个日期`
    },
    submit() {
      var _this = this
      console.log(this.teacher)
      this.student.trainingTeacherName = this.teacher.name
      this.student.trainingTeacherId = this.teacher.physicianId
      updateRotation(this.student).then(response => {
        this.fieldValue = ''
        this.fieldValue2 = ''
        this.yearMonth = ''
        this.student = null,
        this.teacher = null, 
        Toast.success('录入成功，请继续后续操作');
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
