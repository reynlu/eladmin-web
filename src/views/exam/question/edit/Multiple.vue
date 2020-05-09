<template>
  <div class="app-container">
    <el-form
      v-loading="formLoading"
      :model="form"
      label-width="100px"
      label-position="left"
      :rules="rule"
    >
      <el-form-item label="考站" prop="stationLevel" required>
        <el-select
          v-model="form.stationLevel"
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
        <el-input v-model="form.title" style="width:60%;" placeholder="请输入考试题干内容" />
      </el-form-item>
      <el-form-item label="选项" required>
        <el-form-item
          v-for="(item,index) in form.items"
          :key="item.prefix"
          :label="item.prefix"
          label-width="50px"
          class="question-item-label"
        >
          <el-input v-model="item.prefix" style="width:50px;" />
          <el-input
            v-model="item.content"
            class="question-item-content-input"
            @focus="inputClick(item,'content')"
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
        <el-input-number v-model="form.score" :precision="1" :step="1" :max="100" />
      </el-form-item>
      <el-form-item label="难度：" required>
        <el-rate v-model="form.difficult" class="question-item-rate" />
      </el-form-item>
      <el-form-item label="正确答案：" prop="correctArray" required>
        <el-checkbox-group v-model="form.correctArray">
          <el-checkbox
            v-for="item in form.items"
            :key="item.prefix"
            :label="item.prefix"
          >{{ item.prefix }}</el-checkbox>
        </el-checkbox-group>
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
import { mapGetters, mapState } from 'vuex'
export default {
  data() {
    return {
      form: {
        id: null,
        questionType: 1,
        stationLevel: null,
        title: '',
        items: [
          { prefix: 'A', content: '' },
          { prefix: 'B', content: '' },
          { prefix: 'C', content: '' },
          { prefix: 'D', content: '' }
        ],
        analyze: '',
        correct: '',
        correctArray: [],

        score: '',
        difficult: 0
      },
      rule: {},
      formLoading: false
    }
  },
  methods: {
    stationChange() {}
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
