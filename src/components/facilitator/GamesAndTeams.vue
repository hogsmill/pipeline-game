<template>
  <div class="config card bg-light mb-3 no-padding-r-l">
    <div class="card-body">
      <div class="control-header">
        <h5 class="card-title">
          Workshops and Games/Teams
        </h5>
      </div>
      <div>
        <table class="config-table">
          <tr>
            <td>
              Game
            </td>
            <td>
              <div>
                <input type="text" id="new-game">
                <button class="btn btn-sm btn-secondary smaller-font" @click="addGame()">
                  Add New
                </button>
              </div>
              <table class="games-table">
                <tr v-for="(game, index) in games" :key="index" :class="{ 'selected': game.name == editingGame.name }">
                  <td>
                    <input :id="'game-' + game.id" type="checkbox" :checked="game.id == editingGame.id" @click="selectGame(game.id)">
                  </td>
                  <td>
                    {{ game.name }}
                  </td>
                  <td>
                    <i v-if="!game.protected" @click="deleteGame(game)" :title="'Delete ' + game.name" class="fas fa-trash-alt" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              Team
            </td>
            <td>
              <div>
                <input type="text" id="new-team">
                <button class="btn btn-sm btn-secondary smaller-font" @click="addTeam()" :disabled="!editingGame.name">
                  Add New
                </button>
              </div>
              <table class="teams-table">
                <tr v-for="(team, index) in editingTeams" :key="index">
                  <td>
                    {{ team.name }}
                  </td>
                  <td>
                    <i v-if="!team.protected" @click="deleteTeam(team)" :title="'Delete ' + team.name" class="fas fa-trash-alt" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../../socket.js'

export default {
  computed: {
    workshops() {
      return this.$store.getters.getWorkshops
    },
    games() {
      return this.$store.getters.getGames
    },
    editingGame() {
      return this.$store.getters.getEditingGame
    },
    editingTeams() {
      return this.$store.getters.getEditingTeams
    }
  },
  created() {
    bus.$emit('sendLoadEditingGame', {gameId: ''})

    bus.$on('updateEditingTeams', (data) => {
      this.$store.dispatch('updateEditingTeams', data)
    })
  },
  methods: {
    addGame() {
      const game = document.getElementById('new-game').value
      if (!game) {
        alert('Please enter a valid team name')
      } else {
        bus.$emit('sendAddGame', {name: game})
        document.getElementById('new-game').value = ''
      }
    },
    selectGame(id) {
      const checked = document.getElementById('game-' + id).checked
      bus.$emit('sendLoadEditingTeams', {gameId: checked ? id : ''})
    },
    deleteGame(game) {
      if (confirm('Delete ' + game.name + '?')) {
        bus.$emit('sendDeleteGame', {gameId: game.id})
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
