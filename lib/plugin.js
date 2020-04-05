import Doclify from '@doclify/javascript'

export default (ctx, inject) => {
  const doclifyOptions = <%= JSON.stringify(options, null, 4) %>

  if (ctx.app.$env) {
    if (!doclifyOptions.repository) {
      doclifyOptions.repository = ctx.app.$env.DOCLIFY_REPOSITORY
    }

    if (!doclifyOptions.key) {
      doclifyOptions.key = ctx.app.$env.DOCLIFY_KEY
    }
  }

  if (process)

  // handle proxy
  if (process.client && <%= options.proxy %>) {
    delete doclifyOptions.repository
    doclifyOptions.url = '/doclify'
  }

  let doclify

  if (process.client) {
    doclify = new Doclify(doclifyOptions)
  } else {
    doclify = process.$doclify || new Doclify(doclifyOptions)

    if (<%= options.proxy %>) {
      process.$doclify = doclify
    }
  }

  // Inject axios to the context as $axios
  ctx.$doclify = doclify
  inject('doclify', doclify)
}