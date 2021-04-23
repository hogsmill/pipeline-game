/*
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
*/
// =======================================================

const { v4: uuidv4 } = require('uuid')

const config = require('./config.js').config
const listFuns = require('./lists.js')

function generateName(n) {
  return 'Feature ' + parseInt(n + 1)
}

function generateDescription(n) {
  return 'Feature ' + parseInt(n + 1) + ' description'
}

function generateBugs() {
  const bugs = []
  const noOfBugs = parseInt(Math.random() * config.bugs.maxNoOfBugs)
  for (let i = 0; i < noOfBugs; i++) {
    const bug = {
      severity: listFuns.selectRandomElement(Object.keys(config.bugs.bugValues))
    }
    bugs.push(bug)
  }
  return bugs
}

function generateCustomer() {
  return listFuns.selectRandomElement(config.customer.customerValues)
}

function generateFeature(n) {
  return {
    id: uuidv4(),
    name: generateName(n),
    description: generateDescription(n),
    effort: listFuns.selectRandomElement(config.features.efforts),
    bugEffort: 0,
    bugs: generateBugs(),
    status: config.features.statuses[0],
    customer: generateCustomer()
  }
}

function generate() {

  // Include:
  // - feature overides anohter  feature
  // - feature fixes a bug
  // - effort
  // - customer value
  // ...so we select (say 3) features to develop based on effort
  //
  const features = []
  for (let i = 0; i < config.features.noOfFeatures; i++) {
    features.push(generateFeature(i))
  }
  return features
}

module.exports = {

  features: function() {
    return generate()
  },

  bugValues: function() {
    return config.bugs.bugValues
  },

  bugEffort: function(bugs) {
    let effort = 0
    for (let i = 0; i < bugs.length; i++) {
      if (!bugs[i].fixed) {
        effort = effort + 10
      }
    }
    return effort
  },

  fixBugs: function(featureBugs) {
    const bugs = []
    let i = 0
    for (i = 0; i < featureBugs.length; i++) {
      const bug = featureBugs[i]
      if (!bug.fixed) {
        if (Math.random() > 0.5) {
          bug.fixed = true
        }
      }
      bugs.push(bug)
    }
    return bugs
  },

  deliver: function(featureBugs) {
    const bugs = []
    for (let i = 0; i < featureBugs.length; i++) {
      const bug = featureBugs[i]
      if (!bug.fixed) {
        if (Math.random() > 0.5) {
          bug.seen = true
        } else {
          bug.seen = false
        }
      }
      console.log(bug.seen)
      bugs.push(bug)
    }
    return bugs
  }

}
