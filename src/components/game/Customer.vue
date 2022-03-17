<template>
  <div>
    <button class="btn btn-sm btn-info" @click="showCustomer()">
      Delivery Status
    </button>
  </div>
</template>

<script>
import bus from '../../socket.js'

export default {
  computed: {
    game() {
      return this.$store.getters.getGame
    },
    team() {
      return this.$store.getters.getTeam
    }
  },
  created() {
    const self = this
    bus.on('showCustomer', (data) => {
      if (data.gameId == this.game.id && data.id == this.team.id) {
        this.$store.dispatch('showModal', 'customer')
      }
    })
  },
  methods: {
    showCustomer() {
      bus.emit('sendShowCustomer', {gameId: this.game.id, id: this.team.id})
    }
  }
}
</script>

<style lang="scss">
  .customer {

    h5 {
      text-align: center;
    }

    .tabs {
      div {
        width: 200px;
        padding: 4px;
        display: inline-block;
        text-align: center;

        &.selected {
          background: #444;
          color: #fff;
        }
      }
    }
    .features, .features-not-wanted {
      position: relative;
      border: 1px solid #ddd;
      width: 802px;
      height: 402px;
      margin: 0 auto 12px auto;
    }

    .features-score {
      color: green;
    }

    .bugs-score {
      color: red;
    }

    .bugs-not-seen-score {
      color: lightgrey;
    }

    .feature {
      border: 1px dashed;
      height: 30px;
      margin: 6px;
      display: inline-grid;

      .delivered {
        border: 1px solid;
      }
    }
  }
</style>
