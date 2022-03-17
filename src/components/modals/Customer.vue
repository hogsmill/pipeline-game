<template>
  <vue-final-modal name="customer" classes="modal-container" content-class="vfm__content modal-content customer" v-model="modals['customer']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide()" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4">
      <h4>Customer</h4>
      <h5>
        Value Delivered: {{ delivered().features - delivered().bugs }}
      </h5>
      <div>
        <i class="fas fa-check-circle features-score" title="↑ for features" /> {{ delivered().features }},
        <i class="fas fa-bug bugs-score" title="↓ for bugs" /> -{{ delivered().bugs }}
        (<i class="fas fa-bug bugs-not-seen-score" title="bugs not seen" /> <i>{{ delivered().bugsNotSeen }}</i>)
      </div>
      <div class="tabs">
        <div :class="{ 'selected': tab == 'delivered'}" @click="selectTab('delivered')">
          Features Delivered ({{ featuresDelivered.length }})
        </div>
        <div :class="{ 'selected': tab == 'not-wanted'}" @click="selectTab('not-wanted')">
          Features Not Wanted ({{ featuresNotWanted.length }})
        </div>
      </div>
      <div v-if="tab == 'delivered'" class="features">
        <Feature v-for="(feature, index) in featuresDelivered" :key="index" :feature="feature" />
      </div>
      <div v-if="tab == 'not-wanted'" class="features-not-wanted">
        <Feature v-for="(feature, index) in featuresNotWanted" :key="index" :feature="feature" />
      </div>
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../socket.js'

import { VueFinalModal } from 'vue-final-modal'

import Feature from '../game/customer/Feature.vue'

export default {
  components: {
    VueFinalModal,
    Feature
  },
  data() {
    return {
      tab: 'delivered'
    }
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    featuresDelivered() {
      return this.$store.getters.getFeaturesDelivered
    },
    featuresNotWanted() {
      return this.$store.getters.getFeaturesNotWanted
    },
    bugValues() {
      return this.$store.getters.getBugValues
    },
    game() {
      return this.$store.getters.getGame
    },
    team() {
      return this.$store.getters.getTeam
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('hideModal', 'customer')
    },
    hideCustomer() {
      bus.emit('sendHideCustomer', {gameId: this.game.id, id: this.team.id})
    },
    selectTab(tab) {
      this.tab = tab
    },
    delivered() {
      return this.team.delivered ? this.team.delivered[this.team.delivered.length - 1] : 0
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
