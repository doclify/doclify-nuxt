export default {
  actions: {
    nuxtServerInit ({ commit }, ctx) {
      if (!ctx.$doclify) {
        throw new Error('$doclify is not defined!')
      }

      if (!ctx.app.$doclify) {
        throw new Error('$doclify is not defined!')
      }
    }
  }
}
