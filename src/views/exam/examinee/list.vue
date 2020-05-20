<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="formDada" :inline="true">
      <el-form-item label="准考证号：">
        <el-input v-model="formDada.examineeId" clearable />
      </el-form-item>
      <el-form-item label="考试任务" prop="p_task_exam_id" required>
        <el-select v-model="formDada.task_exam_id" placeholder="请选择试卷归属的考试任务" clearable>
          <el-option v-for="item in tasks" :key="item.id" :value="item.id" :label="item.title" />
        </el-select>
      </el-form-item>
      <el-form-item label="学科：">
        <el-select v-model="formDada.major_id" placeholder="选择学科项目" clearable>
          <el-option
            v-for="item in majorEnum"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">查询</el-button>
        <router-link :to="{path:'/exam/examinee/edit'}">
          <el-button size="primary">添加</el-button>
        </router-link>
        <el-button type="primary" @click="dialogVisible=true">导入</el-button>
      </el-form-item>
    </el-form>
    <!--表单渲染-->
    <el-dialog :visible.sync="dialogVisible" title="导入考生信息" width="570px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="180px">
        <el-form-item label="考试任务" prop="task_exam_id" required>
          <el-select v-model="form.task_exam_id" placeholder="请选择试卷归属的考试任务" clearable>
            <el-option v-for="item in tasks" :key="item.id" :value="item.id" :label="item.title" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-upload
        ref="upload"
        class="upload-demo"
        action="http://49.233.183.161:8000/api/exam/examinee/import-examinee"
        name="excelFile"
        :headers="headers"
        :data="form"
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
      <el-table-column fixed prop="examineeName" label="姓名" width="80" />
      <el-table-column prop="examineeId" label="考号" width="100" />
      <el-table-column prop="idNumber" label="身份证号" width="180" />
      <el-table-column prop="majorId" label="专业" width="120" :formatter="majorFormatter" />
      <el-table-column prop="examDay" label="考试日期" width="100" />
      <el-table-column prop="workUnit" label="报考医院" width="400" />
      <el-table-column prop="examStation" label="考试地点" width="300" />
      <el-table-column fixed="right" label="操作" width="160">
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
          <router-link
            :to="{path:'/exam/examinee/edit', query:{examineeId: row.examineeId}}"
            class="link-left"
          >
            <el-button type="text" size="small">编辑</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :current-page="formDada.page"
      :page-sizes="[10,20]"
      :page-size="formDada.size"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { getExamineeList } from '@/api/exam/examinee'
import taskApi from '@/api/exam/task'
import { mapGetters, mapState } from 'vuex'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      formDada: {
        examineeId: null,
        major_id: null,
        task_exam_id: null,
        size: 10,
        page: 1
      },
      form: {
        task_exam_id: null
      },
      rules: {
        task_exam_id: [
          { required: true, message: '请选择考试任务', trigger: 'blur' }
        ]
      },
      listLoading: false,
      tableData: [],
      dialogVisible: false,
      headers: {
        Authorization: getToken()
      },
      tasks: null, // 导入考生的时候的时候需要指定考试的任务
      total: 0
    }
  },
  created() {
    this.search()
    taskApi.get().then(response => {
      console.log(response.content)
      this.tasks = response.content
      this.listLoading = false
    })
  },
  methods: {
    search() {
      this.listLoading = true
      getExamineeList(this.formDada).then(response => {
        this.tableData = response.content
        this.listLoading = false
      })
    },
    submitForm() {
      this.listLoading = true
      getExamineeList(this.formDada).then(response => {
        this.tableData = response.content
        this.total = response.totalElements
        this.listLoading = false
      })
    },
    majorFormatter(row, column, cellValue, index) {
      return this.enumFormat(this.majorEnum, cellValue)
    },
    submitUpload() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$refs.upload.submit()
        } else {
          false
        }
      })
    },
    add() {

    },
    handleSuccess(response, file) {
      console.log(response)
    },
    handleSizeChange(val) {
      this.formDada.size = val
      this.search()
    },
    handleCurrentChange(val) {
      this.formDada.page = val
      this.search()
    }
  },
  computed: {
    ...mapGetters('enumItem', ['enumFormat']),
    ...mapState('enumItem', {
      majorEnum: state => state.user.majorEnum
    })
  }
}
</script>
