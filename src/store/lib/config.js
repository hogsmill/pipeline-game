
module.exports = {

  config: {
    game: {
      sprints: 10,
      sprintLabel: 'Sprint'
    },
    features: {
      noOfFeatures: 10,
      efforts: [10, 20, 30],
      statuses: [
        'To Develop',
        'Bug Fixing',
        'In Test',
        'Delivered'
      ],
    },
    bugs: {
      maxNoOfBugs: 3,
      bugEffort: 10,
      bugValues: {
        'critical': 50,
        'major': 25,
        'minor': 5,
        'cosmetic': 1
      }
    },
    customer: {
      customerValues: [
        0,
        20,
        50,
        100
      ]
    }
  }
}
