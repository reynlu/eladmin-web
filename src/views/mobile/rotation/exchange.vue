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
import { mapState } from 'vuex'
import { Toast } from 'vant'; 
import { getRotationRecords, addWxExchangeRecord } from '@/api/mobile/rotation'
import { getAllDepatments } from '@/api/mobile/department'
import { applyEvent, getApplyTemplete } from '@/api/mobile/wx'

export default {
  data() {
    return {
      templateId: {
        template_id: '3Tmm5Cv1gYENo4VPi5xCwUeg1DbodpKYN9FyAAkC'
      },
      applyForm: {
        creator_userid: store.getters.user.uid, 
        template_id: "3Tmm5Cv1gYENo4VPi5xCwUeg1DbodpKYN9FyAAkC", 
        use_template_approver: 0, 
        approver: [{
            attr: 2,
            userid: []
        },
        {
            attr: 2,
            userid: []
        }], 
        notifyer: [], 
        notify_type: 2, 
        apply_data: {
            contents: [
                {
                    control: "Selector", 
                    id: "Selector-1612108436802", 
                    value: {
                      selector: {
                        type: "single",
                        options: []
                      }
                    }
                }, 
                {
                    control: "Selector", 
                    id: "Selector-1612109178507", 
                    value: {
                      selector: {
                        type: "single",
                        options: []
                      }
                    }
                }
            ]
        }, 
        summary_list: [
            {
                summary_info: [
                    {
                        text: "申请路径：", 
                        lang: "zh_CN"
                    }
                ]
            }, 
            {
                summary_info: [
                    {
                        text: "变更前：阿里巴巴天猫飞猪", 
                        lang: "zh_CN"
                    }
                ]
            }, 
            {
                summary_info: [
                    {
                        text: "变更后：京东拼多多抖音快手", 
                        lang: "zh_CN"
                    }
                ]
            }
        ]
      },
      template: null,
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
    getApplyTemplete(this.templateId).then(response => {
      this.template = response
    })
  },
  methods: {
    getDepartment(departmentId) {
      for (let i = 0; i < this.departments.length; i++) {
        if (parseInt(this.departments[i].departmentId) === departmentId) {
          return this.departments[i]
        }
      }
    },
    getBeforeOption(value) {
      for (let i = 0; i < this.beforeOptions.length; i++) {
        console.log(this.beforeOptions[i].value.text)
        console.log(value)
        if (this.beforeOptions[i].value.text == value) {
          console.log(this.beforeOptions[i])
          return this.beforeOptions[i]
        }
      }
    },
    getAfterOption(value) {
      for (let i = 0; i < this.afterOptions.length; i++) {
        if (this.afterOptions[i].value.text == value) {
          return this.afterOptions[i]
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
      var bDep = this.getDepartment(this.bRotation.trainingDepartmentId)
      var aDep = this.getDepartment(this.eRotation.trainingDepartmentId)
      var bOpt = this.getBeforeOption(bDep.departmentName + "," + bDep.departmentSubject)
      var aOpt = this.getAfterOption(aDep.departmentName + "," + aDep.departmentSubject)
      this.applyForm.approver[0].userid = [bDep.secretaryId, bDep.directorId]
      this.applyForm.approver[1].userid = [aDep.secretaryId, aDep.directorId]
      this.applyForm.notifyer = [bDep.secretaryId, bDep.directorId, aDep.secretaryId, aDep.directorId]
      
      this.applyForm.apply_data.contents[0].value.selector.options = [{
       'key': bOpt.key
      }]
      this.applyForm.apply_data.contents[1].value.selector.options = [{
       'key': aOpt.key
      }]
      console.log(bOpt)
      console.log(this.applyForm)
      
      applyEvent(this.applyForm).then(response => {
              this.listLoading = false
              if (response.errcode === 0) {
                this.addRecord(response.sp_no)
                this.fieldValue = ''
                this.fieldValue2 = ''
                this.bRotation = null,
                this.eRotation = null,
                Toast.success('申请提交成功');
              } else {
                Toast.success('申请提交失败');
              }
            })
            .catch(e => {
              //this.addRecord("100021212182121")
              Toast.success('申请提交失败');
            })  
    },
    addRecord(sp_no) {
      var postForm = {
        residentId: store.getters.user.uid,
        residentName: store.getters.user.nickName,
        originTrainingDepartmentId: this.bRotation.trainingDepartmentId,
        destinationTrainingDepartmentId: this.eRotation.trainingDepartmentId,
        originYearMonth: this.bRotation.recordYearMonth,
        destinationYearMonth: this.eRotation.recordYearMonth,
        weWorkNumberId: sp_no,
        weWorkState: 1
      }
      addWxExchangeRecord(postForm).then(response => {
        Toast.success('申请提交成功')
      })
      .catch(e => {
        Toast.success('申请提交失败')
      })
    }
  },
  computed: {
    ...mapState('applyEnum', {
      beforeOptions: state => state.configs.beforeOptions,
      afterOptions: state => state.configs.afterOptions,
    })
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
