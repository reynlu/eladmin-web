<template>
  <el-container>
    <el-header>
      <el-input v-model="categoryName" placeholder="请输入栏目名称" style="width: 200px;" />
      <el-button type="primary" size="medium" style="margin-left: 10px" @click="addNewCate">新增栏目</el-button>
    </el-header>
    <el-main>
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="categories"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="left" />
        <el-table-column label="编号" prop="id" width="120" align="left" />
        <el-table-column label="栏目名称" prop="categoryName" width="120" align="left" />
        <el-table-column prop="date" label="启用时间" align="left">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.date) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        v-if="this.categories.length>0"
        type="danger"
        :disabled="this.selItems.length===0"
        style="margin-top: 10px;width: 100px;"
        @click="deleteAll"
      >批量删除</el-button>
    </el-main>
  </el-container>
</template>
<script>
import articleApi from '@/api/article/article'
import { parseTime } from '@/utils/index'
export default {
  data() {
    return {
      params: {
        page: 1,
        size: 20
      },
      categoryName: '',
      selItems: [],
      categories: [],
      loading: false
    }
  },
  mounted: function() {
    this.loading = true
    this.refresh()
  },
  methods: {
    parseTime,
    addNewCate() {
      var _this = this
      if (!this.categoryName) {
        _this.$message({ type: 'warning', message: '请输入合法的分类' })
        return
      }
      this.loading = true
      articleApi.addCategory({ categoryName: this.categoryName }).then(
        resp => {
          _this.$message({ type: 'success', message: '添加成功' })
          _this.categoryName = ''
          _this.refresh()
          _this.loading = false
        },
        resp => {
          if (resp.response.status === 403) {
            _this.$message({
              type: 'error',
              message: '添加失败'
            })
          }
          _this.loading = false
        }
      )
    },
    deleteAll() {
      var _this = this
      this.$confirm('确认删除这 ' + this.selItems.length + ' 条数据?', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          var selItems = _this.selItems
          var ids = []
          for (var i = 0; i < selItems.length; i++) {
            ids.push(selItems[i].id)
          }
          _this.deleteCate(ids)
        })
        .catch(() => {
          // 取消
          _this.loading = false
        })
    },
    handleSelectionChange(val) {
      this.selItems = val
    },
    handleEdit(index, row) {
      var _this = this
      this.$prompt('请输入新名称', '编辑', {
        confirmButtonText: '更新',
        inputValue: row.categoryName,
        cancelButtonText: '取消'
      }).then(({ value }) => {
        // value就是输入值
        if (value === null || value.length === 0) {
          _this.$message({
            type: 'info',
            message: '数据不能为空!'
          })
        } else {
          _this.loading = true
          const params = { id: row.id, categoryName: value }
          articleApi.updateCategory(params).then(
            resp => {
              _this.$message({
                type: 'success',
                message: '更新成功'
              })
              _this.refresh()
            },
            resp => {
              if (resp.response.status === 403) {
                _this.$message({
                  type: 'error',
                  message: resp.response.data
                })
              }
              _this.loading = false
            }
          )
        }
      })
    },
    handleDelete(index, row) {
      const _this = this
      this.$confirm('确认删除 ' + row.categoryName + ' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var ids = []
          ids.push(row.id)
          _this.deleteCate(ids)
        })
        .catch(() => {
          // 取消
          _this.loading = false
        })
    },
    deleteCate(ids) {
      const _this = this
      articleApi.deleteCategory(ids).then(
        resp => {
          _this.$message({
            type: 'success',
            message: '删除成功'
          })
          _this.refresh()
        },
        resp => {
          _this.loading = false
          if (resp.response.status === 403) {
            _this.$message({
              type: 'error',
              message: '删除失败'
            })
          } else if (resp.response.status === 500) {
            _this.$message({
              type: 'error',
              message: '该栏目下尚有文章，删除失败!'
            })
          }
        }
      )
    },
    refresh() {
      articleApi.getCategory(this.params).then(response => {
        console.log(response)
        this.categories = response.content
        this.loading = false
      })
    }
  }
}
</script>
