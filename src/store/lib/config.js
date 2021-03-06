
module.exports = {

  config: {
    game: {
      sprints: 20,
      sprintLabel: 'Sprint'
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
      bugFixRate: 0.66,
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
    },
    member: {
      effortPerMember: 10
    }
  }
}
