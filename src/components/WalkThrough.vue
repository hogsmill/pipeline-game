<template>
  <span>
    <button class="btn btn-sm btn-secondary smaller-font" @click="show()">
      Explain this for me
    </button>
  </span>
</template>

<script>
export default {
  methods: {
    show() {
      this.$store.dispatch('showModal', 'walkThrough')
    }
  }
}
</script>
