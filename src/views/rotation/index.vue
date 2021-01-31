<template>
  <div class="app-container">
    <!--工具栏-->
    <el-form ref="defaultForm" :model="defaultForm" :inline="true">
      <el-form-item>
        <el-button type="primary" class="link-left" @click="uploadXML">导入</el-button>
      </el-form-item>
    </el-form>

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
      uploadUrl: process.env.VUE_APP_BASE_API + '/api/rotation-record/import-record'
    }
  },
  created() {
    // this.search();
    this.init()
  },
  methods: {
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
  }
}
</script>

<style scoped>
</style>
