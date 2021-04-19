<template>
  <div class="dev-team">
    <h1>
      Dev Team
    </h1>
    <div class="row">
      <div class="col-4">
        <h6>
          Send To Test
        </h6>
        <div v-for="(feature, index) in devFeatures" :key="index" class="feature">
          <div>
            {{ feature.name }}
          </div>
          <div class="buttons">
            <button class="btn btn-sm btn-info" @click="testFeature(feature)">
              Test
            </button>
          </div>
        </div>
      </div>
      <div class="col-4">
        <h6>
          In Test
        </h6>
        <div v-for="(feature, index) in testFeatures" :key="index" class="feature">
          <div>
            {{ feature.name }}
          </div>
          <div>
            <div v-for="(bug, bindex) in feature.bugs" :key="bindex" class="bug" :class="bug.severity">
              {{ bug.name }}
            </div>
          </div>
          <div class="buttons">
            <button class="btn btn-sm btn-info" @click="fixBugsInFeature(feature)">
              Fix Bugs
            </button>
            <button class="btn btn-sm btn-info" @click="deliverFeature(feature)">
              Deliver
            </button>
          </div>
        </div>
      </div>
    </div>
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
    },
    devFeatures() {
      return this.$store.getters.getFeaturesToDevelop
    },
    testFeatures() {
      return this.$store.getters.getFeaturesInTest
    }
  },
  methods: {
    testFeature(feature) {
      bus.$emit('sendTestFeature', {gameId: this.game.id, teamId: this.team.id, featureId: feature.id})
    },
    fixBugsInFeature(feature) {
      bus.$emit('sendFixBugsInFeature', {gameId: this.game.id, teamId: this.team.id, featureId: feature.id})
    },
    deliverFeature(feature) {
      bus.$emit('sendDeliverFeature', {gameId: this.game.id, teamId: this.team.id, featureId: feature.id})
    }
  }
}
</script>

<style lang="scss">
  .dev-team {

    .feature {
      margin: 6px;
      border: 1px solid;

      .bug {
        &.critical {
          background-color: red;
        }
        &.major {
          background-color: orange;
        }
        &.minor {
          background-color: yellow;
        }
        &.cosmetic {
          background-color: lightgrey;
        }
      }

      .buttons {
        text-align: center;
        margin: 4px 0;
      }
    }
  }
</style>
