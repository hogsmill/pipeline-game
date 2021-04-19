
const bugValues = {
  'critical': 50,
  'major': 25,
  'minor': 5,
  'cosmetic': 1
}

const statuses = ['To Develop', 'In Test', 'Delivered']

const features = [
  {
    id: '111',
    name: 'feature one',
    description: 'Feature one description',
    bugs: [
      {name: 'bug 11', severity: 'major'},
      {name: 'bug 12', severity: 'minor'},
      {name: 'bug 13', severity: 'cosmetic'}
    ],
    customer: true,
    status: statuses[0]
  },
  {
    id: '222',
    name: 'feature two',
    description: 'Feature two description',
    bugs: [
      {name: 'bug 21', severity: 'critical'},
      {name: 'bug 22', severity: 'critical'},
      {name: 'bug 33', severity: 'minor'}
    ],
    customer: false,
    status: statuses[0]
  },
  {
    id: '333',
    name: 'feature three',
    description: 'Feature three description',
    bugs: [
      {name: 'bug 21', severity: 'critical'},
      {name: 'bug 22', severity: 'critical'},
      {name: 'bug 33', severity: 'minor'}
    ],
    customer: true,
    status: statuses[0]
  }
]

module.exports = {

  features: function() {
    return features
  },

  bugValues: function() {
    return bugValues
  },

  move: function(feature, direction) {
    const i = statuses.findIndex(function(s) {
      return s == feature.status
    })
    feature.status = direction == 'left' ? statuses[i - 1] : statuses[i + 1]
    return feature
  }

}
