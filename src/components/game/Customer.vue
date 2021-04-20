<template>
  <div v-if="team.id" class="customer">
    <h2>
      Customer
    </h2>
    <h3>
      Score: {{ featuresScore() - dayScore() - bugsScore() }}
    </h3>
    <div>
      <i class="fas fa-check-circle features-score" title="↑ for features" /> {{ featuresScore() }},
      <i class="far fa-calendar-alt" title="5 ↓ per day" /> -{{ dayScore() }},
      <i class="fas fa-bug bugs-score" title="↓ for bugs" /> -{{ bugsScore() }}
      (<i class="fas fa-bug bugs-not-seen-score" title="bugs not seen" /> <i>{{ bugsNotSeenScore() }}</i>)
    </div>
    <div v-for="(feature, index) in features" :key="index" class="feature">
      <div v-if="feature.customer">
        <div :class="{ 'delivered': feature.status == 'Delivered' }">
          <span v-if="feature.status == 'Delivered'">{{ feature.name }}</span>
          (<i class="fas fa-check-circle features-score" title="value to customer" /> {{ feature.customer }},
          <i class="fas fa-bug bugs-score" title="bugs seen" /> {{ featureBugsScore(feature) }},
          <i class="fas fa-bug bugs-not-seen-score" title="bugs seen" /> {{ featureBugsNotSeenScore(feature) }})
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../../socket.js'

export default {
  computed: {
    features() {
      return this.$store.getters.getFeaturesDelivered
    },
    bugValues() {
      return this.$store.getters.getBugValues
    },
    team() {
      return this.$store.getters.getTeam
    }
  },
  methods: {
    dayScore() {
      return (this.team.day - 1) * 5
    },
    featuresScore() {
      let score = 0
      for (let i = 0; i < this.features.length; i++) {
        score = score + this.features[i].customer
      }
      return score
    },
    bugsScore() {
      let score = 0
      for (let i = 0; i < this.features.length; i++) {
        const bugs = this.features[i].bugs
        for (let j = 0; j < bugs.length; j++) {
          if (!bugs[j].fixed && bugs[j].seen) {
            score = score + this.bugValues[bugs[j].severity]
          }
        }
      }
      return score
    },
    bugsNotSeenScore() {
      let score = 0
      for (let i = 0; i < this.features.length; i++) {
        const bugs = this.features[i].bugs
        for (let j = 0; j < bugs.length; j++) {
          if (!bugs[j].fixed && !bugs[j].seen) {
            score = score + this.bugValues[bugs[j].severity]
          }
        }
      }
      return score
    },
    featureBugsScore(feature) {
      let score = 0
      for (let i = 0; i < feature.bugs.length; i++) {
        if (!feature.bugs[i].fixed && feature.bugs[i].seen) {
          score = score + this.bugValues[feature.bugs[i].severity]
        }
      }
      return score
    },
    featureBugsNotSeenScore(feature) {
      let score = 0
      for (let i = 0; i < feature.bugs.length; i++) {
        if (!feature.bugs[i].fixed && !feature.bugs[i].seen) {
          score = score + this.bugValues[feature.bugs[i].severity]
        }
      }
      return score
    }
  }
}
</script>

<style lang="scss">
  .customer {

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

      .delivered {
        border: 1px solid;
      }
    }
  }
</style>
