<template>
  <div>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="160px"
      style="width:60%; margin-top:32px"
    >
      <el-form-item label="考生姓名" prop="examineeName" required>
        <el-input v-model="ruleForm.examineeName" />
      </el-form-item>
      <el-form-item label="考生准考证号" prop="examineeId" required>
        <el-input v-model="ruleForm.examineeId" type="number" />
      </el-form-item>

      <el-form-item label="考生身份账号" prop="idNumber" required>
        <el-input v-model="ruleForm.idNumber" type="number" />
      </el-form-item>
      <el-form-item label="考生专业" prop="majorId" required>
        <el-select v-model="ruleForm.majorId" placeholder="选择学科项目" clearable>
          <el-option
            v-for="item in majorEnum"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="考生报考医院单位" prop="workUnit" required>
        <el-input v-model="ruleForm.workUnit" />
      </el-form-item>
      <el-form-item label="考生考试场" prop="examStation" required>
        <el-input v-model="ruleForm.examStation" />
      </el-form-item>
      <el-form-item label="考试时间时间" required>
        <el-col :span="11">
          <el-form-item prop="examDay" required>
            <el-date-picker
              v-model="ruleForm.examDay"
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="examPeriod" required>
            <el-select
              v-model="ruleForm.examPeriod"
              placeholder="选择时间段"
              style="width: 100%;"
              clearable
            >
              <el-option
                v-for="item in periodEnum"
                :key="item.key"
                :value="item.key"
                :label="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleForm)">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { addExaminee, getExaminee } from '@/api/exam/examinee'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      ruleForm: {
        examineeName: '',
        examineeId: '',
        idNumber: '',
        majorId: '',
        workUnit: '',
        examStation: '',
        examDay: '',
        examPeriod: '',
        examineePhoto: ''
      },
      rules: {
        examineeName: [
          { required: true, message: '请输入考生姓名', trigger: 'blur' }
        ],
        examineeId: [
          { required: true, message: '请输入考生准考证号', trigger: 'blur' }
        ],
        idNumber: [
          { required: true, message: '请输入省份证号', trigger: 'blur' }
        ],
        majorId: [
          { required: true, message: '请选择考生专业', trigger: 'blur' }
        ],
        workUnit: [
          { required: true, message: '请输入考生报考单位', trigger: 'blur' }
        ],
        examStation: [
          { required: true, message: '请输入考生考试场所', trigger: 'blur' }
        ],
        examDay: [
          { required: true, message: '请输入考生日期', trigger: 'blur' }
        ],
        examTime: [
          { required: true, message: '请输入考生考试时间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    const examineeId = this.$route.query.examineeId
    const _this = this
    if (examineeId && parseInt(examineeId) !== 0) {
      _this.formLoading = true
      getExaminee(examineeId).then(re => {
        _this.ruleForm = re.data
        _this.formLoading = false
      })
    }
  },
  methods: {
    submitForm(param) {
      const _this = this
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.formLoading = true
          addExaminee(param)
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
      majorEnum: state => state.user.majorEnum,
      periodEnum: state => state.user.periodEnum
    })
  }
}
</script>
