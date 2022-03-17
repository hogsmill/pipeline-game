<template>
  <div :class="{'not-host' : !isHost}">
    <div class="connections">
      Current server connections: {{ connections.connections }} / {{ connections.maxConnections }}
    </div>
    <GameDisplay />
    <GamesAndTeams />
    <LocalStorage />
  </div>
</template>

<script>
import bus from '../socket.js'

import GameDisplay from './facilitator/GameDisplay.vue'
import GamesAndTeams from './facilitator/GamesAndTeams.vue'
import LocalStorage from './facilitator/LocalStorage.vue'

export default {
  components: {
    GameDisplay,
    GamesAndTeams,
    LocalStorage
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    connections() {
      return this.$store.getters.getConnections
    },
    editingGame() {
      return this.$store.getters.getEditingGame
    }
  },
  created() {
    bus.emit('sendGetGames')

    bus.on('setEditingGame', (data) => {
      this.$store.dispatch('setEditingGame', data)
    })
  }
}
</script>

<style lang="scss">

h5 {
  text-align: left;
}

.config {
  i.fas {
    color: #aaa;
    font-size: xx-large;
    position: absolute;
    right: 24px;
  }
}
.config-table {
  width: 90%;
  margin: 0 auto;

  td {
    text-align: left;
    vertical-align: top;
    border: 1px solid #ccc;
    padding: 4px;

    input[type="text"], select {
      padding: 2px;
      width: 270px;
      margin: 4px 8px;
      display: inline;
    }

    button {
      margin: 4px 8px;
    }
    .far, .fas {
      margin: 0 4px;
      color: #888;
      font-size: large;

      &:hover {
        cursor: pointer;
        color: #444;
      }
    }
  }
}
</style>
