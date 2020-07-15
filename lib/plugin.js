import Doclify from '@doclify/javascript'

export default (ctx, inject) => {
  const doclifyOptions = <%= JSON.stringify(options, null, 4) %>

  let doclify

  if (process.client) {
    const env = ctx.app.$env || process.env || {}

    if (!doclifyOptions.repository) {
      doclifyOptions.repository = env.DOCLIFY_REPOSITORY
    }

    if (!doclifyOptions.token && !doclifyOptions.key) {
      doclifyOptions.token = env.DOCLIFY_KEY || env.DOCLIFY_TOKEN
    }

    // handle proxy
    if (<%= options.proxy %>) {
      delete doclifyOptions.repository
      doclifyOptions.url = '/doclify'
    }

    doclify = new Doclify(doclifyOptions)
  } else {
    doclify = ctx.ssrContext.$doclify
  }

  ctx.$doclify = doclify
  inject('doclify', doclify)
}