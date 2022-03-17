<template>
  <div id="app" class="mb-4">
    <Header />
    <div v-if="connectionError" class="not-connected">
      WARNING: You are not connected to the server: {{ connectionError }}
    </div>
    <div v-if="localStorageStatus != 'ok'" class="not-connected">
      WARNING: {{ localStorageStatus }} - please enable cookies in browser settings
    </div>
    <Game v-if="currentTab == 'game'" />
    <Facilitator v-if="currentTab == 'facilitator'" />
    <Modals />
  </div>
</template>

<script>
import bus from './socket.js'

import ls from './lib/localStorage.js'
import params from './lib/params.js'

import Header from './components/Header.vue'
import Game from './components/Game.vue'
import Facilitator from './components/Facilitator.vue'
import Modals from './components/Modals.vue'

export default {
  name: 'App',
  components: {
    Header,
    Game,
    Facilitator,
    Modals
  },
  data() {
    return {
      date: '',
      message: '',
      source: ''
    }
  },
  computed: {
    connectionError() {
      return this.$store.getters.getConnectionError
    },
    localStorageStatus() {
      return this.$store.getters.getLocalStorageStatus
    },
    currentTab() {
      return this.$store.getters.getCurrentTab
    },
    gameId() {
      return this.$store.getters.getGameId
    },
    teamId() {
      return this.$store.getters.getTeamId
    }
  },
  created() {
    if (params.isParam('host')) {
      this.$store.dispatch('updateHost', true)
    }

    if (params.isParam('walkThrough')) {
      this.$store.dispatch('showModal', 'walkThrough')
    }

    this.$store.dispatch('localStorageStatus', ls.check())

    bus.emit('sendCheckSystemGames')

    const gameId = localStorage.getItem('pg-gameId')
    const teamId = localStorage.getItem('pg-teamId')
    const myName = JSON.parse(localStorage.getItem('pg-myName'))
    if (gameId) {
      this.$store.dispatch('updateGameId', gameId)
      bus.emit('sendLoadGame', {id: gameId})
    }
    if (teamId && myName) {
      this.$store.dispatch('updateTeamId', teamId)
      this.$store.dispatch('updateMyName', myName)
      bus.emit('sendLoadTeam', {gameId: gameId, id: teamId})
    }

    bus.on('connectionError', (data) => {
      this.$store.dispatch('updateConnectionError', data)
    })

    bus.on('updateConnections', (data) => {
      this.$store.dispatch('updateConnectionError', null)
      this.$store.dispatch('updateConnections', data)
    })

    bus.on('updateGames', (data) => {
      this.$store.dispatch('updateGames', data)
    })

    bus.on('updateTeams', (data) => {
      this.$store.dispatch('updateTeams', data)
    })

    bus.on('updateGame', (data) => {
      if (data.id == this.gameId) {
        console.log('game', data)
        this.$store.dispatch('updateGame', data)
      }
    })

    bus.on('updateTeam', (data) => {
      if (data.gameId == this.gameId && data.id == this.teamId) {
        console.log('team', data)
        this.$store.dispatch('updateTeam', data)
      }
    })

    bus.on('alert', (data) => {
      if (data.gameId == this.gameId && data.teamId == this.teamId) {
        this.$store.dispatch('setModalData', {
          message: data.message,
          severity: data.severity
        })
        this.$store.dispatch('showModal', 'alert')
      }
    })
  }
}
</script>

<style lang="scss">

  .not-connected {
    background-color: red;
    color: #fff;
    font-weight: bold;
    margin: 6px;
  }
</style>
