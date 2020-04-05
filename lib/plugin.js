import Doclify from '@doclify/javascript'

const resolveRuntimeEnv = (name, ctx) => {
  return ctx.app.$env ? ctx.app.$env[name] : null
}

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
  if (process.browser && <%= options.proxy %>) {
    delete doclifyOptions.repository
    doclifyOptions.url = '/doclify'
  }

  const doclify = new Doclify(doclifyOptions)

  // share doclify instance with middleware
  if (process.server && <%= options.proxy %>) {
    process.$doclify = doclify
  }

  // Inject axios to the context as $axios
  ctx.$doclify = doclify
  inject('doclify', doclify)
}