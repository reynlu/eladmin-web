<template>
  <div>
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
    <van-cell title="选择该住院医师的排班日期" :value="calendars" @click="showCalendar = true" />
    <van-calendar v-model="showCalendar" type="multiple" @confirm="onFinishCalendar" />
    <div style="margin: 16px;">
      <van-button round block type="info" native-type="submit">提交申请</van-button>
    </div>
  </div>
</template>
<script>
import 'vant/lib/index.css'
import store from '@/store'
import { getRotationRecords } from '@/api/mobile/rotation'
import { getAllDepatments } from '@/api/mobile/department'
import { getPhysician, getPhysicians } from '@/api/mobile/physician'

export default {
  data() {
    return {
      defaultForm: {
        trainingDepartmentId: null,
        recordYearMonth: null,
        size: 200
      },
      dpsForm: {
        page: 0,
        size: 40
      },
      departments: [],
      rotations: [],
      physician: null,
      physicians: [],
      rLables: [],
      pLables: [],
      calendars: '',
      bRotation: null,
      eRotation: null,      
      showBegin: false,
      showEnd: false,
      showCalendar: false,
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
        const nowDate = new Date()
        const year = nowDate.getFullYear()
        const newmonth = nowDate.getMonth() > 10 ? nowDate.getMonth() : '0' + nowDate.getMonth()
        this.defaultForm.recordYearMonth = year + newmonth
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
    getRotation(yearMonth) {
      for (let i = 0; i < this.rotations.length; i++) {
        if (this.rotations[i].recordYearMonth === yearMonth) {
          return this.rotations[i]
        }
      }
    },
    initOptions() {
      for (var i = 0; i < this.rotations.length; i++) {
        var item = {
          text: this.rotations[i].residentName + "(" + this.rotations[i].trainingDepartmentId + ")",
          value: this.rotations[i].residentId
        }
        this.rLables.push(item)
      }
      for (var i = 0; i < this.physicians.length; i++) {
        var item = {
          text: this.physicians[i].name + "(" + this.physicians[i].physicianId + ")",
          value: this.physicians[i].physicianId
        }
        this.pLables.push(item)
      }
    },
    onFinishBegin({selectedOptions}) {
      this.showBegin = false
      this.fieldValue =  selectedOptions.map((option) => option.text).join('.')
      this.bRotation = this.getRotation(selectedOptions.value)
    },
    onFinishEnd({selectedOptions}) {
      this.showEnd = false
      this.fieldValue2 = selectedOptions.map((option) => option.text).join('.')
    },
    onFinishCalendar(dates) {
      this.showCalendar = false
      this.calendars = `选择了 ${dates.length} 个日期`
    },
    submit() {

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
