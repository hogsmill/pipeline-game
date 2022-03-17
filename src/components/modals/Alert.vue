<template>
  <vue-final-modal name="alert" classes="modal-container" content-class="vfm__content modal-content alert" v-model="modals['alert']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide()" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4">
      <h4 :class="modalData.severity">
        <i v-if="modalData.severity == 'info'" class="info fas fa-info-circle" />
        <i v-if="modalData.severity == 'warning'" class="warning fas fa-exclamation-triangle" />
        <i v-if="modalData.severity == 'error'" class="error fas fa-exclamation-circle" />
        {{ title() }}
      </h4>
      <p>{{ modalData.message }}</p>
    </div>
    <button class="btn btn-sm btn-primary smaller-font" @click="hide()">
      Done
    </button>
  </vue-final-modal>
</template>

<script>
import bus from '../../socket.js'

import { VueFinalModal } from 'vue-final-modal'

export default {
  components: {
    VueFinalModal
  },
  data() {
    return {
      message: '',
      severity: ''
    }
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    modalData() {
      return this.$store.getters.getModalData
    }
  },
  mounted() {
    setTimeout(() => {
      this.hide()
    }, 3000)
  },
  methods: {
    hide() {
      this.$store.dispatch('hideModal', 'alert')
    },
    title() {
      let t = ''
      switch(this.severity) {
        case 'info':
          t = 'Info'
          break
        case 'warning':
          t = 'Warning'
          break
        case 'error':
          t = 'Error'
          break
      }
      return t
    }
  }
}
</script>

<style lang="scss">
.alert {
  h4 {
    color: #fff;

    &.info {
      background-color: green;
    }
    &.warning {
      background-color: orange;
    }
    &.error {
      background-color: red;
    }

    .fas {
      &.info {
        color: yellow;
      }
      &.warning {
        color: yellow;
      }
      &.error {
        color: #fff;
      }
    }
  }

  p {
    font-size: large;
  }
}
</style>
