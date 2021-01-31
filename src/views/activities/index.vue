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
          <el-form-item label="活动名称">
            <el-input v-model="form.teachingActivitiesName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="活动简介">
            <el-input v-model="form.teachingActivitiesSummary" style="width: 370px; height:50px" />
          </el-form-item>
          <el-form-item label="活动地点">
            <el-input v-model="form.teachingActivitiesPlace" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="参与人选">
            <el-input v-model="form.teachingActivitiesScope" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="活动封面">
            <el-input v-model="form.teachingActivitiesCover" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="form.beginTime"
              type="datetime"
              range-separator="至"
              placeholder="选择日期时间"
            />
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              placeholder="选择日期时间"
            />
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
        <el-table-column prop="id" label="序号" />
        <el-table-column prop="teachingActivitiesName" label="活动名称" />
        <el-table-column prop="teachingActivitiesQrCode" label="二维码">
          <template slot-scope="scope">
            <img :src="scope.row.image" alt="Red dot" min-width="70" height="70">
          </template>
        </el-table-column>
        <el-table-column prop="teachingActivitiesSummary" label="活动简介" />
        <el-table-column prop="teachingActivitiesPlace" label="活动地点" />
        <el-table-column prop="teachingActivitiesScope" label="参与人选" />
        <el-table-column prop="teachingActivitiesCover" label="活动封面" />
        <el-table-column prop="updateTime" label="活动时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="createTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-permission="['admin','teachingActivities:edit','teachingActivities:del']"
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
import crudTeachingActivities from '@/api/activities/activities'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultBeginEnd = null

const defaultForm = {
  id: null,
  teachingActivitiesName: null,
  teachingActivitiesQrCode: null,
  teachingActivitiesSummary: null,
  teachingActivitiesPlace: null,
  teachingActivitiesScope: null,
  teachingActivitiesCover: null,
  beginTime: null,
  endTime: null,
  updateTime: null,
  createTime: null
}
export default {
  name: 'TeachingActivities',
  components: { pagination, crudOperation, rrOperation, udOperation },
  cruds() {
    return CRUD({
      title: '教学活动',
      url: '/api/teaching-activities/get-teaching-list',
      sort: 'id,desc',
      crudMethod: { ...crudTeachingActivities }
    })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'teachingActivities:add'],
        edit: ['admin', 'teachingActivities:edit'],
        del: ['admin', 'teachingActivities:del']
      },
      rules: {},
      dateTime: null
    }
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
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
