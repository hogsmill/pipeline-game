
const { v4: uuidv4 } = require('uuid')

const config = require('./lib/config.js').config

const featureFuns = require('./lib/features.js')
const memberFuns = require('./lib/members.js')

function setGame(id, name, prot) {
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

function setTeam(teamData) {
  const team = teamData
  team.features = featureFuns.features()
  team.sprint = 1
  if (teamData.gameId) {
    team.gameId = teamData.gameId
  }
  if (teamData.id) {
    team.id = teamData.id
  }
  if (teamData.name) {
    team.name = teamData.name
  }
  if (teamData.protected) {
    team.protected = teamData.protected
  }
  if (!teamData.members) {
    team.members = []
  }
  return team
}

function loadGames(db, io) {
  db.gamesCollection.find().toArray(function(err, res) {
    if (err) throw err
    io.emit('updateGames', res)
  })
}

function loadGame(db, io, data) {

  db.gamesCollection.findOne({id: data.id}, function(err, gameRes) {
    if (err) throw err
    io.emit('updateGame', gameRes)
  })
}

function loadTeam(db, io, data) {

  db.gameCollection.findOne({gameId: data.gameId, id: data.id}, function(err, res) {
    if (err) throw err
    res.members = memberFuns.add(res.members, data.myName)
    db.gameCollection.updateOne({_id: res._id}, {$set: {members: res.members}}, function(err, ) {
      if (err) throw err
      io.emit('updateTeam', res)
    })
  })
}

module.exports = {

  checkSystemGames: function(db, io, debugOn) {

    if (debugOn) { console.log('checkSystemGames') }

    const demoId = '364006d6-859e-4d61-b0f7-7c9d4b6ea5d4'
    const teams = ['Red', 'Blue', 'Green', 'Purple']

    db.gamesCollection.findOne({id: demoId}, function(err, res) {
      if (err) throw err
      if (res) {
        loadGames(db, io)
      } else {
        const game = setGame(demoId, 'Demo', true)
        db.gamesCollection.insertOne(game, function(err, res) {
          if (err) throw err
          for (let i = 0; i < teams.length; i++) {
            const team = setTeam({
              gameId: demoId,
              id: uuidv4(),
              name: teams[i],
              protected: true
            })
            db.gameCollection.insertOne(team, function(err, res) {
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

    db.gameCollection.find({gameId: data.gameId}).toArray(function(err, res) {
      for (let i = 0; i < res.length; i++) {
        const team = setTeam(res[i])
        const id = team._id
        delete team._id
        db.gameCollection.updateOne({'_id': id}, {$set: team}, function(err, ) {
          if (err) throw err
          io.emit('updateTeam', team)
        })
      }
    })
  },

  getTeams: function(db, io, data, debugOn) {

    if (debugOn) { console.log('getTeams', data) }

    db.gameCollection.find({gameId: data.gameId}).toArray(function(err, res) {
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

    db.gameCollection.findOne({gameId: data.gameId, id: data.teamId}, function(err, res) {
      if (err) throw err
      const features = []
      for (let i = 0; i < res.features.length; i++) {
        const feature = res.features[i]
        if (feature.id == data.featureId) {
          if (!data.selected) {
            const selectedBy = []
            for (let j = 0; j < feature.selectedBy.length; j++) {
              if (feature.selectedBy[j].id != data.myName.id) {
                selectedBy.push(feature.selectedBy[j])
              }
            }
            feature.selectedBy = selectedBy
          } else {
            feature.selectedBy.push(data.myName)
          }
        }
        features.push(feature)
      }
      res.features = features
      const id = res._id
      delete res._id
      db.gameCollection.updateOne({'_id': id}, {$set: res}, function(err, ) {
        io.emit('updateTeam', res)
      })
    })
  },

  sendFeaturesToTest: function(db, io, data, debugOn) {

    if (debugOn) { console.log('sendFeaturesToTest', data) }

    db.gameCollection.findOne({gameId: data.gameId, id: data.teamId}, function(err, res) {
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
            feature.selected = false
          }
        }
        features.push(feature)
      }
      res.features = features
      res.inTest = true
      const id = res._id
      delete res._id
      db.gameCollection.updateOne({'_id': id}, {$set: res}, function(err, ) {
        io.emit('updateTeam', res)
      })
    })
  },

  nextSprint: function(db, io, data, debugOn) {

    if (debugOn) { console.log('nextSprint', data) }

    db.gameCollection.findOne({gameId: data.gameId, id: data.teamId}, function(err, res) {
      if (err) throw err
      res.sprint = res.sprint + 1
      res.inTest = false
      const id = res._id
      delete res._id
      db.gameCollection.updateOne({'_id': id}, {$set: res}, function(err, ) {
        io.emit('updateTeam', res)
      })
    })
  },

  moveFeature: function(db, io, data, debugOn) {

    if (debugOn) { console.log('moveFeature', data) }

    db.gameCollection.findOne({gameId: data.gameId, id: data.teamId}, function(err, res) {
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
              feature.effort = 0
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
      db.gameCollection.updateOne({'_id': id}, {$set: res}, function(err, ) {
        io.emit('updateTeam', res)
      })
    })
  },

  // Facilitator

  loadEditingTeams: function(db, io, data, debugOn) {

    if (debugOn) { console.log('loadEditingTeams', data) }

    db.gameCollection.find({gameId: data.gameId}).toArray(function(err, res) {
      if (err) throw err
      io.emit('updateEditingTeams', res)
    })
  }

}
