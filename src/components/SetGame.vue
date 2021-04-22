<template>
  <span>

    <button class="btn btn-sm btn-secondary smaller-font" @click="show()">
      Set Up
    </button>

    <modal name="set-up" :height="385" class="rounded">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide()" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>Game Set Up</h4>
        <table class="setup-table">

          <!-- Game Name -->

          <tr>
            <td>Game Name: </td>
            <td>
              <select id="game-name-select" class="form-control" @change="getTeams()">
                <option> -- Select -- </option>
                <option v-for="(g, index) in games" :key="index" :selected="g.id == game.id" :value="g.id">
                  {{ g.name }}
                </option>
              </select>
            </td>
          </tr>

          <!-- Team Name -->

          <tr>
            <td>Team: </td>
            <td>
              <select id="team-name-select" class="form-control">
                <option value=""> -- Select -- </option>
                <option v-for="(t, index) in teams" :key="index" :selected="t.id == team.id" :value="t.id">
                  {{ t.name }}
                </option>
              </select>
            </td>
          </tr>
        </table>
        <button class="btn btn-sm btn-primary smaller-font" @click="loadGame()">
          Done
        </button>
      </div>
    </modal>

  </span>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'

import bus from '../socket.js'

export default {
  computed: {
    games() {
      return this.$store.getters.getGames
    },
    teams() {
      return this.$store.getters.getTeams
    },
    game() {
      return this.$store.getters.getGame
    },
    team() {
      return this.$store.getters.getTeam
    }
  },
  methods: {
    show() {
      bus.$emit('sendGetGames')
      if (this.game.id) {
        bus.$emit('sendGetTeams', {gameId: this.game.id})
      }
      this.$modal.show('set-up')
    },
    hide() {
      this.$modal.hide('set-up')
    },
    getTeams() {
      const gameId = document.getElementById('game-name-select').value
      bus.$emit('sendGetTeams', {gameId: gameId})
    },
    notSelected() {
      const gameId = document.getElementById('game-name-select').value
      const teamId = document.getElementById('team-name-select').value
      return
    },
    loadGame() {
      const gameId = document.getElementById('game-name-select').value
      const teamId = document.getElementById('team-name-select').value
      if (!gameId || !teamId) {
        alert('Please select a game and team')
      } else {
        this.$store.dispatch('updateGameId', gameId)
        this.$store.dispatch('updateTeamId', teamId)
        localStorage.setItem('pg-gameId', gameId)
        localStorage.setItem('pg-teamId', teamId)
        bus.$emit('sendLoadGame', {gameId: gameId, teamId: teamId})
        this.hide()
      }
    }
  }
}
</script>

<style lang="scss">

  .setup-table {
    margin: 0 auto 20px auto;
    border: 1px solid #ccc;

    td {
      height: 45px;
      border: 1px solid #ccc;

      div {
        padding: 6px;
        text-align: left;

        &.my-name {
        margin-top: 6px;
        margin-bottom: 6px;
        }

        &.my-name-edit {
          padding-bottom: 0;
        }
      }

      &:nth-child(1) {
        padding: 2px 10px;
      }
      &:nth-child(2) {
        width: 200px; ;
      }

      select {
        padding: 0;
      }

      &.button {
        vertical-align: middle;
        width: 60px;

        button {
          margin: 6px;
        }
      }

      .fas {
        color: #888;
        font-size: x-large;

        &:hover {
          cursor: pointer;
          color: #5a6268
        }
      }
    }

    .error {
      background-color: red;
      color: #fff;
    }
  }

</style>
