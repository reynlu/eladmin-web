<template>
  <div>
    <van-field
      v-model="fieldValue"
      is-link
      readonly
      label="轮转计划"
      placeholder="请选择需要替换的轮转计划"
      @click="showBegin = true"
    />
    <div class="list-cell-container">
        <p class="list-cell-header">轮转计划 - {{  bRotation === null ? '--' :  bRotation.recordYearMonth }}</p>
        <p><label class="list-cell-label">带教老师</label>  {{  bRotation === null ? '--' :  bRotation.trainingTeacherName }}</p>
        <p><label class="list-cell-label">轮转科室</label>  {{  bRotation === null ? '--' :  getDepartment(bRotation.trainingDepartmentId).departmentName }}</p>
        <p><label class="list-cell-label">学习内容</label>  {{  bRotation === null ? '--' :  getDepartment(bRotation.trainingDepartmentId).departmentSubject }}</p>
        <p><label class="list-cell-label">科室秘书</label>  {{  bRotation === null ? '--' :  getDepartment(bRotation.trainingDepartmentId).departmentSecretary }}</p>
    </div>
    <van-field
      v-model="fieldValue2"
      is-link
      readonly
      label="轮转计划"
      placeholder="请选择目标轮转计划"
      @click="showEnd = true"
    />
    <div class="list-cell-container2">
        <p class="list-cell-header2">轮转计划 - {{ eRotation === null ? '--' :  eRotation.recordYearMonth }}</p>
        <p><label class="list-cell-label">带教老师</label>  {{  eRotation === null ? '--' :  eRotation.trainingTeacherName }}</p>
        <p><label class="list-cell-label">轮转科室</label>  {{  eRotation === null ? '--' :  getDepartment(eRotation.trainingDepartmentId).departmentName }}</p>
        <p><label class="list-cell-label">学习内容</label>  {{  eRotation === null ? '--' :  getDepartment(eRotation.trainingDepartmentId).departmentSubject }}</p>
        <p><label class="list-cell-label">科室秘书</label>  {{  eRotation === null ? '--' :  getDepartment(eRotation.trainingDepartmentId).departmentSecretary }}</p>
    </div>
    <van-popup v-model="showBegin" round position="bottom">
      <van-cascader
        v-model="beforeValue"
        title="请选择具体的轮转计划"
        :options="rLables"
        @close="showBegin = false"
        @finish="onFinishBegin"
      />
    </van-popup>
    <van-popup v-model="showEnd" round position="bottom">
      <van-cascader
        v-model="beforeValue"
        title="请选择具体的轮转计划"
        :options="rLables"
        @close="showEnd = false"
        @finish="onFinishEnd"
      />
    </van-popup>
    <div style="margin: 16px;">
      <van-button round block type="info" native-type="submit" @click="submit()">提交申请</van-button>
    </div>
  </div>
</template>
<script>
import 'vant/lib/index.css'
import store from '@/store'
import { Toast } from 'vant'; 
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
      rotations: [],
      rLables: [],
      bRotation: null,
      eRotation: null,      
      showBegin: false,
      showEnd: false,
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
    getRotationRecords(this.defaultForm).then(response => {
      this.rotations = response.content
      this.initOptions()
    })
  },
  methods: {
    getDepartment(departmentId) {
      for (let i = 0; i < this.departments.length; i++) {
        if (this.departments[i].departmentId) {
          console.log(this.departments[i])
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
          text: this.rotations[i].recordYearMonth + "--" + this.rotations[i].trainingDepartmentId + "--" + this.rotations[i].trainingTeacherName,
          value: this.rotations[i].recordYearMonth
        }
        this.rLables.push(item)
      }
    },
    onFinishBegin({selectedOptions}) {
      this.showBegin = false
      this.fieldValue =  selectedOptions.map((option) => option.text).join('.')
      this.bRotation = this.getRotation(selectedOptions[0].value)
    },
    onFinishEnd({selectedOptions}) {
      this.showEnd = false
      this.fieldValue2 =  selectedOptions.map((option) => option.text).join('.')
      this.eRotation = this.getRotation(selectedOptions[0].value)
    },
    submit() {
      this.fieldValue = ''
      this.fieldValue2 = ''
      this.bRotation = null,
      this.eRotation = null,   
      Toast.success('申请提交成功');
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
