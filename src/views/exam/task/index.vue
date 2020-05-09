<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="title">
            <el-input v-model="form.title" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态 0正常考试中 1考试关闭 等等">
            <el-input v-model="form.state" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="任务框架 内容为JSON">
            <el-input v-model="form.frameTextContentId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="createUser">
            <el-input v-model="form.createUser" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="createTime">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="deleted">
            <el-input v-model="form.deleted" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="createUserName">
            <el-input v-model="form.createUserName" style="width: 370px;" />
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
        <el-table-column prop="id" label="id" />
        <el-table-column prop="title" label="title" />
        <el-table-column prop="state" label="状态 0正常考试中 1考试关闭 等等" />
        <el-table-column prop="frameTextContentId" label="任务框架 内容为JSON" />
        <el-table-column prop="createUser" label="createUser" />
        <el-table-column prop="createTime" label="createTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deleted" label="deleted" />
        <el-table-column prop="createUserName" label="createUserName" />
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
      }
    }
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
