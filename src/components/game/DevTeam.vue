<template>
  <div v-if="team.id" class="dev-team">
    <div class="row">
      <p class="bug-values">
        Bug Values:
        <span v-for="(severity, i) in Object.keys(bugValues)" :key="i" class="bug-value rounded" :class="severity">
          {{ bugLabel(severity) }}: {{ bugValues[severity] }}
        </span>
      </p>
    </div>
    <div class="row">
      <div class="col board">
        <h4>
          To Do ({{ devFeatures.length }})
        </h4>
        <div>
          <div>
            <button :disabled="team.inTest" class="btn btn-sm btn-info" @click="sendFeaturesToTest()">
              Submit to Test
            </button>
            <button class="btn btn-sm btn-info" @click="nextSprint()">
              Next {{ game.sprintLabel }}
            </button>
          </div>
        </div>
        <div>
          <div v-for="(member, mindex) in team.members" :key="mindex" class="member-selected rounded-circle" :class="{ 'selected': mindex < team.selected / 10}" />
        </div>
        <div v-for="(feature, findex) in devFeatures" :key="findex" class="feature" :class="featureClass(feature)">
          <Feature :feature="feature" />
        </div>
      </div>
      <div class="col board">
        <h4>
          In Test ({{ testFeatures.length }})
        </h4>
        <div v-for="(feature, index) in testFeatures" :key="index" class="feature in-test">
          <FeatureInTest :feature="feature" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../../socket.js'

import stringFuns from '../../lib/stringFuns.js'

import Feature from './devteam/Feature.vue'
import FeatureInTest from './devteam/FeatureInTest.vue'

export default {
  components: {
    Feature,
    FeatureInTest
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
    testFeatures() {
      return this.$store.getters.getFeaturesInTest
    },
    bugValues() {
      return this.$store.getters.getBugValues
    }
  },
  methods: {
    bugLabel(severity) {
      let label = ''
      switch(severity) {
        case 'critical':
          label = 'C'
          break
        case 'major':
          label = 'M'
          break
        case 'minor':
          label = 'm'
          break
        case 'cosmetic':
          label = 'c'
          break
      }
      return label
    },
    featureClass(feature) {
      let c = stringFuns.stringToClass(feature.status)
      if (feature.selected) {
        c = c + ' selected'
      }
      if (this.team.inTest) {
        c = c + ' status-in-test'
      }
      return c
    },
    featureIsSelected(feature) {
      return !!this.selectedFeatures.find((f) => {
        return f.id == feature.id
      })
    },
    effort(feature) {
      return feature.status == 'To Develop' ? feature.effort : feature.bugEffort
    },
    sendFeaturesToTest() {
      const featureIds = []
      for (let i = 0; i < this.selectedFeatures.length; i++) {
        featureIds.push(this.selectedFeatures[i].id)
      }
      bus.$emit('sendFeaturesToTest', {gameId: this.game.id, teamId: this.team.id, featureIds: featureIds})
    },
    nextSprint() {
      if (this.testFeatures.length) {
        const message = 'You still have items in test. Deliver them or return them to dev to fix bugs'
        bus.$emit('sendAlert', {gameId: this.game.id, teamId: this.team.id, severity: 'warning', message: message})
      } else if (this.team.sprint + 1 >= this.game.sprints) {
        const message = 'Game over; there are no sprints left'
        bus.$emit('sendAlert', {gameId: this.game.id, teamId: this.team.id, severity: 'warning', message: message})
      } else {
        bus.$emit('sendNextSprint', {gameId: this.game.id, teamId: this.team.id})
      }
    }
  }
}
</script>

<style lang="scss">

  $critical: red;
  $major: darkorange;
  $minor: darkgreen;
  $cosmetic: lightgrey;

  .dev-team {
    margin: 0 auto;

    .col {
      padding: 0;
    }

    .bug-values {
      margin: 20px auto 4px auto;
    }

    .board {
      border: 1px solid #bbb;

      h4 {
        padding: 3px;
        background-color: green;
        color: #fff;
      }
    }

    .member-selected {
      width: 12px;
      height: 12px;
      margin: 12px 2px 0 2px;;
      border: 1px solid;
      display: inline-block;

      &.selected {
        background-color: #444;
      }
    }

    .bug-value {
      color: #fff;
      padding: 2px;
      margin: 0 2px;
      display: inline-block;
      width: 45px;

      &.critical {
        background-color: $critical;
      }
      &.major {
        background-color: $major;
      }
      &.minor {
        background-color: $minor;;
      }
      &.cosmetic {
        background-color: $cosmetic;
        color: #444;
      }
    }

    .feature {
      margin: 6px;
      border: 1px solid;
      width: 130px;
      display: inline-grid;

      &.to-develop {
        border-color: green;
      }

      &.fixing-bugs {
        border-color: red;
      }

      &.status-in-test {
        opacity: 0.5;
      }

      &.in-test {
        height: 164px;
        border-color: green;
      }

      &.selected {
        color: #fff;
        background-color: green;
      }

      .feature-header {
        text-align: right;
        padding: 0 4px;
        color: #fff;
        background-color: green;

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
          i {
            color: #fff;
            opacity: 0.4;
          }
        }

        .critical {
          color: $critical;
        }
        .major {
          color: $major;
        }
        .minor {
          color: $minor;;
        }
        .cosmetic {
          color: $cosmetic;
        }
      }

      .buttons {
        text-align: center;
        margin: 4px 0;
      }
    }
  }
</style>
