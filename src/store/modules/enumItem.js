// initial state
const state = {
  user: {
    genderEnum: [{
      key: 1,
      value: '男'
    }, {
      key: 2,
      value: '女'
    }],
    statusEnum: [{
      key: 1,
      value: '启用'
    }, {
      key: 2,
      value: '禁用'
    }],
    stationEnum: [{
      key: 11,
      value: '第一考站'
    }, {
      key: 21,
      value: '第二考站（学生）'
    }, {
      key: 22,
      value: '第二考站（老师）'
    }, {
      key: 34,
      value: '第三四考站'
    }],
    majorEnum: [{
      key: 'KW',
      value: '口腔颌面外科'
    }, {
      key: 'KN',
      value: '口腔内科'
    }, {
      key: 'KQ',
      value: '口腔全科'
    }, {
      key: 'XF',
      value: '口腔修复科'
    }, {
      key: 'ZJ',
      value: '口腔正畸科'
    }],
    roleEnum: [{
      key: 1,
      value: '学生'
    }, {
      key: 2,
      value: '教师'
    }, {
      key: 3,
      value: '管理员'
    }],
    periodEnum: [{
      key: 1,
      value: '全天'
    }, {
      key: 2,
      value: '上午'
    }, {
      key: 3,
      value: '下午'
    }],
    statusTag: [{
      key: 1,
      value: 'success'
    }, {
      key: 2,
      value: 'danger'
    }],
    statusBtn: [{
      key: 1,
      value: '禁用'
    }, {
      key: 2,
      value: '启用'
    }],
    examinerAajorEnum: [{
      key: 'YT',
      value: '牙体牙髓病科'
    }, {
      key: 'YZ',
      value: '牙周病科'
    }, {
      key: 'KQ',
      value: '口腔全科'
    }, {
      key: 'XF',
      value: '口腔修复科'
    }, {
      key: 'KW',
      value: '口腔颌面外科'
    }, {
      key: 'EY',
      value: '儿童口腔科'
    }, {
      key: 'ZJ',
      value: '口腔正畸科'
    }]
  },
  exam: {
    examPaper: {
      paperTypeEnum: [{
        key: 1,
        value: '固定试卷'
      }, {
        key: 4,
        value: '时段试卷'
      }, {
        key: 6,
        value: '任务试卷'
      }]
    },
    question: {
      typeEnum: [{
        key: 1,
        value: '单选题'
      }, {
        key: 2,
        value: '多选题'
      }, {
        key: 3,
        value: '打分题'
      }, {
        key: 4,
        value: '操作题'
      }],
      editUrlEnum: [{
        key: 1,
        value: '/exam/question/edit/single',
        name: '单选题'
      }, {
        key: 2,
        value: '/exam/question/edit/multiple',
        name: '多选题'
      },
      {
        key: 3,
        value: '/exam/question/edit/score',
        name: '打分题'
      },
      {
        key: 4,
        value: '/exam/question/edit/operation',
        name: '操作题'
      }
      ]
    }
  },
  physician: {
    gender: [{
      key: 1,
      value: '男'
    }, {
      key: 2,
      value: '女'
    }],
    tutor: [{
      key: 1,
      value: '博导'
    },
    {
      key: 2,
      value: '硕导'
    }
    ],
    professionalTitle: [{
      key: 1,
      value: '正高级'
    },
    {
      key: 2,
      value: '副高级'
    },
    {
      key: 3,
      value: '中级'
    },
    {
      key: 4,
      value: '初级'
    }
    ],
    education: [{
      key: 1,
      value: '博士研究生'
    },
    {
      key: 1,
      value: '硕士研究生'
    },
    {
      key: 1,
      value: '本科'
    }
    ]
  }
}

// getters
const getters = {
  enumFormat: (state) => (arrary, key) => {
    return format(arrary, key)
  }
}

// actions
const actions = {}

// mutations
const mutations = {}

const format = function(array, key) {
  for (const item of array) {
    if (item.key === key) {
      return item.value
    }
  }
  return null
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
