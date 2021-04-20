import io from 'socket.io-client'
import bus from './EventBus'

let connStr
if (location.hostname == 'localhost') {
  connStr = 'http://localhost:3025'
} else {
  connStr = 'https://agilesimulations.co.uk:' + process.env.VUE_APP_PORT
}

console.log('Connecting to: ' + connStr)
const socket = io(connStr)

socket.on('connect_error', (err) => { bus.$emit('connectionError', err) })

socket.on('updateConnections', (data) => { bus.$emit('updateConnections', data) })

// Send

bus.$on('sendCheckSystemGames', (data) => { socket.emit('sendCheckSystemGames', data) })

bus.$on('sendRestartGame', (data) => { socket.emit('sendRestartGame', data) })

bus.$on('sendGetTeams', (data) => { socket.emit('sendGetTeams', data) })

bus.$on('sendLoadGame', (data) => { socket.emit('sendLoadGame', data) })

bus.$on('sendSelectFeatureToDevelop', (data) => { socket.emit('sendSelectFeatureToDevelop', data) })

bus.$on('sendFeaturesToTest', (data) => { socket.emit('sendFeaturesToTest', data) })

bus.$on('sendFixBugsInFeature', (data) => { socket.emit('sendFixBugsInFeature', data) })

bus.$on('sendDeliverFeature', (data) => { socket.emit('sendDeliverFeature', data) })

bus.$on('sendNextSprint', (data) => { socket.emit('sendNextSprint', data) })

// Facilitator

bus.$on('sendLoadEditingTeams', (data) => { socket.emit('sendLoadEditingTeams', data) })


// Receive

socket.on('updateGames', (data) => { bus.$emit('updateGames', data) })

socket.on('updateTeams', (data) => { bus.$emit('updateTeams', data) })

socket.on('updateGame', (data) => { bus.$emit('updateGame', data) })

socket.on('updateTeam', (data) => { bus.$emit('updateTeam', data) })

socket.on('deliverFeature', (data) => { bus.$emit('deliverFeature', data) })

// Facilitator

socket.on('updateEditingTeams', (data) => { bus.$emit('updateEditingTeams', data) })

export default bus
