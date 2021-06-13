<template>
  <div class="app-container">
    <!--工具栏-->
    <el-form ref="defaultForm" :model="defaultForm" :inline="true" :rules="rules">
      <el-form-item label="招收年份：" prop="recruitmentYear">
        <el-select v-model="defaultForm.recruitmentYear" placeholder="选择招收的年份" clearable>
          <el-option
            v-for="item in recruitmentYearEnum"
            :key="item.value"
            :value="item.value"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="link-left" @click="searchRotationGroup">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="link-left" @click="uploadXML">导入</el-button>
      </el-form-item>
    </el-form>
    <!--表格渲染-->
    <el-table
      ref="table"
      border
      v-loading="loading"
      :data="rotationList"
      :row-class-name="tableRowClassName"
      height="600"
      size="small"
      style="width: 100%;"
    >
      <el-table-column
        fixed
        prop="resident.residentId"
        label="序号"
        width="100">
      </el-table-column>
      <el-table-column
        fixed
        prop="resident.name"
        label="姓名"
        width="60">
      </el-table-column>
      <el-table-column
        v-for="(item,index) in monthList"
        :key="index"
        :label="item"
        prop="rotations"
        align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.rotations | transToValue(index) }}</div>
          </template>
       </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
        <el-button type="text" size="small">编辑</el-button>
      </template>
    </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible" title="导入轮转计划" width="570px">
      <el-upload
        ref="upload"
        class="upload-demo"
        :action="uploadUrl"
        name="excelFile"
        :data="params"
        :headers="headers"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
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
    <el-dialog :visible.sync="dialogVisible" title="导入轮转计划" width="570px">
      <el-upload
        ref="upload"
        class="upload-demo"
        :action="uploadUrl"
        name="excelFile"
        :data="params"
        :headers="headers"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
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
  </div>
</template>

<script>
import { getAllResident } from '@/api/physician/resident'
import { rotationGroup } from '@/api/rotation/rotationPlanRecord'
import { getAllDepatments } from '@/api/mobile/department'
import { getToken } from '@/utils/auth'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'ResidentInformation',
   filters: {
        transToValue(val, index) {
          let r = val[index]
          var result = ''
          if (r.trainingDepartmentId == -1) {
            result += '未安排科室\n'
          } else {
            result += r.trainingDepartmentId + "\n"
          }
          if (r.trainingTeacherName == null) {
            result += '未安排老师'
          } else {
            result += r.trainingTeacherName
          }
          return result
        }
  },
  data() {
    return {
      defaultForm: {
        /** 状态 */ residentState: null,
        /** 学历 */ name: null,
        /** 学历 */ education: null,
        /** 学位 */ academicDegree: null,
        /** 人员类型 */ residentType: null,
        /** 招收年份 */ recruitmentYear: null,
        /** 培训专业 */ trainingName: null,
        trainingCounts: null,
        /** 是否获得医师资格证书 */ qualification: null,
        page: 0,
        size: 1000
      },
      departments: [],
      rules: {
        recruitmentYear: [
          { required: true, message: '请选择考试年份', trigger: 'blur' }
        ]
      },
      residentList: [],
      monthList: [],
      rotationList:[
      ],
      total: 0,
      headers: {
        Authorization: getToken()
      },
      loading: false,
      dialogVisible: false,
      uploadUrl: process.env.VUE_APP_BASE_API + '/api/rotation-record/import-record'
    }
  },
  created() {
    // this.search();
    this.init()
  },
  methods: {
    init() {
      getAllDepatments(this.dpsForm).then(response => {
        this.departments = response.content
      })
    },
    search() {
      this.listLoading = true
      getAllResident(this.defaultForm).then(response => {
        this.residentList = response.content
        this.total = response.totalElements
        this.listLoading = false
      })
    },
    uploadXML() {
      this.dialogVisible = true
    },
    searchRotationGroup() {
      this.listLoading = true
      rotationGroup(this.defaultForm).then(response => {
        if (response == null || response.size == 0) {
          alert('没有数据')
          return
        }
        let first = response[0]
        this.monthList = []
        for (let i = 0; i < first.rotations.length; i++) {
          this.monthList.push(first.rotations[i].recordYearMonth)
        }
        this.rotationList = response
        this.listLoading = false
      })
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleSizeChange(val) {
      this.defaultForm.size = val
      this.search()
    },
    handleCurrentChange(val) {
      this.defaultForm.page = val
      this.search()
    },
    tableRowClassName({row, rowIndex}) {
        if (rowIndex % 3  === 1) {
          return 'warning-row';
        } else if (rowIndex % 3 === 2) {
          return 'success-row';
        }
        return '';
      }
  },
  computed: {
    ...mapGetters('enumItem', ['enumFormat']),
    ...mapState('enumItem', {
      recruitmentYearEnum: state => state.resident.recruitmentYear,
      trainingBaseNameEnum: state => state.resident.trainingBaseName,
      residentTypeEnum: state => state.resident.residentType,
      yyEnum: state => state.resident.yy,
      residentStateEnum: state => state.resident.residentState,
      academicDegreeEnum: state => state.resident.academicDegree,
      educationEnum: state => state.resident.education,
      qualificationEnum: state => state.resident.qualification

    })
  }
}
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
