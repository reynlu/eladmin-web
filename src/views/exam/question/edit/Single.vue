<template>
  <div class="app-container">
    <el-form ref="questionForm" v-loading="formLoading" :model="questionForm" label-width="100px" label-position="left" :rules="rule">
      <el-form-item label="考站" prop="examStation" required>
        <el-select
          v-model="questionForm.examStation"
          placeholder="请选择试题所属考站"
          clearable
          @change="stationChange"
        >
          <el-option
            v-for="item in stationEnum"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="题目" prop="title" required>
        <el-input v-model="questionForm.title" style="width:60%;" placeholder="请输入考试题干内容" />
      </el-form-item>
      <el-form-item label="选项" required>
        <el-form-item
          v-for="(item,index) in questionForm.items"
          :key="item.prefix"
          :label="item.prefix"
          label-width="50px"
          class="question-item-label"
        >
          <el-input v-model="item.prefix" style="width:50px;" />
          <el-input
            v-model="item.content"
            class="question-item-content-input"
          />
          <el-button
            type="danger"
            size="mini"
            class="question-item-remove"
            icon="el-icon-delete"
            @click="questionItemRemove(index)"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="分数：" prop="score" required>
        <el-input-number v-model="questionForm.score" :precision="1" :step="1" :max="100" />
      </el-form-item>
      <el-form-item label="难度：" required>
        <el-rate v-model="questionForm.difficult" class="question-item-rate" />
      </el-form-item>
      <el-form-item label="正确答案：" prop="correct" required>
        <el-radio-group v-model="questionForm.correct">
          <el-radio
            v-for="item in questionForm.items"
            :key="item.prefix"
            :label="item.prefix"
          >{{ item.prefix }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button type="success" @click="questionItemAdd">添加选项</el-button>
        <el-button type="success" @click="showQuestion">预览</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { addQuestion } from '@/api/exam/question'
import { mapGetters, mapState } from 'vuex'
export default {
  data() {
    return {
      questionForm: {
        id: null,
        questionType: 1,
        examStation: null,
        title: '',
        items: [
          { prefix: 'A', content: '' },
          { prefix: 'B', content: '' },
          { prefix: 'C', content: '' },
          { prefix: 'D', content: '' }
        ],
        analyze: '',
        correct: '',
        score: '',
        difficult: 0
      },
      rule: {},
      formLoading: false
    }
  },
  methods: {
    questionItemRemove(index) {
      this.questionForm.items.splice(index, 1)
    },
    questionItemAdd() {
      const items = this.questionForm.items
      const last = items[items.length - 1]
      const newLastPrefix = String.fromCharCode(last.prefix.charCodeAt() + 1)
      items.push({ id: null, prefix: newLastPrefix, content: '' })
    },
    stationChange() {
    },
    submitForm() {
      const _this = this
      this.$refs.questionForm.validate((valid) => {
        if (valid) {
          this.formLoading = true
          addQuestion(this.questionForm).then(re => {
            console.log(re.code)
            if (re.code === 200) {
              _this.$message.success(re.message)
              _this.$router.push('/exam/question/list')
            } else {
              _this.$message.error(re.message)
              this.formLoading = false
            }
          }).catch(e => {
            this.formLoading = false
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs['questionForm'].resetFields()
    },
    showQuestion() {

    }
  },
  computed: {
    ...mapGetters('enumItem', ['enumFormat']),
    ...mapState('enumItem', {
      questionTypeEnum: state => state.exam.question.typeEnum,
      stationEnum: state => state.user.stationEnum
    })
  }
}
</script>
