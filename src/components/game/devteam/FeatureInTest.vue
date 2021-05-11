<template>
  <div>
    <div class="feature-header">
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
      <button v-if="unFixedBugs(feature)" class="btn btn-sm btn-info" @click="fixBugsInFeature(feature)">
        Fix Bugs
      </button>
      <button class="btn btn-sm btn-info" @click="deliverFeature(feature)">
        Deliver
      </button>
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
     bugValues() {
       return this.$store.getters.getBugValues
     }
   },
   methods: {
     unFixedBugs(feature) {
       let bugs = 0
       for (let i = 0; i < feature.bugs.length; i++) {
         if (!feature.bugs[i].fixed) {
           bugs = bugs + 1
         }
       }
       return bugs
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
