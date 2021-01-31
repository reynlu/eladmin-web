<template>
  <van-form @submit="onSubmit">
    <van-field
      v-model="defaultForm.diagnosisCardId"
      type="number"
      name="病人ID号"
      label="病人ID号"
      placeholder="病人ID号"
      :rules="[{ required: true, message: '请输入正确的ID号' }]"
    />
    <van-field
      v-model="defaultForm.comment"
      type="text"
      name="病人备注"
      label="病人备注"
      placeholder="病人备注"
    />
    <div style="margin: 16px;">
      <van-button round block type="info" native-type="submit">提交</van-button>
    </div>
  </van-form>
</template>

<script>
import store from '@/store'
import { addDiagnosisRecords } from '@/api/mobile/diagnosis'

export default {
  data() {
    return {
      defaultForm: {
        id: -1,
        residentId: '',
        residentName: '',
        trainingDepartmentId: '',
        diagnosisCardId: '',
        state: -1,
        comment: '',
        createAt: 0,
        updateAt: 0
      },
      pattern: /\d{7}/
    }
  },

  methods: {
    onSubmit() {
      this.defaultForm.residentId = store.getters.user.username
      this.defaultForm.residentName = store.getters.user.nickName
      this.defaultForm.state = 1
      this.defaultForm.createAt = new Date().getTime()
      this.defaultForm.updateAt = new Date().getTime()
      addDiagnosisRecords(this.defaultForm)
    }
  }
}
</script>
