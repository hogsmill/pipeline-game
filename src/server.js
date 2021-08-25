const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const fs = require('fs')

const ON_DEATH = require('death')({uncaughtException: true})
const os = require('os')
const prod = os.hostname() == 'agilesimulations' ? true : false

const port = prod ? process.env.VUE_APP_PORT : 3025
const logFile = prod ? process.argv[4] : 'server.log'
const gameCollection =  prod ? process.env.VUE_APP_COLLECTION : 'pipeline'
const gamesCollection =  prod ? process.env.VUE_APP_GAME_COLLECTION : 'pipelineGames'

ON_DEATH((signal, err) => {
  let logStr = new Date()
  if (signal) {
    logStr = logStr + ' ' + signal + '\n'
  }
  if (err && err.stack) {
    logStr = logStr + '  ' + err.stack + '\n'
  }
  fs.appendFile(logFile, logStr, (err) => {
    if (err) console.log(logStr)
    process.exit()
  })
})

global.TextEncoder = require("util").TextEncoder
global.TextDecoder = require("util").TextDecoder

let httpServer
let io
if (!prod) {
  const express = require('express')
  const app = express()
  httpServer = require('http').createServer(app)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['http://localhost:*'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
} else {
  const options = {
    key: fs.readFileSync('/etc/ssl/private/agilesimulations.co.uk.key'),
    cert: fs.readFileSync('/etc/ssl/certs/07DDA10F5A5AB75BD9E9508BC490D32C.cer')
  }
  httpServer = require('https').createServer(options)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['https://agilesimulations.co.uk'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
}


const dbStore = require('./store/dbStore.js')

const MongoClient = require('mongodb').MongoClient

const url = prod ?  'mongodb://127.0.0.1:27017/' : 'mongodb://localhost:27017/'
const maxIdleTime = 7200000
const connectDebugOff = prod
const debugOn = !prod

const connections = {}
const maxConnections = 2000

const emit = (event, data) => {
  if (debugOn) {
    console.log(event, data, '(emit)')
  }
  io.emit(event, data)
}

MongoClient.connect(url, { useUnifiedTopology: true, maxIdleTimeMS: maxIdleTime }, (err, client) => {
  if (err) throw err
  const db = client.db('db')

  db.createCollection(gameCollection, (error, collection) => {})
  db.createCollection(gamesCollection, (error, collection) => {})

  db.gameCollection = db.collection(gameCollection)
  db.gamesCollection = db.collection(gamesCollection)

  io.on('connection', (socket) => {
    const connection = socket.handshake.headers.host
    connections[connection] = connections[connection] ? connections[connection] + 1 : 1
    if (Object.keys(connections).length > maxConnections || connections[connection] > maxConnections) {
      console.log(`Too many connections. Socket ${socket.id} closed`)
      socket.disconnect(0)
    } else {
      connectDebugOff || console.log(`A user connected with socket id ${socket.id} from ${connection} - ${connections[connection]} connections. (${Object.keys(connections).length} clients)`)
      emit('updateConnections', {connections: connections, maxConnections: maxConnections})
    }

    socket.on('disconnect', () => {
      const connection = socket.handshake.headers.host
      connections[connection] = connections[connection] - 1
      connectDebugOff || console.log(`User with socket id ${socket.id} has disconnected.`)
      emit('updateConnections', {connections: connections, maxConnections: maxConnections})
    })

    socket.on('sendAlert', (data) => { emit('alert', data) })

    socket.on('sendCheckSystemGames', (data) => { dbStore.checkSystemGames(db, io, debugOn) })

    socket.on('sendRestartGame', (data) => { dbStore.restartGame(db, io, data, debugOn) })

    socket.on('sendGetGames', (data) => { dbStore.getGames(db, io, debugOn) })

    socket.on('sendGetTeams', (data) => { dbStore.getTeams(db, io, data, debugOn) })

    socket.on('sendLoadGame', (data) => { dbStore.loadGame(db, io, data, debugOn) })

    socket.on('sendLoadTeam', (data) => { dbStore.loadTeam(db, io, data, debugOn) })

    socket.on('sendSelectFeatureToDevelop', (data) => { dbStore.selectFeatureToDevelop(db, io, data, debugOn) })

    socket.on('sendFeaturesToTest', (data) => { data.status = 'In Test'; dbStore.sendFeaturesToTest(db, io, data, debugOn) })

    socket.on('sendFixBugsInFeature', (data) => { data.status = 'Fixing Bugs';  dbStore.moveFeature(db, io, data, debugOn) })

    socket.on('sendDeliverFeature', (data) => { data.status = 'Delivered'; dbStore.moveFeature(db, io, data, debugOn) })

    socket.on('sendNextSprint', (data) => { dbStore.nextSprint(db, io, data, debugOn) })

    socket.on('sendShowCustomer', (data) => { emit('showCustomer', data) })

    socket.on('sendHideCustomer', (data) => { emit('hideCustomer', data) })

    // Facilitator

    socket.on('sendLoadEditingGame', (data) => { dbStore.loadEditingGame(db, io, data, debugOn) })

    socket.on('sendDeleteTeamMember', (data) => { dbStore.deleteTeamMember(db, io, data, debugOn) })
  })
})

httpServer.listen(port, () => {
  console.log('Listening on *:' + port)
})
