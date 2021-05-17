
const { v4: uuidv4 } = require('uuid')

const config = require('./lib/config.js').config

const featureFuns = require('./lib/features.js')
const memberFuns = require('./lib/members.js')

const setGame = (id, name, prot) => {
  const game = {
    id: id,
    name: name,
    protected: prot,
    sprints: config.game.sprints,
    bugValues: config.bugs.bugValues,
    sprints: config.game.sprints,
    sprintLabel: config.game.sprintLabel,
    maxEffort: config.game.maxEffort
  }
  return game
}

const setTeam = (teamData, reset) => {
  const team = teamData
  if (!team.features || reset) {
    team.features = featureFuns.features()
    team.delivered = [
      {
        noOfFeatures: 0,
        features: 0,
        bugs: 0,
        bugsNotSeen: 0
      }
    ]
    team.sprint = 1
    team.inTest = false,
    team.selected = 0
  }
  if (!team.gameId) {
    team.gameId = teamData.gameId
  }
  if (!team.id) {
    team.id = teamData.id
  }
  if (!team.name) {
    team.name = teamData.name
  }
  if (!team.protected) {
    team.protected = teamData.protected
  }
  if (!team.members) {
    team.members = []
  }
  return team
}

const loadGames = (db, io) => {
  db.gamesCollection.find().toArray((err, res) => {
    if (err) throw err
    io.emit('updateGames', res)
  })
}

const loadGame = (db, io, data) => {

  db.gamesCollection.findOne({id: data.id}, (err, gameRes) => {
    if (err) throw err
    io.emit('updateGame', gameRes)
  })
}

const loadTeam = (db, io, data) => {

  db.gameCollection.find({gameId: data.gameId}).toArray((err, res) => {
    if (err) throw err
    for (let i = 0; i < res.length; i++) {
      let team = res[i]
      if (data.myName) {
        team = setTeam(team)
        if (team.id != data.id) {
          team.members = memberFuns.remove(team.members, data.myName)
        } else {
          team.members = memberFuns.add(team.members, data.myName)
        }
      }
      const id = team._id
      delete team._id
      db.gameCollection.updateOne({_id: id}, {$set: team}, (err, ) => {
        if (err) throw err
        io.emit('updateTeam', team)
      })
    }
  })
}

