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
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div v-for="item in rotationsWithYearMonth" :key="item.id" class="list-cell-container">
        <p class="list-cell-header">学员姓名 - {{ item.residentName }}</p>
        <p><label class="list-cell-label">带教老师</label>  {{ item.trainingTeacherName }}</p>
        <p><label class="list-cell-label">轮转科室</label>  {{ getDepartment(item.trainingDepartmentId).departmentName }}</p>
        <p><label class="list-cell-label">学习内容</label>  {{ getDepartment(item.trainingDepartmentId).departmentSubject }}</p>
        <p><label class="list-cell-label">科室秘书</label>  {{ getDepartment(item.trainingDepartmentId).departmentSecretary }}</p>
      </div>
    </van-list>
    <van-popup v-model="showPicker" title="请选择年月" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onFinishYearMonth"
      />
    </van-popup>
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

    initRotations(yearMonth) {
      this.rotationsWithYearMonth = []
      for (var i = 0; i < this.rotations.length; i++) {
        if (this.rotations[i].recordYearMonth == yearMonth) {
          this.rotationsWithYearMonth.push(this.rotations[i])
        }
      }
    },
    onFinishYearMonth(value) {
      this.showPicker = false
      this.initRotations(value[0]+value[1])
      this.yearMonth = `选择了 ${value[0]+value[1]}`
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
    background: #09e26b;
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
    background: #bafe00;
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
