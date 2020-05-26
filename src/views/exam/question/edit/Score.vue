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
      <el-form-item label="考核细则" required>
        <el-form-item
          v-for="(item,index) in form.items"
          :key="item.prefix"
          :label="item.prefix"
          label-width="50px"
          class="question-item-label"
        >
          <el-input v-model="item.prefix" style="width:50px;" />
          <el-input v-model="item.content" style="width:40%" @focus="inputClick(item,'content')" />
          <el-tag type="info" style="width:50px; margin-left: 8px;">分数</el-tag>
          <el-input-number v-model="item.score" :precision="1" :step="0.5" :max="10" />
          <el-button
            type="danger"
            size="mini"
            class="question-item-remove"
            icon="el-icon-delete"
            @click="questionItemRemove(index)"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="难度：" required>
        <el-rate v-model="form.difficult" class="question-item-rate" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button type="success" @click="questionItemAdd">添加选项</el-button>
        <el-button type="success" @click="showQuestion">预览</el-button>
        <el-upload
          ref="upload"
          class="upload-demo"
          action="uploadUrl"
          name="excelFile"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload"
          >上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
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
        items: [{ prefix: 1, content: '', score: '1' }],
        analyze: '',
        correct: '',
        correctArray: [],
        score: '',
        difficult: 0
      },
      rule: {},
      formLoading: false,
      uploadUrl: process.env.VUE_APP_BASE_API + '/api/question/batchInsertShops'
    }
  },
  methods: {
    stationChange() {},
    questionItemAdd() {
      const items = this.form.items
      const last = items[items.length - 1]
      const newLastPrefix = last.prefix + 1
      items.push({ prefix: newLastPrefix, content: '', score: '1' })
    },
    submitUpload() {
      this.$refs.upload.submit()
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
