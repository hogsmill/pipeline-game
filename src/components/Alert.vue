<template>
  <modal name="alert" :height="200" class="alert rounded">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide()" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4">
      <h4 :class="severity">
        <i v-if="severity == 'info'" class="info fas fa-info-circle" />
        <i v-if="severity == 'warning'" class="warning fas fa-exclamation-triangle" />
        <i v-if="severity == 'error'" class="error fas fa-exclamation-circle" />
        {{ title() }}
      </h4>
      <p>{{ message }}</p>
    </div>
    <button class="btn btn-sm btn-primary smaller-font" @click="hide()">
      Done
    </button>
  </modal>
</template>

<script>
import bus from '../socket.js'

export default {
  data() {
    return {
      severity: 'info',
      message: ''
    }
  },
  computed: {
    gameId() {
      return this.$store.getters.getGameId
    },
    teamId() {
      return this.$store.getters.getTeamId
    }
  },
  created() {
    bus.$on('alert', (data) => {
      console.log(data)
      if (data.gameId == this.gameId && data.teamId == this.teamId) {
        this.message = data.message
        this.severity = data.severity
        this.show()
      }
    })
  },
  methods: {
    show() {
      const self = this
      this.$modal.show('alert')
      //setTimeout(function() {
      //  self.hide()
      //}, 2000)
    },
    hide() {
      this.$modal.hide('alert')
    },
    title() {
      let t = ''
      switch(this.severity) {
        case 'info':
          t = 'Info'
          break
        case 'warning':
          t = 'Warning'
          break
        case 'error':
          t = 'Error'
          break
      }
      return t
    }
  }
}
</script>

<style lang="scss">
  .alert {
    h4 {
      color: #fff;

      &.info {
        background-color: green;
      }
      &.warning {
        background-color: orange;
      }
      &.error {
        background-color: red;
      }

      .fas {
        &.info {
          color: yellow;
        }
        &.warning {
          color: yellow;
        }
        &.error {
          color: #fff;
        }
      }
    }

    p {
      font-size: large;
    }
  }
</style>
