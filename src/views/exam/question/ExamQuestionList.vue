<template>
  <div class="app-container">
    <el-form ref="formDada" :model="formDada" :inline="true" :rules="rules">
      <el-form-item label="题目ID：">
        <el-input v-model="formDada.id" clearable />
      </el-form-item>
      <el-form-item label="归属考站：" prop="station" required>
        <el-select v-model="formDada.station" placeholder="选择考站项目" clearable @change="stationChange">
          <el-option
            v-for="item in stationEnum"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学科：">
        <el-select v-model="formDada.marjorId" placeholder="选择学科项目" clearable>
          <el-option
            v-for="item in majorEnum"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="题型：" prop="type" required>
        <el-select v-model="formDada.type" placeholder="选择题型" clearable @change="typeChange">
          <el-option
            v-for="item in questionTypeEnum"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-popover placement="bottom" trigger="click">
          <el-button
            v-for="item in editUrlEnum"
            :key="item.key"
            type="warning"
            size="mini"
            @click="$router.push({path:item.value})"
          >{{ item.name }}</el-button>
          <el-button slot="reference" type="primary" class="link-left">添加</el-button>
        </el-popover>
        <el-popover placement="bottom" trigger="click">
          <el-button
            v-for="item in editUrlEnum"
            :key="item.key"
            type="warning"
            size="mini"
            @click="uploadXML(item.key)"
          >{{ item.name }}</el-button>
          <el-button slot="reference" type="primary" class="link-left">导入</el-button>
        </el-popover>
      </el-form-item>
    </el-form>
    <!--表单渲染-->
    <el-dialog :visible.sync="dialogVisible" title="导入考题表格" width="570px">
      <el-upload
        ref="upload"
        class="upload-demo"
        action="http://49.233.183.161:8000/api/exam/question/upload"
        name="excelFile"
        :data="params"
        :headers="headers"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
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
        <div slot="tip" class="el-upload__tip">只能上传XML文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>

    <el-table v-loading="listLoading" :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="id" label="题目编号" width="80" />
      <el-table-column prop="station" label="题目所属考站" :formatter="stationFormat" width="160" />
      <el-table-column prop="difficult" label="题目难度" width="180" />
      <el-table-column
        prop="questionType"
        label="题目类型"
        :formatter="questionTypeFormat"
        width="120"
      />
      <el-table-column prop="score" label="题目分数" width="100" />
      <el-table-column fixed="right" label="操作" width="160">
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
          <el-button size="small" @click="editQuestion(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="1000" />
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import { getQuestionList, upload } from '@/api/exam/question'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
      formDada: {
        id: null,
        tyep: null,
        station: null,
        marjorId: null,
        page: 0,
        size: 10
      },
      rules: {
        type: [
          { required: true, message: '请选择考试题型', trigger: 'blur' }
        ],
        station: [
          { required: true, message: '请选择考题所属考站', trigger: 'blur' }
        ]
        // marjorId: [{ required: true, message: "请选择专业", trigger: "blur" }]
      },
      subjectFilter: null,
      listLoading: false,
      tableData: [],
      total: 0,
      questionShow: {
        qType: 0,
        dialog: false,
        question: null,
        loading: false
      },
      params: {
        type: 1
      },
      dialogVisible: false,
      headers: {
        Authorization: getToken()
      }
    }
  },
  created() {},
  methods: {
    search() {
      this.$refs.formDada.validate(valid => {
        if (valid) {
          this.listLoading = true
          getQuestionList(this.formDada).then(response => {
            console.log(response.data)
            this.tableData = response.content
            this.listLoading = false
          })
        } else {
          return false
        }
      })
    },
    stationChange(value) {
      this.formDada.station = value
    },
    typeChange(value) {
      this.formDada.type = value
    },
    submitForm() {},
    editQuestion(row) {
      const url = this.enumFormat(this.editUrlEnum, row.questionType)
      this.$router.push({ path: url, query: { id: row.id }})
    },
    stationFormat(row, column, cellValue, index) {
      return this.enumFormat(this.stationEnum, cellValue)
    },
    questionTypeFormat(row, column, cellValue, index) {
      return this.enumFormat(this.questionTypeEnum, cellValue)
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    uploadXML(type) {
      this.params.type = type
      this.dialogVisible = true
    },
    beforeUpload(file) {
      var fd = new window.FormData()
      fd.append('excelFile', file)
      fd.append('type', this.uploadType)
      upload(fd)
    }
  },
  computed: {
    ...mapGetters('enumItem', ['enumFormat']),
    ...mapState('enumItem', {
      questionTypeEnum: state => state.exam.question.typeEnum,
      editUrlEnum: state => state.exam.question.editUrlEnum,
      stationEnum: state => state.user.stationEnum,
      majorEnum: state => state.user.majorEnum
    }),
    ...mapState('exam', {
      subjects: state => state.subjects
    })
  }
}
</script>
