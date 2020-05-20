<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <!--表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="800px"
      >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="180px">
          <el-form-item label="归属考站：">
            <el-select
              v-model="formDada.station"
              placeholder="选择考站项目"
              clearable
              @change="levelChange"
            >
              <el-option
                v-for="item in stationEnum"
                :key="item.key"
                :value="item.key"
                :label="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="题型：">
            <el-select v-model="formDada.type" placeholder="选择题型" clearable>
              <el-option
                v-for="item in questionTypeEnum"
                :key="item.key"
                :value="item.key"
                :label="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="考试任务">
            <el-select v-model="formDada.task_exam_id" placeholder="请选择试卷归属的考试任务" clearable>
              <el-option v-for="item in tasks" :key="item.id" :value="item.id" :label="item.title" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-upload
          ref="upload"
          action="http://49.233.183.161:8000/api/exam/paper/upload"
          name="excelFile"
          :data="formDada"
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
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        size="small"
        style="width: 100%;"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="试卷名称" />
        <el-table-column prop="type" label="题目类型" />
        <el-table-column prop="station" label="试卷所属考张" />
        <el-table-column prop="score" label="试卷总分(千分制)" />
        <el-table-column prop="questionCount" label="题目数量" />
        <el-table-column prop="suggestTime" label="建议时长(分钟)" />
        <el-table-column prop="limitStartTime" label="开始时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.limitStartTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="limitEndTime" label="结束时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.limitEndTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="frameTextContentId" label="试卷框架内容为JSON" />
        <el-table-column prop="createUser" label="创建者" />
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deleted" label="deleted" />
        <el-table-column prop="taskExamId" label="考试任务" />
        <el-table-column
          v-permission="['admin','hisExamPaper:edit','hisExamPaper:del']"
          label="操作"
          width="150px"
          align="center"
        >
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission" />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudHisExamPaper from '@/api/exam/paper'
import taskApi from '@/api/exam/task'
import { getToken } from '@/utils/auth'

import CRUD, { presenter, header, form, crud } from '@crud/crud'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { mapGetters, mapState } from 'vuex'
const defaultForm = {
  id: null,
  name: null,
  type: null,
  station: null,
  score: null,
  questionCount: null,
  suggestTime: null,
  limitStartTime: null,
  limitEndTime: null,
  frameTextContentId: null,
  createUser: null,
  createTime: null,
  deleted: null,
  taskExamId: null
}
export default {
  name: 'HisExamPaper',
  components: { pagination, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '考试试卷管理',
      url: 'api/exam/paper/get-all-paper',
      sort: 'id,desc',
      crudMethod: { ...crudHisExamPaper }
    })
  },
  data() {
    return {
      formDada: {
        id: null,
        type: null,
        station: null,
        task_exam_id: null
      },
      permission: {
        add: ['admin', 'hisExamPaper:add'],
        edit: ['admin', 'hisExamPaper:edit'],
        del: ['admin', 'hisExamPaper:del']
      },
      rules: {
        type: [
          {
            required: true,
            message: '1.单选题  2.多选题  3.打分题  4.主观题不能为空',
            trigger: 'blur'
          }
        ]
      },
      tasks: null,
      headers: {
        Authorization: getToken()
      }
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
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    levelChange() {
      this.formDada.subjectId = null
    },
    submitUpload() {
      this.$refs.upload.submit()
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

<style scoped>
</style>
