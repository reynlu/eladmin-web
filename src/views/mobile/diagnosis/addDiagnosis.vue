<template>
  <div>
    <remote-js src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></remote-js>
    <van-form validate-trigger="onSubmit" @submit="onSubmit" @failed="onFailed">
      <van-field
        v-model="defaultForm.diagnosisCardId"
        type="text"
        name="手动输入ID号"
        label="手动输入ID号"
        placeholder="病人ID号"
        :rules="[{ validator, message: '请输入正确的ID号' }]"
      />

      <van-field
        v-model="scanCardID"
        name="扫描病人ID号"
        label="扫描病人ID号"
        readonly
        placeholder="病人ID号"/>

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
    <div style="margin: 16px;">
        <van-button :disabled="isScan" round block type="info" native-type="submit" @click="scan()">扫描</van-button>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import axios from 'axios'
import { Toast, Dialog } from 'vant'; 
import { addDiagnosisRecords } from '@/api/mobile/diagnosis'
import { getCurrentRotation } from '@/api/mobile/rotation'

export default {
  
  components: {
    'remote-js': {
      render(createElement) {
        return createElement('script', {
          attrs: {
            type: 'text/javascript',
            src: this.src
          }
        })
      },
      props: {
        src: {
          type: String,
          required: true
        }
      }
    }
  },

  data() {
    return {
      defaultForm: {
        id: -1,
        residentId: '',
        residentName: '',
        trainingDepartmentId: '',
        trainingTeacherName: '',
        diagnosisCardId: '',
        state: -1,
        comment: '',
        createAt: 0,
        updateAt: 0
      },
      scanCardID: null,
      rotationForm: {
        residentId: store.getters.user.username,
        recordYearMonth: null
      },
      isScan: false,
      rotation: null,
      pattern: '/\d{7}/',
      wxConfig: null
    }
  },
  created() {
    var timestamp = Date.now()
    const nowDate = new Date()
    const year = nowDate.getFullYear()
    const newmonth = nowDate.getMonth() > 10 ? nowDate.getMonth() : '0' + nowDate.getMonth()
    this.rotationForm.recordYearMonth = year + newmonth
    getCurrentRotation(this.rotationForm).then(response => {
      this.rotation = response
    })
  },

  mounted() {
    setTimeout(function() { 
      const reUrl = location.href.split('#')[0]
      axios.get(`https://axyz.run/wx-api/get-wx-config?appId=1000003&url=${reUrl}`).then(function(response) {
        const config = response.data
        config['beta'] = true
        config['jsApiList'] = ['scanQRCode']
        wx.config(config)
      }).catch(function (error) {
        console.log(error)
      })

      wx.ready(function(){
        this.isScan = false
      })

      wx.error(function(res){
        console.log(res)
      })
    }, 500)
  },
  methods: {
    validator(val) {
      console.log(val.length)
      if (val.length >= 7 && val.length <= 10) {
        return true
      } else {
        return false
      }
    },
    onFailed() {
      this.defaultForm.diagnosisCardId = ''
      Dialog.alert({
        message: '输入的门诊号不正确，请重新输入',
      }).then(() => {
        // on close
      });
    },
    onSubmit() {
      var _this = this
      this.defaultForm.residentId = store.getters.user.username
      this.defaultForm.residentName = store.getters.user.nickName
      this.defaultForm.trainingTeacherName = this.rotation.rotationPlanRecord.trainingTeacherName
      this.defaultForm.trainingDepartmentId = this.rotation.rotationPlanRecord.trainingDepartmentId
      this.defaultForm.state = 1
      this.defaultForm.createAt = new Date().getTime()
      this.defaultForm.updateAt = new Date().getTime()
      if (this.scanCardID.length === 7) {
        this.defaultForm.diagnosisCardId = this.scanCardID
      }
      addDiagnosisRecords(this.defaultForm).then(response => {
        _this.defaultForm.diagnosisCardId = ''
        _this.defaultForm.comment = ''
        _this.scanCardID = ''
        Dialog.alert({
              message: '录入成功，请继续后续操作',
            }).then(() => {
              // on close
            });
      })
    },
    scan() {
      var _this = this;
      wx.scanQRCode({
        desc: 'scanQRCode desc',
        needResult: 1, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是条形码（一维码），默认二者都有
        success: function(res) {
          if (res.resultStr.length === 7) {
            _this.scanCardID = '000' + res.resultStr
          } else {
            Dialog.alert({
              message: '请扫描七位长度的条形码',
            }).then(() => {
              // on close
            });
          }
        },
        error: function(res) {
          if (res.errMsg.indexOf('function_not_exist') > 0) {
              alert('版本过低请升级')
          }
        }
      })
    }
  }
}
</script>
