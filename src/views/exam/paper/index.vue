<template>
  <div class="app-container">
    <el-form ref="defaultForm" :model="defaultForm" :inline="true" :rules="rules">
      <el-form-item label="归属考站：" prop="station">
        <el-select v-model="defaultForm.station" placeholder="选择考站项目" clearable>
          <el-option
            v-for="item in stationEnum"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="题型：" prop="type">
        <el-select v-model="defaultForm.type" placeholder="选择题型" clearable>
          <el-option
            v-for="item in questionTypeEnum"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="考试任务" prop="taskExamId" required>
        <el-select v-model="defaultForm.taskExamId" placeholder="请选择试卷归属的考试任务" clearable>
          <el-option v-for="item in tasks" :key="item.id" :value="item.id" :label="item.title" />
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
            @click="uploadXML(item.key)"
          >{{ item.name }}</el-button>
          <el-button slot="reference" type="primary" class="link-left">导入</el-button>
        </el-popover>
      </el-form-item>
    </el-form>
    <!--表单渲染-->
    <el-dialog :visible.sync="dialogVisible" title="导入考题表格" width="570px">
      <el-form
        ref="uploadForm"
        :model="uploadForm"
        :rules="uploadRules"
        size="small"
        label-width="180px"
      >
        <el-form-item label="考试任务" prop="task_exam_id" required>
          <el-select v-model="uploadForm.task_exam_id" placeholder="请选择试卷归属的考试任务" clearable>
            <el-option v-for="item in tasks" :key="item.id" :value="item.id" :label="item.title" />
          </el-select>
        </el-form-item>
        <el-form-item label="归属考站：" prop="station">
          <el-select v-model="uploadForm.station" placeholder="选择考站项目" clearable>
            <el-option
              v-for="item in stationEnum"
              :key="item.key"
              :value="item.key"
              :label="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-upload
        ref="upload"
        class="upload-demo"
        :action="uploadUrl"
        name="excelFile"
        :data="uploadForm"
        :headers="headers"
        :on-success="handleSuccess"
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

    <el-table v-loading="listLoading" :data="tableData" stripe height="250">
      <el-table-column prop="id" label="试卷编号" width="80" />
      <el-table-column prop="station" label="试卷所属考站" :formatter="stationFormat" width="160" />
      <el-table-column prop="name" label="试卷标题" width="380" />
      <el-table-column prop="type" label="试卷类型" :formatter="questionTypeFormat" width="120" />
      <el-table-column prop="score" label="试卷总分数" width="100" />
      <el-table-column prop="questionCount" label="题目数量" width="100" />
      <el-table-column label="操作" width="160">
        <template slot-scope="{row}">
          <el-button type="primary" @click="handleClick(row.id, row.name)">查看</el-button>
          <el-button type="primary" @click="editQuestion(row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :current-page="defaultForm.page"
      :page-sizes="[10,20]"
      :page-size="defaultForm.size"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import paperApi from '@/api/exam/paper'
import { getToken } from '@/utils/auth'
import taskApi from '@/api/exam/task'

export default {
  data() {
    return {
      defaultForm: {
        id: null,
        type: null,
        station: null,
        taskExamId: null,
        page: 0,
        size: 10
      },
      rules: {
        taskExamId: [
          { required: true, message: '请选择考试任务', trigger: 'blur' }
        ]
      },
      uploadForm: {
        type: null,
        station: null,
        task_exam_id: null
      },
      uploadRules: {
        type: [{ required: true, message: '请选择考题型', trigger: 'blur' }],
        station: [
          { required: true, message: '请选择所属考站', trigger: 'blur' }
        ],
        task_exam_id: [
          { required: true, message: '请选择考试任务', trigger: 'blur' }
        ]
      },
      params: {
        paperId: 1
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
      dialogVisible: false,
      headers: {
        Authorization: getToken()
      },
      tasks: null,
      uploadUrl: process.env.VUE_APP_BASE_API + '/api/exam/paper/upload'
    }
  },
  created() {
    taskApi.get().then(response => {
      console.log(response.content)
      this.tasks = response.content
      this.listLoading = false
    })
  },
  methods: {
    search() {
      this.$refs.defaultForm.validate(valid => {
        if (valid) {
          this.listLoading = true
          paperApi.get(this.defaultForm).then(response => {
            this.tableData = response.content
            this.total = response.totalElements
            this.listLoading = false
          })
        } else {
          return false
        }
      })
    },
    submitForm() {},
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
      this.uploadForm.type = type
      this.dialogVisible = true
    },
    handleClick(id, name) {
      this.params.paper_id = id
      paperApi.downloadJsonFile(this.params).then(response => {
        console.log(response)
        const url = window.URL.createObjectURL(new Blob([response], { type: 'application/octet-stream' }))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        // const fileName = parseTime(new Date()) + "-" + name + "." + suffix;
        link.setAttribute('download', '')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    handleSizeChange(val) {
      this.defaultForm.size = val
      this.search()
    },
    handleCurrentChange(val) {
      this.defaultForm.page = val - 1
      this.search()
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
