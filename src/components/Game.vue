<template>
  <div class="container">
    <SetGame />
    <WalkThrough />
    <i v-if="isHost && gameId" title="Restart Game" class="fas fa-undo-alt restart" aria-hidden="true" @click="restart()" />
    <h2>
      <span v-if="game.id">Game: {{ game.name }} - </span>
      <span v-if="team.id">Team: {{ team.name }} - </span>
      <span v-if="myName.id">My Name: {{ myName.name }}</span>
    </h2>
    <h3>
      <span v-if="team.id">{{ game.sprintLabel }}: {{ team.sprint }}/{{ game.sprints }}</span>
    </h3>
    <Customer />
    <div class="row">
      <DevTeam />
    </div>
  </div>
</template>

<script>
import bus from '../socket.js'

import SetGame from './SetGame.vue'
import WalkThrough from './WalkThrough.vue'
import DevTeam from './game/DevTeam.vue'
import Customer from './game/Customer.vue'

export default {
  components: {
    SetGame,
    WalkThrough,
    DevTeam,
    Customer
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    gameId() {
      return this.$store.getters.getGameId
    },
    game() {
      return this.$store.getters.getGame
    },
    team() {
      return this.$store.getters.getTeam
    },
    myName() {
      return this.$store.getters.getMyName
    },
    view() {
      return this.$store.getters.getView
    }
  },
  methods: {
    restart() {
      if (confirm('Are you sure you want to re-start this game?')) {
        bus.emit('sendRestartGame', {gameId: this.gameId})
      }
    }
  }
}
</script>

<style lang="scss">
  h1 {
    span {
      margin: 6px;
    }
  }

  .row {
    .col-4, .col-8 {
      border: 1px solid;
    }
  }
</style>
