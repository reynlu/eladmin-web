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
          <el-form-item label="1.单选题  2.多选题  3.打分题  4.主观题" prop="type">
            <el-input v-model="form.type" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="默认99.全部 11第一考站 21 第二考站考生 22.第二考站考官 34.三四考站">
            <el-input v-model="form.station" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="题目总分(千分制)">
            <el-input v-model="form.score" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="题目难度">
            <el-input v-model="form.difficult" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="正确答案">
            <el-input v-model="form.correct" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="题目  填空、 题干、解析、答案等信息" prop="infoTextContentId">
            <el-input v-model="form.infoTextContentId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建人">
            <el-input v-model="form.createUser" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="1.正常">
            <el-input v-model="form.status" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="deleted">
            <el-input v-model="form.deleted" style="width: 370px;" />
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
        <el-table-column prop="type" label="1.单选题  2.多选题  3.打分题  4.主观题" />
        <el-table-column prop="station" label="默认99.全部 11第一考站 21 第二考站考生 22.第二考站考官 34.三四考站" />
        <el-table-column prop="score" label="题目总分(千分制)" />
        <el-table-column prop="difficult" label="题目难度" />
        <el-table-column prop="correct" label="正确答案" />
        <el-table-column prop="infoTextContentId" label="题目  填空、 题干、解析、答案等信息" />
        <el-table-column prop="createUser" label="创建人" />
        <el-table-column prop="status" label="1.正常" />
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deleted" label="deleted" />
        <el-table-column v-permission="['admin','hisQuestion:edit','hisQuestion:del']" label="操作" width="150px" align="center">
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
import crudHisQuestion from '@/api/exam/question'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, type: null, station: null, score: null, difficult: null, correct: null, infoTextContentId: null, createUser: null, status: null, createTime: null, deleted: null }
export default {
  name: 'HisQuestion',
  components: { pagination, crudOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'api/exam/question', url: 'api/hisQuestion', sort: 'id,desc', crudMethod: { ...crudHisQuestion }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'hisQuestion:add'],
        edit: ['admin', 'hisQuestion:edit'],
        del: ['admin', 'hisQuestion:del']
      },
      rules: {
        type: [
          { required: true, message: '1.单选题  2.多选题  3.打分题  4.主观题不能为空', trigger: 'blur' }
        ],
        infoTextContentId: [
          { required: true, message: '题目  填空、 题干、解析、答案等信息不能为空', trigger: 'blur' }
        ]
      }}
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
