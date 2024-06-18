import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['regions'])
  },
  created () {
    if (!this.regions || !this.regions.length) {
      this.$store.dispatch('common/region')
    }
  }
}
