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
  } else {
    options.url = `http://127.0.0.1:${process.env.PORT || 3000}${path}`
  }

  const doclify = new Doclify(options)

  return {
    provide: {
      doclify
    }
  }
})
