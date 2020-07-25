<template>
  <el-row v-loading="loading">
    <el-col :span="24">
      <div style="text-align: left;">
        <el-button type="text" icon="el-icon-back" style="padding-bottom: 0px;" @click="goBack">返回</el-button>
      </div>
    </el-col>
    <el-col :span="24">
      <div>
        <div>
          <h3 style="margin-top: 0px;margin-bottom: 0px">{{ article.title }}</h3>
        </div>
        <div
          style="width: 100%;margin-top: 5px;display: flex;justify-content: flex-end;align-items: center"
        >
          <div
            style="display: inline; color: #20a0ff;margin-left: 50px;margin-right:20px;font-size: 12px;"
          >{{ article.nickname }}</div>
          <span
            style="color: #20a0ff;margin-right:20px;font-size: 12px;"
          >浏览 {{ article.pageView==null?0:article.pageView }}</span>
          <span
            style="color: #20a0ff;margin-right:20px;font-size: 12px;"
          >{{ article.editTime | formatDateTime }}</span>
          <el-tag
            v-for="(item,index) in article.tags"
            :key="index"
            type="success"
            size="small"
            style="margin-left: 8px"
          >{{ item.tagName }}</el-tag>
          <span style="margin:0px 50px 0px 0px" />
        </div>
      </div>
    </el-col>
    <el-col>
      <div style="text-align: left" v-html="article.htmlContent" />
    </el-col>
  </el-row>
</template>
<script>
import articleApi from '@/api/article/article'
export default {
  data() {
    return {
      article: {},
      loading: false,
      activeName: ''
    }
  },
  mounted: function() {
    var aid = this.$route.query.aid
    this.activeName = this.$route.query.an
    var _this = this
    this.loading = true
    articleApi.getArticleById(aid).then(resp => {
      _this.loading = false
      _this.article = resp
    })
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
