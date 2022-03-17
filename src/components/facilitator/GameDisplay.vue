<template>
  <div class="config card bg-light mb-3 no-padding-r-l">
    <div class="card-body">
      <div class="control-header">
        <h5 class="card-title">
          Game Display
          <i v-if="showGameDisplay" @click="setShowGameDisplay(false)" title="collapse" class="fas fa-caret-up toggle" />
          <i v-if="!showGameDisplay" @click="setShowGameDisplay(true)" title="expand" class="fas fa-caret-down toggle" />
        </h5>
      </div>
      <div v-if="showGameDisplay">
        <table class="config-table">
          <tr>
            <td>
              <button class="btn btn-sm btn-site-primary" @click="showSingleTeamResult('scatter-plot')">
                Show
              </button>
              <button class="btn btn-sm btn-site-primary" @click="hideResult('scatter-plot')">
                Hide
              </button>
              Graph 1
            </td>
            <td>
              <Teams :multiple="false" :graph="'scatter-plot'" />
            </td>
          </tr>
          <tr>
            <td>
              <button class="btn btn-sm btn-site-primary" @click="showSingleTeamResult('scatter-plot')">
                Show
              </button>
              <button class="btn btn-sm btn-site-primary" @click="hideResult('scatter-plot')">
                Hide
              </button>
              Graph 2
            </td>
            <td>
              <Teams :multiple="true" :graph="'scatter-plot'" />
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../../socket.js'

import Teams from './Teams.vue'

export default {
  components: {
    Teams
  },
  data() {
    return {
      showGameDisplay: false
    }
  },
  computed: {
    game() {
      return this.$store.getters.getGame
    }
  },
  created() {
    bus.on('loadEditingGame', (data) => {
      this.$store.dispatch('updateEditingGame', data)
    })
  },
  methods: {
    setShowGameDisplay(val) {
      this.showGameDisplay = val
      if (this.game.id) {
        bus.emit('sendGetTeams', {gameId: this.game.id})
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .workshops-table, .games-table {
    td {
      border-left: none;
      border-right: none;
    }
  }
</style>