module.exports = {

  checkSystemGames: function(db, io, debugOn) {

    if (debugOn) { console.log('checkSystemGames') }

    const demoId = '364006d6-859e-4d61-b0f7-7c9d4b6ea5d4'
    const teams = [
      { name: 'Red', id: 'dbbd0ae0-6ce8-484a-9851-e3822a3c18a6'},
      { name: 'Blue', id: 'eaf60d50-a2ca-4052-a32a-42545cdd501c'},
      { name: 'Green', id: 'ed26d222-c9b8-4740-bb60-c859d4ab6f78'},
      { name: 'Purple', id: 'b89fce08-19b1-4772-8028-bd572b10c1e6'}
    ]

    db.gamesCollection.findOne({id: demoId}, (err, res) => {
      if (err) throw err
      if (res) {
        loadGames(db, io)
      } else {
        const game = setGame(demoId, 'Demo', true)
        db.gamesCollection.insertOne(game, (err, res) => {
          if (err) throw err
          for (let i = 0; i < teams.length; i++) {
            const team = setTeam({
              gameId: demoId,
              id: teams[i].id,
              name: teams[i].name,
              protected: true
            })
            db.gameCollection.insertOne(team, (err, res) => {
              if (err) throw err
              if (i == teams.length - 1) {
                loadGames(db, io)
              }
            })
          }
        })
      }
    })
  },

  restartGame: function(db, io, data, debugOn) {

    if (debugOn) { console.log('restartGame', data) }

    db.gameCollection.find({gameId: data.gameId}).toArray((err, res) => {
      for (let i = 0; i < res.length; i++) {
        const team = setTeam(res[i], true)
        const id = team._id
        delete team._id
        db.gameCollection.updateOne({'_id': id}, {$set: team}, (err, ) => {
          if (err) throw err
          io.emit('updateTeam', team)
        })
      }
    })
  },

  getTeams: function(db, io, data, debugOn) {

    if (debugOn) { console.log('getTeams', data) }

    db.gameCollection.find({gameId: data.gameId}).toArray((err, res) => {
      if (err) throw err
      io.emit('updateTeams', res)
    })
  },

  loadGame: function(db, io, data, debugOn) {

    if (debugOn) { console.log('loadGame', data) }

    loadGame(db, io, data)
  },

  loadTeam: function(db, io, data, debugOn) {

    if (debugOn) { console.log('loadTeam', data) }

    loadTeam(db, io, data)
  },

  selectFeatureToDevelop: function(db, io, data, debugOn) {

    if (debugOn) { console.log('selectFeatureToDevelop', data) }

    db.gameCollection.findOne({gameId: data.gameId, id: data.teamId}, (err, res) => {
      if (err) throw err
      res.selected = data.selected ? res.selected + 10 : res.selected - 10
      res.features = featureFuns.select(res.features, data.featureId, data.member, data.selected)
      const id = res._id
      delete res._id
      db.gameCollection.updateOne({'_id': id}, {$set: res}, (err, ) => {
        io.emit('updateTeam', res)
      })
    })
  },

  sendFeaturesToTest: function(db, io, data, debugOn) {

    if (debugOn) { console.log('sendFeaturesToTest', data) }

    db.gameCollection.findOne({gameId: data.gameId, id: data.teamId}, (err, res) => {
      if (err) throw err
      const features = []
      for (let i = 0; i < res.features.length; i++) {
        const feature = res.features[i]
        for (let j = 0; j < data.featureIds.length; j++) {
          if (feature.id == data.featureIds[j]) {
            if (feature.status == 'Fixing Bugs') {
              feature.bugs = featureFuns.fixBugs(feature.bugs)
            }
            feature.status = 'In Test'
            feature.selectedBy = []
            feature.selected = false
          }
        }
        features.push(feature)
      }
      res.features = features
      res.inTest = true
      const id = res._id
      delete res._id
      db.gameCollection.updateOne({'_id': id}, {$set: res}, (err, ) => {
        io.emit('updateTeam', res)
      })
    })
  },

  nextSprint: function(db, io, data, debugOn) {

    if (debugOn) { console.log('nextSprint', data) }

    db.gameCollection.findOne({gameId: data.gameId, id: data.teamId}, (err, res) => {
      if (err) throw err
      res.sprint = res.sprint + 1
      res.inTest = false
      res.selected = 0
      res.features = featureFuns.nextSprint(res.features)
      res.delivered.push({
        noOfFeatures: featureFuns.featuresCount(res.features),
        features: featureFuns.featuresScore(res.features),
        bugs: featureFuns.bugsScore(res.features),
        bugsNotSeen: featureFuns.bugsNotSeenScore(res.features)
      })
      const id = res._id
      delete res._id
      db.gameCollection.updateOne({'_id': id}, {$set: res}, (err, ) => {
        io.emit('updateTeam', res)
      })
    })
  },

  moveFeature: function(db, io, data, debugOn) {

    if (debugOn) { console.log('moveFeature', data) }

    db.gameCollection.findOne({gameId: data.gameId, id: data.teamId}, (err, res) => {
      if (err) throw err
      const features = []
      for (let i = 0; i < res.features.length; i++) {
        const feature = res.features[i]
        if (feature.id == data.featureId) {
          feature.status = data.status
          switch (data.status) {
            case 'In Test':
              break
            case 'Fixing Bugs':
              feature.bugEffortDone = 0
              feature.bugEffort = featureFuns.bugEffort(feature.bugs)
              break
            case 'Delivered':
              feature.bugs = featureFuns.deliver(feature.bugs)
              break
            default:
              console.log('Unknown status ', data.status)
          }
        }
        features.push(feature)
      }
      res.features = features
      const id = res._id
      delete res._id
      db.gameCollection.updateOne({'_id': id}, {$set: res}, (err, ) => {
        io.emit('updateTeam', res)
      })
    })
  },

  // Facilitator

  loadEditingTeams: function(db, io, data, debugOn) {

    if (debugOn) { console.log('loadEditingTeams', data) }

    db.gameCollection.find({gameId: data.gameId}).toArray((err, res) => {
      if (err) throw err
      io.emit('updateEditingTeams', res)
    })
  }

}
