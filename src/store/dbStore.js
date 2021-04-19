
const { v4: uuidv4 } = require('uuid')

const featureFuns = require('./lib/features.js')

function loadGames(db, io) {
  db.gamesCollection.find().toArray(function(err, res) {
    if (err) throw err
    io.emit('updateGames', res)
  })
}

function resetTeam(team) {
  team.features = featureFuns.features()

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
          bugValues: featureFuns.bugValues()
        }
        db.gamesCollection.insertOne(game, function(err, res) {
          if (err) throw err
          for (let i = 0; i < teams.length; i++) {
            const team = {
              gameId: demoId,
              id: uuidv4(),
              name: teams[i],
              protected: true,
              features: featureFuns.features()
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

    db.gameCollection.find({gameId: data.gameId}).toArray(function(err, res) {
      if (err) throw err
      for (let i = 0; i < res.length; i++) {
        const team = resetTeam(res[i])
        const id = team._id
        delete team._id
        db.gameCollection.updateOne({'_id': id}, {$set: team}, function(err, ) {
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

    db.gamesCollection.findOne({id: data.gameId}, function(err, gameRes) {
      if (err) throw err
      db.gameCollection.findOne({gameId: data.gameId, id: data.teamId}, function(err, res) {
        if (err) throw err
        io.emit('updateGame', {game: gameRes, team: res})
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
          feature = featureFuns.move(feature, data.direction)
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
