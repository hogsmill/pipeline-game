<template>
  <div class="config card bg-light mb-3 no-padding-r-l">
    <div class="card-body">
      <div class="control-header">
        <h5 class="card-title">
          Workshops and Games/Teams
          <i v-if="showGamesAndTeams" @click="setShowGamesAndTeams(false)" title="collapse" class="fas fa-caret-up toggle" />
          <i v-if="!showGamesAndTeams" @click="setShowGamesAndTeams(true)" title="expand" class="fas fa-caret-down toggle" />
        </h5>
      </div>
      <div v-if="showGamesAndTeams">
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
                    <input :id="'team-' + team.id" type="checkbox" :checked="editingTeam && team.id == editingTeam.id" @click="selectTeam(team.id)">
                  </td>
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
          <tr>
            <td>
              Members
            </td>
            <td>
              <table v-if="editingTeam">
                <tr v-for="(member, index) in editingTeam.members" :key="index">
                  <td>
                    {{ member.name }}
                  </td>
                  <td>
                    <i class="fas fa-trash-alt" :title="'Delete ' + member.name" @click="deleteTeamMember(member)" />
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
  data() {
    return {
      showGamesAndTeams: false
    }
  },
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
    },
    editingTeam() {
      return this.$store.getters.getEditingTeam
    }
  },
  created() {
    bus.on('loadEditingGame', (data) => {
      this.$store.dispatch('updateEditingGame', data)
    })
  },
  methods: {
    setShowGamesAndTeams(val) {
      this.showGamesAndTeams = val
    },
    addGame() {
      const game = document.getElementById('new-game').value
      if (!game) {
        alert('Please enter a valid team name')
      } else {
        bus.emit('sendAddGame', {name: game})
        document.getElementById('new-game').value = ''
      }
    },
    selectGame(id) {
      const checked = document.getElementById('game-' + id).checked
      if (!checked) {
        this.$store.dispatch('updateEditingGame', '')
      } else {
        bus.emit('sendLoadEditingGame', {gameId: id})
      }
    },
    deleteGame(game) {
      if (confirm('Delete ' + game.name + '?')) {
        bus.emit('sendDeleteGame', {gameId: game.id})
      }
    },
    selectTeam(id) {
      const checked = document.getElementById('team-' + id).checked
      if (!checked) {
        this.$store.dispatch('updateEditingTeamId', '')
      } else {
        this.$store.dispatch('updateEditingTeamId', id)
      }
    },
    deleteTeamMember(member) {
      if (confirm('Delete ' + member.name + '?')) {
        bus.emit('sendDeleteTeamMember', {gameId: this.editingGame.id, teamId: this.editingTeam.id, id: member.id})
      }
    },
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
