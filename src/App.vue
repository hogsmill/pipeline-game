<template>
  <div id="app" class="mb-4">
    <Header />
    <WalkThrough />
    <div v-if="connectionError" class="not-connected">
      WARNING: You are not connected to the server: {{ connectionError }}
    </div>
    <div v-if="localStorageStatus != 'ok'" class="not-connected">
      WARNING: {{ localStorageStatus }} - please enable cookies in browser settings
    </div>
    <Game v-if="currentTab == 'game'" />
    <Facilitator v-if="currentTab == 'facilitator'" />
  </div>
</template>

<script>
import bus from './socket.js'

import ls from './lib/localStorage.js'
import params from './lib/params.js'

import Header from './components/Header.vue'
import WalkThrough from './components/about/WalkThroughView.vue'
import Game from './components/Game.vue'
import Facilitator from './components/Facilitator.vue'

export default {
  name: 'App',
  components: {
    Header,
    WalkThrough,
    Game,
    Facilitator
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
    }
  },
  created() {
    if (params.isParam('host')) {
      this.$store.dispatch('updateHost', true)
    }

    this.$store.dispatch('localStorageStatus', ls.check())

    bus.$on('connectionError', (data) => {
      this.$store.dispatch('updateConnectionError', data)
    })

    bus.$on('updateConnections', (data) => {
      this.$store.dispatch('updateConnectionError', null)
      this.$store.dispatch('updateConnections', data)
    })

    bus.$on('testMessage', (data) => {
      console.log(data)
      this.source = data.source
      this.date = data.date
      this.message = data.message
    })
  },
  methods: {
    send() {
      bus.$emit('sendTestMessage', {source: 'App.vue', message: 'Hello World!'})
    }
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
