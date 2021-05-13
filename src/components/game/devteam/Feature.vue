<template>
  <div class="dev-team-feature" :class="devComplete(feature)">
    <div v-if="feature.status == 'To Develop'" class="feature-header to-develop">
      {{ feature.effortDone + feature.selectedBy.length * 10 }}/{{ feature.effort }}
    </div>
    <div v-if="feature.status == 'Fixing Bugs'" class="feature-header fixing-bugs">
      {{ feature.bugEffortDone + feature.selectedBy.length * 10 }}/{{ feature.bugEffort }}
    </div>
    <div class="feature-title">
      <span v-if="feature.status == 'To Develop'">
        <i class="fas fa-snowplow" />
      </span>
      <span v-if="feature.status == 'Fixing Bugs'">
        <i class="fas fa-bug" />
      </span>
      {{ feature.name }}
    </div>
    <div>
      <div class="pattern" :style="{
        'background-position-x': feature.column * -50 + 'px',
        'background-position-y': feature.row * -25 + 'px'
      }"
      />
    </div>
    <div>
      <div v-for="(member, index) in team.members" :key="index" class="members">
        <div v-if="myName.id == member.id" class="feature-select rounded-circle" :class="{ 'selected': featureSelected(member) }" @click="toggleSelectFeature()" />
        <div v-if="myName.id != member.id" class="feature-select other rounded-circle" :class="{ 'selected': featureSelected(member) }" />
        {{ member.name }}
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../../../socket.js'

export default {
  props: [
    'feature'
  ],
  computed: {
    game() {
      return this.$store.getters.getGame
    },
    team() {
      return this.$store.getters.getTeam
    },
    myName() {
      return this.$store.getters.getMyName
    }
  },
  methods: {
    effort() {
      return this.feature.selectedBy.length * 10
    },
    devComplete(feature) {
      let str = ''
      if (feature.status == 'To Develop' && feature.effortDone + feature.selectedBy.length * 10 == feature.effort) {
        str = 'dev-complete dev'
      } else if (feature.status == 'Fixing Bugs' && feature.bugEffortDone + feature.selectedBy.length * 10 == feature.bugEffort) {
        str = 'dev-complete bug'
      }
      return str
    },
    featureSelected(member) {
      return this.feature.selectedBy.find((m) => {
        return member.id == m.id
      })
    },
    toggleSelectFeature() {
      const selected = !this.featureSelected(this.myName)
      bus.$emit('sendSelectFeatureToDevelop', {gameId: this.game.id, teamId: this.team.id, featureId: this.feature.id, member: this.myName, selected: selected})
    }
  }
}
</script>

<style lang="scss">
  .dev-team-feature {
    box-shadow: 2px 2px 3px #aaa;

    .feature-title {
      i {
        float: left;
        padding: 3px;
      }
    }

    &.dev-complete {
      color: #fff;

      &.dev {
        background-color: green;
      }
      &.bug {
        background-color: red;
      }
    }

    .fa-snowplow {
      color: green;
    }

    .fa-bug {
      color: red;
    }

    .pattern {
      margin: 0 auto;
      height: 25px;
      width: 50px;
      background-image: url("../../../assets/img/background-pattern-small.png");
    }

    .members {
      text-align: left;
      margin: 0 auto;

      .feature-select {
        width: 12px;
        height: 12px;
        margin: 2px 2px 2px 6px;
        border: 1px solid;
        display: inline-block;
        vertical-align: middle;

        &.other {
          color: #888;
        }

        &.selected {
          background-color: #444;
        }
      }
    }
  }
</style>
