import { defineNuxtPlugin, NuxtApp, useRuntimeConfig } from '#app'

import Doclify from '@doclify/javascript'

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  const config = useRuntimeConfig()
  const options = {
    ...config.doclify,
    proxy: undefined
  }

  const path = config.app.baseURL.replace(/\/$/, '') + '/doclify'

  if (!config.doclify.proxy) {
    options.url = options.url || config.DOCLIFY_URL
    options.repository = options.repository || config.DOCLIFY_REPOSITORY
    options.key = options.key || config.DOCLIFY_KEY
  } else if (process.client) {
    options.url = path
    options.repository = null
    options.key = null
  } else {
    const port = process.env.DOCLIFY_PORT || process.env.PORT || 3000
    options.url = `http://127.0.0.1:${port}${path}`
    options.repository = null
    options.key = null
  }

  const doclify = new Doclify(options)

  return {
    provide: {
      doclify
    }
  }
})
