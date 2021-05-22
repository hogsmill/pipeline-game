const { v4: uuidv4 } = require('uuid')

const config = require('./config.js').config
const listFuns = require('./lists.js')

const generateName = (n) => {
  return 'Feature ' + parseInt(n + 1)
}

const generateDescription = (n) => {
  return 'Feature ' + parseInt(n + 1) + ' description'
}

const generateBugs = () => {
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

const generateCustomer = () => {
  return listFuns.selectRandomElement(config.customer.customerValues)
}

const generateFeature = (n) => {
  return {
    id: uuidv4(),
    number: n + 1,
    name: generateName(n),
    description: generateDescription(n),
    effort: listFuns.selectRandomElement(config.features.efforts),
    effortDone: 0,
    bugEffort: 0,
    bugEffortDone: 0,
    bugs: generateBugs(),
    status: config.features.statuses[0],
    selectedBy: [],
    customer: generateCustomer()
  }
}

const position = (fs) => {

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
  features = features.sort((a, b) => {
    return parseInt(a.number) - parseInt(b.number)
  })

  return features
}

const generate = () => {

  // To include in future:
  // - feature overides another feature
  // - feature fixes a bug
  // - customer can see bug in any sprint until fixed
  // ...so we select (say 3) features to develop based on effort
  //
  let features = []
  for (let i = 0; i < config.features.noOfFeatures; i++) {
    features.push(generateFeature(i))
  }
  features = position(features)
  return features
}

const bugValue = (bug) => {
  return config.bugs.bugValues[bug.severity]
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
        effort = effort + config.bugs.bugEffort
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
        if (Math.random() > config.bugs.bugFixRate) {
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
  },

  select: function(fs, featureId, member, selected) {
    const features = []
    for (let i = 0; i < fs.length; i++) {
      const feature = fs[i]
      const selectedBy = []
      for (let j = 0; j < feature.selectedBy.length; j++) {
        const selBy = feature.selectedBy[j]
        if (selBy.id != member.id) {
          selectedBy.push(selBy)
        }
      }
      if (fs[i].id == featureId && selected) {
        selectedBy.push(member)
      }
      feature.selectedBy = selectedBy
      features.push(feature)
    }
    return features
  },

  nextSprint: function(fs) {
    const features = []
    for (let i = 0; i < fs.length; i++) {
      const feature = fs[i]
      if (feature.status == 'To Develop') {
        feature.effortDone = feature.effortDone + feature.selectedBy.length * 10
      } else if (feature.status == 'Fixing Bugs') {
        feature.bugEffortDone = feature.bugEffortDone + feature.selectedBy.length * 10
      }
      feature.selectedBy = []
      features.push(feature)
    }
    return features
  },

  featuresScore: function(fs) {
    let score = 0
    for (let i = 0; i < fs.length; i++) {
      if (fs[i].status == 'Delivered') {
        score = score + fs[i].customer
      }
    }
    return score
  },

  featuresCount: function(fs) {
    let count = 0
    for (let i = 0; i < fs.length; i++) {
      if (fs[i].status == 'Delivered' && fs[i].customer) {
        count = count + 1
      }
    }
    return count
  },

  bugsScore: function(fs) {
    let score = 0
    for (let i = 0; i < fs.length; i++) {
      const bugs = fs[i].bugs
      for (let j = 0; j < bugs.length; j++) {
        if (fs.customer && !bugs[j].fixed && bugs[j].seen) {
          score = score + bugValue(bugs[j])
        }
      }
    }
    return score
  },

  bugsNotSeenScore: function(fs) {
    let score = 0, i, j
    for (i = 0; i < fs.length; i++) {
      if (fs.status == 'Delivered') {
        const bugs = fs[i].bugs
        for (j = 0; j < bugs.length; j++) {
          if (!bugs[j].fixed && !bugs[j].seen) {
            score = score + bugValue(bugs[j])
          }
        }
      }
    }
    return score
  }

}
