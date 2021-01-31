<template>
  <div>
    <van-field
      v-model="fieldValue"
      is-link
      readonly
      label="地区"
      placeholder="请选择所在地区"
      @click="show = true"
    />
    <van-popup v-model="show" round position="bottom">
      <van-cascader
        v-model="beforeValue"
        title="请选择所在地区"
        :options="options"
        @close="show = false"
        @finish="onFinish"
      />
    </van-popup>
  </div>
</template>
<script>
import 'vant/lib/index.css'
import store from '@/store'
import { getRotationRecords } from '@/api/mobile/rotation'
export default {
  data() {
    return {
      defaultForm: {
        residentId: store.getters.user.uid
      },
      show: false,
      fieldValue: null,
      beforeValue: null,
      afterValue: null,
      options: [],
      list: null,
      total: 0,
      loading: false,
      finished: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getRotationRecords(this.defaultForm).then(response => {
        this.list = response.content
        this.total = response.totalElements
        this.loading = false
        this.finished = true
        this.initOptions()
      })
    },
    initOptions() {
      alert(this.list.length)
      for (var i = 0; i < this.list.length; i++) {
        var item = {
          text: this.list[i].id,
          value: this.list[i].id
        }
        this.options.push(item)
      }
    },
    onFinish({ selectedOptions }) {
      this.show = false
      this.fieldValue = selectedOptions.map((option) => option.text).join('/')
    }
  }
}
</script>
<style lang="less">
.list {
  &-cell-container {
    width: 90%;
    height: 53vw;
    display: block;
    border-radius: 4px;
    box-shadow: #2b2a2a;
    margin-left: 12px;
    margin-right: 12px;
    background: #f5e4d6;
  }
  &-cell-header {
    padding-top: 12px;
    padding-bottom: 12px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    color: #ffffff;
    padding: 12px;
    background: #ff7700;
  }
  &-cell-label {
    padding: 15px 0;
    font-size: 18px;
    text-align: center;
    padding-left: 12px;
    color: rgb(63, 57, 57);
  }
  &-cell-value {
    padding: 15px 0;
    font-size: 16px;
    text-align: center;
    color: rgb(2, 2, 2);
  }
}
</style>
