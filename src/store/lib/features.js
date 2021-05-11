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
    number: n + 1,
    name: generateName(n),
    description: generateDescription(n),
    effort: listFuns.selectRandomElement(config.features.efforts),
    bugEffort: 0,
    bugs: generateBugs(),
    status: config.features.statuses[0],
    selectedBy: [],
    customer: generateCustomer()
  }
}

function position(fs) {

  const notWanted = {}, n = config.features.noOfFeatures - config.features.noOfCustomerFeatures
  while (Object.keys(notWanted).length < n) {
    notWanted[parseInt(Math.random() * fs.length)] = true
  }

  const fs1 = []
  for (let i = 0; i < fs.length; i++) {
    const f = fs[i]
    if (notWanted[i]) {
      f.customer = 0
    }
    fs1.push(f)
  }

  let features = []
  let row = 0, column = 0  // 4 x 4 grid
  while (fs1.length) {
    const n = parseInt(Math.random() * fs1.length)
    const feature = fs1.splice(n, 1)[0]
    if (feature.customer) {
      feature.row = row
      feature.column = column
      column = column + 1
      if (column > 3) {
        column = 0
        row = row + 1
      }
    }
    features.push(feature)
  }
  features = features.sort(function(a, b) {
    return parseInt(a.number) - parseInt(b.number)
  })

  return features
}

function generate() {

  // Include:
  // - feature overides anohter  feature
  // - feature fixes a bug
  // - effort
  // - customer value
  // ...so we select (say 3) features to develop based on effort
  //
  let features = []
  for (let i = 0; i < config.features.noOfFeatures; i++) {
    features.push(generateFeature(i))
  }
  features = position(features)
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
      bugs.push(bug)
    }
    return bugs
  }

}
