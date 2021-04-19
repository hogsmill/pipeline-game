<template>
  <div class="container">
    <SetGame />
    <i v-if="isHost && gameId" title="Restart Game" class="fas fa-undo-alt restart" aria-hidden="true" @click="restart()" />
    <div class="row">
      <div class="col-8">
        <DevTeam />
      </div>
      <div class="col-4">
        <Customer />
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../socket.js'

import SetGame from './SetGame.vue'
import DevTeam from './game/DevTeam.vue'
import Customer from './game/Customer.vue'

export default {
  components: {
    SetGame,
    DevTeam,
    Customer
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    gameId() {
      return this.$store.getters.getGameId
    }
  },
  methods: {
    restart() {
      if (confirm('Are you sure you want to re-start this game?')) {
        bus.$emit('sendRestartGame', {gameId: this.gameId})
      }
    }
  }
}
</script>

<style lang="scss">
  .row {
    .col-4, .col-8 {
      border: 1px solid;
    }
  }
</style>
