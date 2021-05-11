
module.exports = {

  config: {
    game: {
      sprints: 10,
      sprintLabel: 'Sprint',
      maxEffort: 30
    },
    features: {
      noOfFeatures: 24,
      noOfCustomerFeatures: 16,
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
        10,
        20,
        50,
        100
      ]
    }
  }
}
