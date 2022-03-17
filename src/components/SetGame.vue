<template>
  <span>
    <button class="btn btn-sm btn-secondary smaller-font" :disabled="team.sprint > 1" @click="show()">
      Set Up
    </button>
  </span>
</template>

<script>
import bus from '../socket.js'

export default {
  computed: {
    game() {
      return this.$store.getters.getGame
    },
    team() {
      return this.$store.getters.getTeam
    }
  },
  methods: {
    show() {
      bus.emit('sendGetGames')
      if (this.game.id) {
        bus.emit('sendGetTeams', {gameId: this.game.id})
      }
      this.$store.dispatch('showModal', 'setGame')
    }
  }
}
</script>

<style lang="scss">



</style>
