<template>
  <div class="dev-team-feature">
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
      <div class="pattern" :style="{
        'background-position-x': feature.column * -50 + 'px',
        'background-position-y': feature.row * -25 + 'px'
      }"
      />
    </div>
    <div>
      <div v-for="(member, index) in team.members" :key="index" class="members">
        <input type="checkbox" :disabled="myName.id != member.id" :checked="featureSelected()" @click="toggleSelectFeature()">
        {{ member.name }}
      </div>
    </div>
    <!--
    <div>
      <input type="checkbox" :id="'feature-select-' + feature.id" :checked="feature.selected" :disabled="team.inTest" @click="toggleSelectFeature(feature)">
    </div>
    -->
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
    },
    selectedEffort() {
      return this.$store.getters.getSelectedEffort
    }
  },
  methods: {
    effort() {
      return this.feature.selectedBy.length * 10
    },
    featureSelected() {
      const self = this
      return this.feature.selectedBy.find(function(m) {
        return self.myName.id == m.id
      })
    },
    toggleSelectFeature() {
      const selected = !this.featureSelected()
      if (selected  && this.effort(this.feature) + 10 > this.game.maxEffort) {
        const message = 'You cannot select more than 30 units of effort. You need to send the selected items to test'
        bus.$emit('sendAlert', {gameId: this.game.id, teamId: this.team.id, severity: 'error', message: message})
        //document.getElementById('feature-select-' + feature.id).checked = false
      } else {
        bus.$emit('sendSelectFeatureToDevelop', {gameId: this.game.id, teamId: this.team.id, featureId: this.feature.id, myName: this.myName, selected: selected})
      }
    }
    /*
    toggleSelectFeature(feature) {
      const selected = document.getElementById('feature-select-' + feature.id).checked
      if (selected  && this.selectedEffort + this.effort(feature) > this.game.maxEffort) {
        const message = 'You cannot select more than 30 units of effort. You need to send the selected items to test'
        bus.$emit('sendAlert', {gameId: this.game.id, teamId: this.team.id, severity: 'error', message: message})
        document.getElementById('feature-select-' + feature.id).checked = false
      } else {
        bus.$emit('sendSelectFeatureToDevelop', {gameId: this.game.id, teamId: this.team.id, featureId: feature.id, myName: this.myName, selected: selected})
      }
    }
    */
  }
}
</script>

<style lang="scss">
  .dev-team-feature {

    .pattern {
      margin: 0 auto;
      height: 25px;
      width: 50px;
      background-image: url("../../../assets/img/background-pattern-small.png");
    }

    .members {
      text-align: left;
      margin: 0 auto;
    }
  }
</style>
