<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="500px"
      >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="简介" prop="summary">
            <el-input
              v-model="form.summary"
              style="width: 370px;"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入简介"
            />
          </el-form-item>
          <el-form-item label="视频链接" prop="url">
            <el-input v-model="form.url" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="封面图片" prop="url">
            <el-input v-model="form.pic" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        size="small"
        style="width: 100%;"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" />
        <el-table-column prop="title" label="title" />
        <el-table-column prop="summary" label="summary" />
        <el-table-column prop="url" label="url" />
        <el-table-column prop="eid" label="eid" />
        <el-table-column prop="uid" label="uid" />
        <el-table-column prop="createDate" label="createDate">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="updateTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="0表示草稿箱，1表示已发表，2表示已删除" />
        <el-table-column
          v-permission="['admin','ebagResource:edit','ebagResource:del']"
          label="操作"
          width="150px"
          align="center"
        >
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission" />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudEbagResource from '@/api/article/ebag'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { title: null, summary: null, url: null, pic: null }
export default {
  name: 'EbagResource',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '电子书包',
      url: 'api/ebag/get-ebag-list',
      sort: 'id,desc',
      crudMethod: { ...crudEbagResource }
    })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'ebagResource:add'],
        edit: ['admin', 'ebagResource:edit'],
        del: ['admin', 'ebagResource:del']
      },
      rules: {
        title: [{ required: true, message: '不能为空', trigger: 'blur' }],
        summary: [{ required: true, message: '不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '不能为空', trigger: 'blur' }],
        pic: [{ required: true, message: '不能为空', trigger: 'blur' }]
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
