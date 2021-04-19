<template>
  <div class="customer">
    <h1>
      Customer
    </h1>
    <div v-if="features">
      <div class="feature-positive">
        Plus for features: {{ featuresScore() }}
      </div>
      <div class="bug-negative">
        Minus for bugs: {{ bugsScore() }}
      </div>
    </div>
    <div v-for="(feature, index) in features" :key="index" class="feature">
      <div v-if="feature.customer">
        <div :class="{ 'delivered': feature.status == 'Delivered' }">
          <span v-if="feature.status == 'Delivered'">{{ feature.name }}</span>
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
    }
  },
  methods: {
    featuresScore() {
      let score = 0
      for (let i = 0; i < this.features.length; i++) {
        if (this.features[i].customer) {
          score = score + 100
        }
      }
      return score
    },
    bugsScore() {
      let score = 0
      for (let i = 0; i < this.features.length; i++) {
        if (this.features[i].customer) {
          const bugs = this.features[i].bugs
          for (let j = 0; j < bugs.length; j++) {
            score = score + this.bugValues[bugs[j].severity]
          }
        }
      }
      return score
    }
  }
}
</script>

<style lang="scss">
  .customer {

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
