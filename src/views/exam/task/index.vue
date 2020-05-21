<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="700px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="150px">
          <el-form-item label="考试任务名称" required>
            <el-input v-model="form.title" style="width: 470px;" />
          </el-form-item>
          <el-form-item label="状态 （0正常 1关闭)">
            <el-input v-model="form.state" style="width: 470px;" />
          </el-form-item>
          <el-form-item label="创建者">
            <el-input v-model="form.createUserName" style="width: 470px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="序号" />
        <el-table-column prop="title" label="考试任务名称" />
        <el-table-column prop="state" label="状态 （0正常 1关闭)" />
        <el-table-column prop="frameTextContentId" label="任务框架 内容为JSON" />
        <el-table-column prop="createUser" label="创建者" />
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deleted" label="是否已删除" />
        <el-table-column prop="createUserName" label="创建者姓名" />
        <el-table-column v-permission="['admin','hisTaskExam:edit','hisTaskExam:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudHisTaskExam from '@/api/exam/task'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, title: null, state: null, frameTextContentId: null, createUser: null, createTime: null, deleted: null, createUserName: null }
export default {
  name: 'HisTaskExam',
  components: { pagination, crudOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '考试任务管理', url: 'api/exam/task/get-all-task', sort: 'id,desc', crudMethod: { ...crudHisTaskExam }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'hisTaskExam:add'],
        edit: ['admin', 'hisTaskExam:edit'],
        del: ['admin', 'hisTaskExam:del']
      },
      rules: {
        title: [
          { required: true, message: '请填写考试任务名称', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请填写考试任务状态（0正常 1关闭）', trigger: 'blur' }
        ],
        createUserName: [
          { required: true, message: '请填写考试任任务创建者', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    // 提交前的验证
    [CRUD.HOOK.afterValidateCU]() {
      if (!this.form.title) {
        this.$message({
          message: '考试任务名称不能为空',
          type: 'warning'
        })
        return false
      } else if (!this.form.state) {
        this.$message({
          message: '考试状态不能为空',
          type: 'warning'
        })
        return false
      } else if (!this.form.createUserName) {
        this.$message({
          message: '考试创建者不能为空',
          type: 'warning'
        })
        return false
      }
      return true
    }
  }
}
</script>

<style scoped>

</style>
