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

socket.on('connect_error', (err) => { bus.emit('connectionError', err) })

socket.on('updateConnections', (data) => { bus.emit('updateConnections', data) })

// Send

bus.on('sendAlert', (data) => { socket.emit('sendAlert', data) })

bus.on('sendCheckSystemGames', (data) => { socket.emit('sendCheckSystemGames', data) })

bus.on('sendRestartGame', (data) => { socket.emit('sendRestartGame', data) })

bus.on('sendGetGames', (data) => { socket.emit('sendGetGames', data) })

bus.on('sendGetTeams', (data) => { socket.emit('sendGetTeams', data) })

bus.on('sendLoadGame', (data) => { socket.emit('sendLoadGame', data) })

bus.on('sendLoadTeam', (data) => { socket.emit('sendLoadTeam', data) })

bus.on('sendSelectFeatureToDevelop', (data) => { socket.emit('sendSelectFeatureToDevelop', data) })

bus.on('sendFeaturesToTest', (data) => { socket.emit('sendFeaturesToTest', data) })

bus.on('sendFixBugsInFeature', (data) => { socket.emit('sendFixBugsInFeature', data) })

bus.on('sendDeliverFeature', (data) => { socket.emit('sendDeliverFeature', data) })

bus.on('sendNextSprint', (data) => { socket.emit('sendNextSprint', data) })

bus.on('sendShowCustomer', (data) => { socket.emit('sendShowCustomer', data) })

bus.on('sendHideCustomer', (data) => { socket.emit('sendHideCustomer', data) })

// Facilitator

bus.on('sendLoadEditingGame', (data) => { socket.emit('sendLoadEditingGame', data) })

bus.on('sendDeleteTeamMember', (data) => { socket.emit('sendDeleteTeamMember', data) })

// Receive

socket.on('alert', (data) => { bus.emit('alert', data) })

socket.on('updateGames', (data) => { bus.emit('updateGames', data) })

socket.on('updateTeams', (data) => { bus.emit('updateTeams', data) })

socket.on('updateGame', (data) => { bus.emit('updateGame', data) })

socket.on('updateTeam', (data) => { bus.emit('updateTeam', data) })

socket.on('deliverFeature', (data) => { bus.emit('deliverFeature', data) })

socket.on('showCustomer', (data) => { bus.emit('showCustomer', data) })

socket.on('hideCustomer', (data) => { bus.emit('hideCustomer', data) })

// Facilitator

socket.on('loadEditingGame', (data) => { bus.emit('loadEditingGame', data) })

export default bus
