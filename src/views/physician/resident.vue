<template>
  <div class="app-container">
    <!--工具栏-->
    <el-form ref="defaultForm" :model="defaultForm" :inline="true">
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
      <el-form-item label="培训专业：" prop="trainingName">
        <el-select v-model="defaultForm.trainingName" placeholder="选择培训专业" clearable>
          <el-option
            v-for="item in trainingBaseNameEnum"
            :key="item.value"
            :value="item.value"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="姓名：">
        <el-input v-model="defaultForm.physicianId" clearable />
      </el-form-item>
      <el-form-item label="人员类型：" prop="residentType">
        <el-select v-model="defaultForm.residentType" placeholder="选择人员类型" clearable>
          <el-option
            v-for="item in residentTypeEnum"
            :key="item.value"
            :value="item.value"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="应届/往届：" prop="department">
        <el-select v-model="defaultForm.yy" placeholder="选择应届/往届" clearable>
          <el-option
            v-for="item in yyEnum"
            :key="item.value"
            :value="item.value"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="医师资格考试：" prop="qualification">
        <el-select v-model="defaultForm.qualification" placeholder="是否获得医师资格证书" clearable>
          <el-option
            v-for="item in qualificationEnum"
            :key="item.value"
            :value="item.value"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学位类型：" prop="academicDegree">
        <el-select v-model="defaultForm.academicDegree" placeholder="选择学位" clearable>
          <el-option
            v-for="item in academicDegreeEnum"
            :key="item.value"
            :value="item.value"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学历" prop="education">
        <el-select v-model="defaultForm.education" placeholder="选择学历类型" clearable>
          <el-option
            v-for="item in educationEnum"
            :key="item.value"
            :value="item.value"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="核定培训年限(月数)：" prop="teachingSubject">
        <el-input v-model="defaultForm.physicianId" clearable />
      </el-form-item>
      <el-form-item label="审核状态：" prop="gendar">
        <el-select v-model="defaultForm.gender" clearable>
          <el-option
            v-for="item in residentState"
            :key="item.key"
            :value="item.value"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="培训状态：" prop="residentState">
        <el-select v-model="defaultForm.residentState" placeholder="选择最高学历" clearable>
          <el-option
            v-for="item in residentStateEnum"
            :key="item.value"
            :value="item.value"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="link-left" @click="searchClick">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="link-left" @click="uploadXML">导入</el-button>
      </el-form-item>
    </el-form>

    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="loading"
      :data="residentList"
      size="small"
      style="width: 100%;"
    >
      <el-table-column prop="id" label="ID" width="50px" />
      <el-table-column prop="residentId" label="学号" width="100px" />
      <el-table-column prop="residentState" label="培训状态" width="100px" />
      <el-table-column prop="name" label="姓名" width="60px" />
      <el-table-column prop="gender" label="性别" width="50px" />
      <el-table-column prop="nation" label="名族" width="50px" />
      <el-table-column prop="birthDate" label="出生日期" width="120px" />
      <el-table-column prop="idNumber" label="身份证号码" width="150px" />
      <el-table-column prop="phone" label="手机号码" width="120px" />
      <el-table-column prop="education" label="学历" width="80px" />
      <el-table-column prop="academicDegree" label="学位" width="80px" />
      <el-table-column prop="residentType" label="人员类型" width="120px" />
      <el-table-column prop="recruitmentYear" label="招收年份" width="50px" />
      <el-table-column prop="trainingName" label="培训专业" width="80px" />
      <el-table-column prop="trainingBeginTime" label="培训开始" width="100px" />
      <el-table-column prop="trainingEndTime" label="培训结束" width="100px" />
      <el-table-column prop="qualification" label="是否获得医师资格证书" />
      <el-table-column prop="qualificationTime" label="获得医师资格证书时间" />
      <el-table-column prop="qualificationNumber" label="医师资格证书编码" />
      <el-table-column prop="applyPostgraduate" label="是否报考同等学力研究生" />
      <el-table-column prop="graduateTutor" label="研究生导师" />
      <el-table-column
        v-permission="['admin','physicianInformation:edit','physicianInformation:del']"
        label="操作"
        width="150px"
        align="center"
      />
    </el-table>
    <!--分页组件-->
    <el-pagination
      :current-page="defaultForm.page"
      :page-sizes="[15,30]"
      :page-size="defaultForm.size"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog :visible.sync="dialogVisible" title="导入住院医师信息" width="570px">
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
import { getToken } from '@/utils/auth'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'ResidentInformation',
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
        size: 15
      },
      residentList: [],
      total: 0,
      headers: {
        Authorization: getToken()
      },
      loading: false,
      dialogVisible: false,
      uploadUrl: process.env.VUE_APP_BASE_API + '/api/resident/import-resident'
    }
  },
  created() {
    // this.search();
    this.init()
  },
  methods: {
    search() {
      this.listLoading = true
      getAllResident(this.defaultForm).then(response => {
        this.residentList = response.content
        this.total = response.totalElements
        this.listLoading = false
      })
    },
    searchClick() {
      this.defaultForm.page = 0
      this.search()
    },
    init() {},
    uploadXML() {
      this.dialogVisible = true
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

<style scoped>
</style>
