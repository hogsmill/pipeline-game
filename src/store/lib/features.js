
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

// =======================================================

const { v4: uuidv4 } = require('uuid')

const listFuns = require('./lists.js')

const config = {
  noOfFeatures: 10,
  statuses: ['To Develop', 'Bug Fixing', 'In Test', 'Delivered'],
  efforts: [10, 20, 30],
  maxNoOfBugs: 3,
  bugEffort: 10,
  bugValues: {
    'critical': 50,
    'major': 25,
    'minor': 5,
    'cosmetic': 1
  },
  customerValues: [0, 20, 50, 100]
}

function generateName(n) {
  return 'Feature ' + parseInt(n + 1)
}

function generateDescription(n) {
  return 'Feature ' + parseInt(n + 1) + ' description'
}

function generateBugs() {
  const bugs = []
  const noOfBugs = parseInt(Math.random() * config.maxNoOfBugs)
  for (let i = 0; i < noOfBugs; i++) {
    const bug = {
      severity: listFuns.selectRandomElement(Object.keys(config.bugValues))
    }
    bugs.push(bug)
  }
  return bugs
}

function generateCustomer() {
  return listFuns.selectRandomElement(config.customerValues)
}

function generateFeature(config, n) {
  return {
    id: uuidv4(),
    name: generateName(n),
    description: generateDescription(n),
    effort: listFuns.selectRandomElement(config.efforts),
    bugs: generateBugs(),
    status: statuses[0],
    customer: generateCustomer()
  }
}

function generate(config) {

  // Include:
  // - feature overides anohter  feature
  // - feature fixes a bug
  // - effort
  // - customer value
  // ...so we select (say 3) features to develop based on effort
  //
  const features = []
  for (let i = 0; i < config.noOfFeatures; i++) {
    features.push(generateFeature(config, i))
  }
  return features
}

module.exports = {

  features: function() {
    return generate(config)
  },

  bugValues: function() {
    return bugValues
  },

  fixBugs: function(feature) {
    const bugs = []
    for (let i = 0; i < feature.bugs.length; i++) {
      const bug = feature.bugs[i]
      if (!bug.fixed) {
        if (Math.random() > 0.5) {
          bug.fixed = true
        }
      }
      bugs.push(bug)
    }
    feature.bugs = bugs
    return feature
  },

  deliver: function(feature) {
    const bugs = []
    for (let i = 0; i < feature.bugs.length; i++) {
      const bug = feature.bugs[i]
      if (!bug.fixed) {
        if (Math.random() > 0.5) {
          bug.seen = true
        }
      }
      bugs.push(bug)
    }
    feature.bugs = bugs
    return feature
  }

}
