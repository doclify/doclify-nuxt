import Doclify from '@doclify/javascript'
import LRU from '@doclify/lru-cache'

const getEnv = (name, envs) => {
  for (let env of envs) {
    if (env[name]) {
      return env[name]
    }
  }

  return null
}

export default (ctx, inject) => {
  const options = <%= JSON.stringify(options, null, 4) %>

  // handle proxy
  if (process.client && options.proxy) {
    delete options.repository
    options.url = '/doclify'
  } else {
    const envs = [ctx.app.$config, ctx.app.$env, process.env].filter(item => item)

    if (!options.repository) {
      options.repository = getEnv('DOCLIFY_REPOSITORY', envs)
    }

    if (!options.token && !options.key) {
      options.token = getEnv('DOCLIFY_KEY', envs) || getEnv('DOCLIFY_TOKEN', envs)
    }

    if (!options.url) {
      options.url = getEnv('DOCLIFY_URL', envs)
    }
  }

  delete options.proxy

  if (options.cache) {
    if (process.client) {
      options.cache = new LRU(options.cache)
    } else {
      options.cache = ctx.ssrContext.$doclifyCache || new LRU(options.cache)
    }
  }

  const doclify = new Doclify(options)

  ctx.$doclify = doclify
  inject('doclify', doclify)
}