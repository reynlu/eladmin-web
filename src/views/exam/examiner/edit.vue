<template>
  <div>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="160px"
      style="width:60%; margin-top:32px"
    >
      <el-form-item label="考官姓名" prop="examinerName" required>
        <el-input v-model="ruleForm.examinerName" />
      </el-form-item>
      <el-form-item label="名族" prop="nation" required>
        <el-input v-model="ruleForm.nation" />
      </el-form-item>
      <el-form-item label="性别" prop="gender" required>
        <el-select v-model="ruleForm.gender" placeholder="请选择性别" clearable>
          <el-option
            v-for="item in genderEnum"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="考官身份证号" prop="idNumber" required>
        <el-input v-model="ruleForm.idNumber" type="number" />
      </el-form-item>
      <el-form-item label="考官专业" prop="major" required>
        <el-select v-model="ruleForm.major" placeholder="选择学科项目" clearable>
          <el-option
            v-for="item in examinerAajorEnum"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleForm)">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { addExaminer } from '@/api/exam/examiner'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      ruleForm: {
        examinerName: '',
        gender: '',
        idNumber: '',
        nation: ' ',
        examinationStation: '',
        major: '',
        locationExaminationStation: null,
        examinerMajor: '',
        examinerPhoto: '',
        admissionTicket: ''
      },
      rules: {
        examinerName: [
          { required: true, message: '请输入考官姓名', trigger: 'blur' }
        ],
        idNumber: [
          { required: true, message: '请输入考官身份证号', trigger: 'blur' }
        ],
        major: [{ required: true, message: '请选择考官专业', trigger: 'blur' }],
        gender: [
          { required: true, message: '请输入考官性别', trigger: 'blur' }
        ],
        nation: [{ required: true, message: '请输入考官民族', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm(param) {
      const _this = this
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.formLoading = true
          addExaminer(param)
            .then(response => {
              this.listLoading = false
              alert('提交成功')
            })
            .catch(e => {
              _this.formLoading = false
            })
        } else {
          return false
        }
      })
    },
    restForm() {}
  },
  computed: {
    ...mapState('enumItem', {
      examinerAajorEnum: state => state.user.examinerAajorEnum,
      genderEnum: state => state.user.genderEnum
    })
  }
}
</script>
