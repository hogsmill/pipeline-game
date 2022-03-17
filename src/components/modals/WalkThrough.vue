<template>
  <vue-final-modal name="walk-through" classes="modal-container" content-class="vfm__content modal-content walk-through" v-model="modals['walkThrough']">
  <div class="float-right mr-2 mt-1">
    <button type="button" class="close" @click="hide()" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="mt-4" v-if="step == 1">
    <h4>Welcome to the Pipeline Game</h4>
    <div>
      <p>
        The Pipeline game allows you to explore what happens when you use
        different delivery strategies; should you make sure everything you
        deliver is bug free before releasing it (even if the customer may never
        see the bug, or it becomes irrelevant in the next release), or should
        you deliver as fast as possible to learn what the customer wants as quickly as
        possible? Or something in between?
      </p>
      <p>
        This activity is best facilitated by someone familiar with the game,
        so do get in touch and we can either facilitate a workshop for you,
        or teach you how to do it yourself.
      </p>
      <Facilitation />
    </div>
  </div>
  <div class="buttons" v-if="step < 1">
    <button class="btn btn-info" @click="incrementStep()">
      Next
    </button>
    <button class="btn btn-info" @click="hide()">
      Skip
    </button>
  </div>
  <div class="buttons" v-if="step == 1">
    <button class="btn btn-info" @click="hide()">
      Play Game
    </button>
  </div>
  </vue-final-modal>
</template>

<script>
import { VueFinalModal } from 'vue-final-modal'

import params from '../../lib/params.js'

import Facilitation from './walkThrough/Facilitation.vue'

export default {
  components: {
    VueFinalModal,
    Facilitation
  },
  data() {
    return {
      step: 1
    }
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    gameState() {
      return this.$store.getters.getGameState
    }
  },
  methods: {
    skip() {
      this.hide()
    },
    hide() {
      this.$store.dispatch('hideModal', 'walkThrough')
    },
    incrementStep() {
      this.step = this.step + 1
    }
  }
}
</script>

<style lang="scss">
  .buttons {
    padding: 6px;
    position: absolute;
    bottom: 20px;
    width: 100%;
  }

  .walk-through {
    height: 480px;
    p {
      text-align: left;
      margin: 0 24px 12px 24px;

      &.center {
        text-align: center;
      }
    }
    ul {
      margin-bottom: 12px;

      li {
        margin: 6px 24px 12px 36px;
        text-align: left;
      }
    }
  }
</style>
