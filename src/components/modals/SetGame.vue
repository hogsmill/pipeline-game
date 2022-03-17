<template>
  <vue-final-modal name="set-game" classes="modal-container" content-class="vfm__content modal-content setup-table" v-model="modals['setGame']">
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
          <td>
            Game Name:
          </td>
          <td>
            <select id="game-name-select" class="form-control" @change="getTeams()">
              <option>
                -- Select --
              </option>
              <option v-for="(g, index) in games" :key="index" :selected="g.id == game.id" :value="g.id">
                {{ g.name }}
              </option>
            </select>
          </td>
        </tr>

        <!-- Team Name -->

        <tr>
          <td>
            Team:
          </td>
          <td>
            <select id="team-name-select" class="form-control">
              <option value="">
                -- Select --
              </option>
              <option v-for="(t, index) in teams" :key="index" :selected="t.id == team.id" :value="t.id">
                {{ t.name }}
              </option>
            </select>
          </td>
        </tr>

        <!-- My Name -->

        <tr>
          <td>
            My Name:
          </td>
          <td>
            <input type="text" id="my-name" :value="myName.name">
          </td>
        </tr>
      </table>
      <button class="btn btn-sm btn-primary smaller-font" @click="loadGame()">
        Done
      </button>
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../socket.js'

import { VueFinalModal } from 'vue-final-modal'

import { v4 as uuidv4 } from 'uuid'

export default {
  components: {
    VueFinalModal
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    games() {
      return this.$store.getters.getGames
    },
    game() {
      return this.$store.getters.getGame
    },
    teams() {
      return this.$store.getters.getTeams
    },
    team() {
      return this.$store.getters.getTeam
    },
    myName() {
      return this.$store.getters.getMyName
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('hideModal', 'setGame')
    },
    getTeams() {
      const gameId = document.getElementById('game-name-select').value
      bus.emit('sendGetTeams', {gameId: gameId})
    },
    notSelected() {
      const gameId = document.getElementById('game-name-select').value
      const teamId = document.getElementById('team-name-select').value
      return
    },
    loadGame() {
      const gameId = document.getElementById('game-name-select').value
      const teamId = document.getElementById('team-name-select').value
      const myName = document.getElementById('my-name').value
      let myNameData
      if (this.myName.id) {
        myNameData = this.myName
        myNameData.name = myName
      } else {
        myNameData = {
          id: uuidv4(),
          name: myName
        }
      }
      if (!gameId || !teamId || !myName) {
        alert('Please select a game, team and your name')
      } else {
        this.$store.dispatch('updateGameId', gameId)
        this.$store.dispatch('updateTeamId', teamId)
        this.$store.dispatch('updateMyName', myNameData)
        localStorage.setItem('pg-gameId', gameId)
        localStorage.setItem('pg-teamId', teamId)
        localStorage.setItem('pg-myName', JSON.stringify(myNameData))
        bus.emit('sendLoadGame', {id: gameId})
        bus.emit('sendLoadTeam', {gameId: gameId, id: teamId, myName: myNameData, setGame: true})
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

    input {
      width: 100%;
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
