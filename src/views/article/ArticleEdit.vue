<template>
  <el-container v-loading="loading">
    <el-header class="header">
      <el-select v-model="article.cid" placeholder="请选择文章栏目" style="width: 150px;">
        <el-option
          v-for="item in categories"
          :key="item.id"
          :label="item.categoryName"
          :value="item.id"
        />
      </el-select>
      <el-input
        v-model="article.title"
        placeholder="请输入标题..."
        style="width: 400px;margin-left: 10px"
      />
      <el-tag
        v-for="tag in article.dynamicTags"
        :key="tag"
        closable
        :disable-transitions="false"
        style="margin-left: 10px"
        @close="handleClose(tag)"
      >{{ tag }}</el-tag>
      <el-input
        v-if="tagInputVisible"
        ref="saveTagInput"
        v-model="tagValue"
        class="input-new-tag"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      />
      <el-button v-else class="button-new-tag" type="primary" size="small" @click="showInput">+Tag</el-button>
    </el-header>
    <el-main class="main">
      <div id="editor">
        <mavon-editor
          ref="md"
          v-model="article.mdContent"
          style="height: 100%;width: 100%;"
          @imgAdd="imgAdd"
          @imgDel="imgDel"
        />
      </div>
      <div style="display: flex;align-items: center;margin-top: 15px;justify-content: flex-end">
        <el-button v-if="from!==undefined" @click="cancelEdit">放弃修改</el-button>
        <template v-if="from===undefined || from==='draft'">
          <el-button @click="saveBlog(0)">保存到草稿箱</el-button>
          <el-button type="primary" @click="saveBlog(1)">发表文章</el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="saveBlog(1)">保存修改</el-button>
        </template>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import articleApi from '@/api/article/article'
import { upload } from '@/utils/upload'
import { mavonEditor } from 'mavon-editor'
// 可以通过 mavonEditor.markdownIt 获取解析器markdown-it对象
import 'mavon-editor/dist/css/index.css'
//   import {isNotNullORBlank} from '../utils/utils'

export default {
  components: {
    mavonEditor
  },
  data() {
    return {
      categories: [],
      tagInputVisible: false,
      tagValue: '',
      loading: false,
      from: '',
      article: {
        id: '-1',
        dynamicTags: [],
        title: '',
        mdContent: '',
        cid: ''
      },
      uploadUrl: process.env.VUE_APP_BASE_API + '/api/qiNiuContent'
    }
  },
  mounted: function() {
    this.getCategories()
    var from = this.$route.query.from
    this.from = from
    var _this = this
    if (from !== null && from !== '' && from !== undefined) {
      var id = this.$route.query.id
      this.id = id
      this.loading = true
      articleApi.getArticleById(id).then(
        resp => {
          _this.loading = false
          _this.article = resp
        },
        resp => {
          _this.loading = false
          _this.$message({ type: 'error', message: '页面加载失败!' })
        }
      )
    }
  },
  methods: {
    cancelEdit() {
      this.$router.go(-1)
    },
    saveBlog(state) {
      if (!this.article.title || !this.article.mdContent || !this.article.cid) {
        this.$message({ type: 'error', message: '数据不能为空!' })
        return
      }
      var _this = this
      _this.loading = true
      articleApi
        .addArticle({
          id: _this.article.id,
          title: _this.article.title,
          mdContent: _this.article.mdContent,
          htmlContent: _this.$refs.md.d_render,
          cid: _this.article.cid,
          state: state,
          dynamicTags: _this.article.dynamicTags
        })
        .then(
          resp => {
            _this.loading = false
            _this.article.id = resp.id
            _this.$message({
              type: 'success',
              message: resp.state === 0 ? '保存成功!' : '发布成功!'
            })
            if (resp.state === 1) {
              _this.$router.replace({ path: '/article/list' })
            }
          },
          resp => {
            _this.loading = false
            _this.$message({
              type: 'error',
              message: state === 0 ? '保存草稿失败!' : '博客发布失败!'
            })
          }
        )
    },
    imgAdd(pos, $file) {
      var _this = this
      upload(this.uploadUrl, $file).then(resp => {
        var json = resp.data
        if (json.errno === 0) {
          _this.$refs.md.$imglst2Url([[pos, json.data[0]]])
        } else {
          _this.$message({ type: 'error', message: json.msg })
        }
      })
    },
    imgDel(pos) {},
    getCategories() {
      const _this = this
      articleApi.getCategory().then(resp => {
        _this.categories = resp.content
      })
    },
    handleClose(tag) {
      this.article.dynamicTags.splice(this.article.dynamicTags.indexOf(tag), 1)
    },
    showInput() {
      this.tagInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const tagValue = this.tagValue
      if (tagValue) {
        this.article.dynamicTags.push(tagValue)
      }
      this.tagInputVisible = false
      this.tagValue = ''
    }
  }
}
</script>
<style>
.post-article > .main > #editor {
  width: 100%;
  height: 450px;
  text-align: left;
}

.post-article > .header {
  background-color: #ececec;
  margin-top: 10px;
  padding-left: 5px;
  display: flex;
  justify-content: flex-start;
}

.post-article > .main {
  /*justify-content: flex-start;*/
  display: flex;
  flex-direction: column;
  padding-left: 5px;
  background-color: #ececec;
  padding-top: 0px;
}

.post-article > .header > .el-tag + .el-tag {
  margin-left: 10px;
}

.post-article > .header > .button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.post-article > .header > .input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
