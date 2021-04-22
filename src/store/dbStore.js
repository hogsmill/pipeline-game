
const { v4: uuidv4 } = require('uuid')

const featureFuns = require('./lib/features.js')

const days = 10

function loadGames(db, io) {
  db.gamesCollection.find().toArray(function(err, res) {
    if (err) throw err
    io.emit('updateGames', res)
  })
}

function loadGame(db, io, data) {

  db.gamesCollection.findOne({id: data.gameId}, function(err, gameRes) {
    if (err) throw err
    db.gameCollection.findOne({gameId: data.gameId, id: data.teamId}, function(err, res) {
      if (err) throw err
      io.emit('updateGame', {game: gameRes, team: res})
    })
  })
}

function resetTeam(team) {
  team.features = featureFuns.features()
  team.day = 1
  team.inTest = false

  return team
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
        const game = {
          id: demoId,
          name: 'Demo',
          protected: true,
          days: days,
          bugValues: featureFuns.bugValues(),
          days: 10
        }
        db.gamesCollection.insertOne(game, function(err, res) {
          if (err) throw err
          for (let i = 0; i < teams.length; i++) {
            const team = {
              gameId: demoId,
              id: uuidv4(),
              name: teams[i],
              protected: true,
              features: featureFuns.features(),
              day: 1
            }
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

    db.gamesCollection.updateOne({id: data.gameId}, {$set: {days: days}}, function(err, ) {
      if (err) throw err
      db.gameCollection.find({gameId: data.gameId}).toArray(function(err, res) {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
          const team = resetTeam(res[i])
          const id = team._id
          delete team._id
          db.gameCollection.updateOne({'_id': id}, {$set: team}, function(err, ) {
            const teamData = {
              gameId: data.gameId,
              teamId: team.id
            }
            loadGame(db, io, teamData)
          })
        }
      })
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

  selectFeatureToDevelop: function(db, io, data, debugOn) {

    if (debugOn) { console.log('selectFeatureToDevelop', data) }

    db.gameCollection.findOne({gameId: data.gameId, id: data.teamId}, function(err, res) {
      if (err) throw err
      const features = []
      for (let i = 0; i < res.features.length; i++) {
        const feature = res.features[i]
        if (feature.id == data.featureId) {
          feature.selected = data.selected
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
      res.day = res.day + 1
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
        let feature = res.features[i]
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
