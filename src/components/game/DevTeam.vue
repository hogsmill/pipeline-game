<template>
  <div v-if="team.id" class="dev-team">
    <h2>
      Dev Team
    </h2>
    <p>
      Bug Values: TBD
    </p>
    <div class="row">
      <div class="col">
        <h6>
          To Do
        </h6>
        <div>
          <div>Effort: {{ selectedEffort }} / {{ maxEffort }}</div>
          <div>
            <button v-if="!team.inTest" class="btn btn-sm btn-info" @click="sendFeaturesToTest()">
              Submit to Test
            </button>
            <button v-if="team.inTest" class="btn btn-sm btn-info" @click="nextSprint()">
              Next Sprint
            </button>
          </div>
        </div>
        <div v-for="(feature, index) in devFeatures" :key="index" class="feature" :class="featureClass(feature)">
          <div v-if="feature.status == 'To Develop'" class="feature-header to-develop">
            Effort: {{ feature.effort }}
            <i class="fas fa-snowplow right" />
          </div>
          <div v-if="feature.status == 'Fixing Bugs'" class="feature-header fixing-bugs">
            Bug Effort: {{ feature.bugEffort }}
            <i v-if="feature.status == 'Fixing Bugs'" class="fas fa-bug right" />
          </div>
          <div>
            {{ feature.name }} <br>
            <span v-if="feature.fixingBugs">
              <i class="fas fa-bug" title="Fixing Bugs" />
            </span>
          </div>
          <div>
            <input type="checkbox" :id="'feature-select-' + feature.id" :checked="feature.selected" :disabled="team.inTest" @click="toggleSelectFeature(feature)">
          </div>
        </div>
      </div>
      <div class="col">
        <h6>
          In Test
        </h6>
        <div v-for="(feature, index) in testFeatures" :key="index" class="feature in-test">
          <div>
            {{ feature.name }}
          </div>
          <p>
            Unfixed Bugs: {{ unFixedBugs(feature) }}
          </p>
          <div>
            <div v-for="(bug, bindex) in feature.bugs" :key="bindex" class="bug" :class="{'fixed': bug.fixed}">
              <i class="fas fa-bug" :class="bug.severity" :title="bug.severity + ': ' + bugValues[bug.severity]" />
            </div>
          </div>
          <div class="buttons">
            <button v-if="feature.bugs.length" class="btn btn-sm btn-info" @click="fixBugsInFeature(feature)">
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

import stringFuns from '../../lib/stringFuns.js'

export default {
  data() {
    return {
      maxEffort: 30
    }
  },
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
    selectedFeatures() {
      return this.$store.getters.getSelectedFeatures
    },
    selectedEffort() {
      return this.$store.getters.getSelectedEffort
    },
    testFeatures() {
      return this.$store.getters.getFeaturesInTest
    },
    bugValues() {
      return this.$store.getters.getBugValues
    }
  },
  methods: {
    featureClass(feature) {
      let c = stringFuns.stringToClass(feature.status)
      if (feature.selected) {
        c = c + ' selected'
      }
      return c
    },
    featureIsSelected(feature) {
      return !!this.selectedFeatures.find(function(f) {
        return f.id == feature.id
      })
    },
    unFixedBugs(feature) {
      let bugs = 0
      for (let i = 0; i < feature.bugs.length; i++) {
        if (!feature.bugs[i].fixed) {
          bugs = bugs + 1
        }
      }
      return bugs
    },
    effort(feature) {
      return feature.status == 'To Develop' ? feature.effort : feature.bugEffort
    },
    toggleSelectFeature(feature) {
      const selected = document.getElementById('feature-select-' + feature.id).checked
      if (selected  && this.selectedEffort + this.effort(feature) > this.maxEffort) {
        alert('You cannot select more than 30 units of effort')
        document.getElementById('feature-select-' + feature.id).checked = false
      } else {
        bus.$emit('sendSelectFeatureToDevelop', {gameId: this.game.id, teamId: this.team.id, featureId: feature.id, selected: selected})
      }
    },
    sendFeaturesToTest() {
      const featureIds = []
      for (let i = 0; i < this.selectedFeatures.length; i++) {
        featureIds.push(this.selectedFeatures[i].id)
      }
      bus.$emit('sendFeaturesToTest', {gameId: this.game.id, teamId: this.team.id, featureIds: featureIds})
    },
    testFeature(feature) {
      bus.$emit('sendTestFeature', {gameId: this.game.id, teamId: this.team.id, featureId: feature.id})
    },
    fixBugsInFeature(feature) {
      bus.$emit('sendFixBugsInFeature', {gameId: this.game.id, teamId: this.team.id, featureId: feature.id})
    },
    deliverFeature(feature) {
      bus.$emit('sendDeliverFeature', {gameId: this.game.id, teamId: this.team.id, featureId: feature.id})
    },
    nextSprint() {
      bus.$emit('sendNextSprint', {gameId: this.game.id, teamId: this.team.id})
    }
  }
}
</script>

<style lang="scss">
  .dev-team {

    .feature {
      margin: 6px;
      border: 1px solid;
      width: 130px;
      display: inline-block;

      &.to-develop {
        border-color: green;
      }

      &.fixing-bugs {
        border-color: red;
      }

      &.in-test {
        height: 190px;
      }

      &.selected {
        color: #fff;
        background-color: green;
      }

      .feature-header {
        text-align: right;
        padding: 0 4px;
        color: #fff;

        &.to-develop {
          background-color: green
        }

        &.fixing-bugs {
          background-color: red
        }
      }

      .bug {
        display: inline-block;
        padding: 2px;
        margin: 2px;

        &.fixed {
          background-color: green;
          color: #fff;
        }

        .critical {
          color: red;
        }
        .major {
          color: darkorange;
        }
        .minor {
          color: darkseagreen;
        }
        .cosmetic {
          color: lightgrey;
        }
      }

      .buttons {
        text-align: center;
        margin: 4px 0;
      }
    }
  }
</style>
