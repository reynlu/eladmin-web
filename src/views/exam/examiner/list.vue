<template>
  <div class="app-container">
    <el-form ref="formDada" :model="formDada" :inline="true">
      <el-form-item label="姓名：">
        <el-input v-model="formDada.examiner_name" clearable />
      </el-form-item>
      <el-form-item label="学科：">
        <el-select v-model="formDada.major_id" placeholder="选择学科项目" clearable>
          <el-option
            v-for="item in examinerAajorEnum"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">查询</el-button>
        <router-link :to="{path:'/exam-user/examiner/edit'}" class="link-left">
          <el-button size="primary">添加</el-button>
        </router-link>
      </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="examinerName" label="姓名" width="80" />
      <el-table-column prop="gender" label="性别" width="50" :formatter="genderFormatter" />
      <el-table-column prop="nation" label="民族" width="80" />
      <el-table-column prop="idNumber" label="身份证号" width="180" />
      <el-table-column prop="major" label="专业" width="120" :formatter="majorFormatter" />
      <el-table-column fixed="right" label="操作" width="160">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getExaminerList } from '@/api/exam/examiner'
import { mapGetters, mapState } from 'vuex'

export default {
  data() {
    return {
      formDada: {
        examiner_name: null,
        major_id: null
      },
      listLoading: false,
      tableData: []
    }
  },
  created() {
    this.search()
  },
  methods: {
    search() {
      this.listLoading = true
      getExaminerList(this.formDada).then(response => {
        this.tableData = response.data
        this.listLoading = false
      })
    },
    submitForm() {
      this.listLoading = true
      getExaminerList(this.formDada).then(response => {
        this.tableData = response.data
        this.listLoading = false
      })
    },
    genderFormatter(row, column, cellValue, index) {
      return this.enumFormat(this.genderEnum, cellValue)
    },
    majorFormatter(row, column, cellValue, index) {
      return this.enumFormat(this.examinerAajorEnum, cellValue)
    },
    add() {}
  },
  computed: {
    ...mapGetters('enumItem', ['enumFormat']),
    ...mapState('enumItem', {
      examinerAajorEnum: state => state.user.examinerAajorEnum,
      genderEnum: state => state.user.genderEnum
    })
  }
}
</script>
