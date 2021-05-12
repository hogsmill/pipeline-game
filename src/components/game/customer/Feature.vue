<template>
  <div class="customer-feature" :class="{ 'not-wanted': !feature.customer }"
       :style="{
         'top': row(),
         'left': column(),
         'background-position-x': !feature.customer ? 0 : feature.column * -200 + 'px',
         'background-position-y': !feature.customer ? 0 : feature.row * -100 + 'px'
       }"
  >
    <div>
      <div :class="{ 'delivered': feature.status == 'Delivered' }">
        <span v-if="feature.status == 'Delivered'">{{ feature.name }}</span>
        (<i class="fas fa-check-circle features-score" title="value to customer" /> {{ feature.customer }},
        <i class="fas fa-bug bugs-score" title="bugs seen" /> {{ featureBugsScore(feature) }},
        <i class="fas fa-bug bugs-not-seen-score" title="bugs seen" /> {{ featureBugsNotSeenScore(feature) }})
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'feature'
  ],
  computed: {
    bugValues() {
      return this.$store.getters.getBugValues
    }
  },
  methods: {
    row() {
      return this.feature.row * 100 + 'px'
    },
    column() {
      return this.feature.column * 200 + 'px'
    },
    featureClass() {
      let classStr
      if (this.feature.customer) {
        classStr = 'r' + this.feature.row + '-c' + this.feature.column
      } else {
        classStr = 'not-wanted'
      }
      return classStr
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
  .customer-feature {
    border: 1px dashed #bbb;
    position: absolute;
    height: 100px;
    width: 200px;
    background-image: url("../../../assets/img/background-pattern.png");

    &.not-wanted {
      position: initial;
      margin: 5px;
      display: inline-grid;
      border: 1px solid #888;
    }
  }
</style>
