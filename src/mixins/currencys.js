import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['powcurrencys'])
  },
  created () {
    if (!this.powcurrencys || !this.powcurrencys.length) {
      this.$store.dispatch('common/currency')
    }
  }
}
