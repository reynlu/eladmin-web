<template>
  <el-container class="article_list">
    <el-main class="main">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="全部文章" name="all">
          <blog_table
            state="-1"
            :show-edit="false"
            :show-delete="false"
            :show-restore="false"
            :active-name="activeName"
          />
        </el-tab-pane>
        <el-tab-pane label="已发表" name="post">
          <blog_table
            state="1"
            :show-edit="true"
            :show-delete="true"
            :show-restore="false"
            :active-name="activeName"
          />
        </el-tab-pane>
        <el-tab-pane label="草稿箱" name="draft">
          <blog_table
            state="0"
            :show-edit="true"
            :show-delete="true"
            :show-restore="false"
            :active-name="activeName"
          />
        </el-tab-pane>
        <el-tab-pane label="回收站" name="dustbin">
          <blog_table
            state="2"
            :show-edit="false"
            :show-delete="true"
            :show-restore="true"
            :active-name="activeName"
          />
        </el-tab-pane>
        <el-tab-pane v-if="isAdmin" label="博客管理" name="blogmana">
          <blog_table
            state="-2"
            :show-edit="false"
            :show-delete="true"
            :show-restore="false"
            :active-name="activeName"
          />
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script>
import ArticleTable from '@/components/ArticleTable'

export default {
  components: {
    blog_table: ArticleTable
  },
  data() {
    return {
      activeName: 'post',
      isAdmin: false
    }
  },
  mounted: function() {
    // getRequest("/isAdmin").then(resp => {
    //   if (resp.status == 200) {
    //     _this.isAdmin = resp.data;
    //   }
    // });
  },
  methods: {
    handleClick(tab, event) {
      //        console.log(tab, event);
    }
  }
}
</script>
<style>
.article_list > .header {
  background-color: #ececec;
  margin-top: 10px;
  padding-left: 5px;
  display: flex;
  justify-content: flex-start;
}

.article_list > .main {
  /*justify-content: flex-start;*/
  display: flex;
  flex-direction: column;
  padding-left: 0px;
  background-color: #fff;
  padding-top: 0px;
  margin-top: 8px;
}
</style>
