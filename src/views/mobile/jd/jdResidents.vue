<template>
    <div>
        <van-search v-model="value" placeholder="请输入搜索学员姓名" @search="searchClick"/>
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <div v-for="(item) in list" :key="item.id" class="list-cell-container">
                <h3 class="list-cell-header">学员姓名： {{ item.name }}</h3>
                <p><label class="list-cell-label">学员类型</label>  {{ item.residentType }} <label class="list-cell-label">学员状态</label>  {{ item.residentState }}</p>
                <p><label class="list-cell-label">开始培训时间</label>  {{ item.trainingBeginTime }}<label class="list-cell-label">培训结束时间</label>  {{ item.trainingEndTime }}</p>
                <p><label class="list-cell-label">学习时长</label>  {{ item.trainingCounts }} 月</p>
                <p><label class="list-cell-label">手机号码</label>  {{ item.phone }}</p>
                <p><label class="list-cell-label">学历</label>  {{ item.education }}</p>
                <p><label class="list-cell-label">所属基地</label>  {{ item.trainingName }}</p>
            </div>
        </van-list>
    </div>
</template>

<script>
import { getAllResident } from '@/api/physician/resident'
import { getPhysician } from '@/api/mobile/physician'
import { getToken } from '@/utils/auth'
import { mapGetters, mapState } from 'vuex'
import store from '@/store'

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
        blurry: null,
        page: 0,
        size: 15
      },
      list: [],
      total: 0,
      headers: {
        Authorization: getToken()
      },
      physician: null,
      value: null,
      loading: false,
      finished: true,
      dialogVisible: false,
      uploadUrl: process.env.VUE_APP_BASE_API + '/api/resident/import-resident'
    }
  },
  created() {
    this.init()
  },
  methods: {
    search() {
      this.loading = true
      getAllResident(this.defaultForm).then(response => {
        this.list = response.content
        this.total = response.totalElements
        this.loading = false
      })
    },
    searchClick(value) {
      this.defaultForm.page = 0
      this.defaultForm.blurry = value
      this.defaultForm.trainingName = this.physician.trainingBaseName
      this.search()
    },
    async init() {
        const p = await getPhysician({id: store.getters.user.uid})
        this.physician = p
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
<style lang="less">
.list {
  &-cell-container {
    width: 95%;
    height: 50vw;
    display: block;
    border-radius: 4px;
    box-shadow: #2b2a2a;
    margin-left: 12px;
    margin-right: 12px;
    font-size: 12px;
    background: #cfe1f4
  }
  &-cell-header {
    padding-top: 12px;
    padding-bottom: 12px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    color: #ffffff;
    padding: 12px;
    font-size: 10px;
    background: #1989fa
  }
  &-cell-label {
    padding: 2px 0;
    font-size: 10px;
    text-align: center;
    padding-left: 12px;
    color: rgb(63, 57, 57);
  }
  &-cell-value {
    padding: px 0;
    font-size: 10px;
    text-align: center;
    color: rgb(2, 2, 2);
  }
}
</style>
