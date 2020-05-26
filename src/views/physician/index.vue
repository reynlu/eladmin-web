<template>
  <div class="app-container">
    <!--工具栏-->
    <el-form ref="defaultForm" :model="defaultForm" :inline="true">
      <el-form-item label="师资ID：">
        <el-input v-model="defaultForm.physicianId" clearable />
      </el-form-item>
      <el-form-item label="所在科室：" prop="department">
        <el-select v-model="defaultForm.department" placeholder="选择所在科室" clearable>
          <el-option
            v-for="item in departments"
            :key="item.departmentName"
            :value="item.departmentName"
            :label="item.departmentName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="带教专业：" prop="teachingSubject">
        <el-select v-model="defaultForm.teachingSubjects" placeholder="选择带教专业" clearable>
          <el-option
            v-for="item in subjects"
            :key="item.teachingSubjectsName"
            :value="item.teachingSubjectsName"
            :label="item.teachingSubjectsName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="性别：" prop="gendar">
        <el-select v-model="defaultForm.gender" placeholder="选择性别" clearable>
          <el-option
            v-for="item in genderEnum"
            :key="item.key"
            :value="item.value"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="最高学历：" prop="education">
        <el-select v-model="defaultForm.education" placeholder="选择最高学历" clearable>
          <el-option
            v-for="item in educationEnum"
            :key="item.key"
            :value="item.value"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="职称：" prop="professionalTitle">
        <el-select v-model="defaultForm.professionalTitle" placeholder="选择考站项目" clearable>
          <el-option
            v-for="item in professionalTitleEnum"
            :key="item.key"
            :value="item.value"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="研究生导师：" prop="tutor">
        <el-select v-model="defaultForm.tutor" placeholder="选择研究生导师" clearable>
          <el-option
            v-for="item in tutorEnum"
            :key="item.key"
            :value="item.value"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="link-left" @click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="link-left" @click="uploadXML">导入</el-button>
      </el-form-item>
    </el-form>

    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="loading"
      :data="physicianList"
      size="small"
      style="width: 100%;"
    >
      <el-table-column prop="id" label="ID" width="50px" />
      <el-table-column prop="physicianId" label="师资ID" width="100px" />
      <el-table-column prop="name" label="姓名" width="60px" />
      <el-table-column prop="gender" label="性别" width="50px" />
      <el-table-column prop="department" label="所在科室" width="120px" />
      <el-table-column prop="teachingSubjects" label="带教专业" width="120px" />
      <el-table-column prop="tutor" label="研究生导师" width="50px" />
      <el-table-column prop="professionalTitle" label="职称" width="80px" />
      <el-table-column prop="trainingBasePosition" label="轮转基地职务" width="100px" />
      <el-table-column prop="departmentPosition" label="轮转科室职务" width="100px" />
      <el-table-column prop="idNumber" label="身份证号码" width="150px" />
      <el-table-column prop="phone" label="手机号码" width="120px" />
      <el-table-column prop="education" label="最高学历" width="80px" />
      <el-table-column prop="coordination" label="协同师资" />
      <el-table-column prop="teaching" label="是否需要带教" />
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
    <el-dialog :visible.sync="dialogVisible" title="导入师资信息" width="570px">
      <el-upload
        ref="upload"
        class="upload-demo"
        action="uploadUrl"
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
  </div>
</template>

<script>
import {
  getPhysicianInformations,
  getAllDepartment,
  getAllSubjects
} from '@/api/physician/physician'
import { getToken } from '@/utils/auth'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'PhysicianInformation',
  data() {
    return {
      defaultForm: {
        id: null,
        physicianId: null,
        name: null,
        gender: null,
        idNumber: null,
        phone: null,
        department: null,
        teachingSubjects: null,
        tutor: null,
        professionalTitle: null,
        trainingBasePosition: null,
        departmentPosition: null,
        education: null,
        coordination: null,
        teaching: null,
        page: 0,
        size: 15
      },
      physicianList: [],
      total: 0,
      headers: {
        Authorization: getToken()
      },
      loading: false,
      dialogVisible: false,
      departments: [],
      subjects: [],
      uploadUrl:
        process.env.VUE_APP_BASE_API + '/api/physician/import-physician'
    }
  },
  created() {
    // this.search();
    this.init()
  },
  methods: {
    search() {
      this.listLoading = true
      getPhysicianInformations(this.defaultForm).then(response => {
        this.physicianList = response.content
        this.total = response.totalElements
        this.listLoading = false
      })
    },
    init() {
      getAllSubjects().then(response => {
        this.subjects = response
      })
      getAllDepartment().then(response => {
        this.departments = response
      })
    },
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
      educationEnum: state => state.physician.education,
      professionalTitleEnum: state => state.physician.professionalTitle,
      tutorEnum: state => state.physician.tutor,
      genderEnum: state => state.physician.gender
    })
  }
}
</script>

<style scoped>
</style>
