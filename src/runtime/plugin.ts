import { defineNuxtPlugin, NuxtApp, useRuntimeConfig } from '#app'

import Doclify from '@doclify/javascript'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public.doclify
  const options = {
    ...config,
    proxy: undefined
  }

  const path = config.app.baseURL.replace(/\/$/, '') + '/doclify'

  if (config.proxy) {
    options.repository = null
    options.key = null

    if (process.client) {
      options.url = path
    } else {
      const port = process.env.DOCLIFY_PORT || process.env.PORT || 3000
      options.url = `http://127.0.0.1:${port}${path}`
    }
  }

  const doclify = new Doclify(options)

  return {
    provide: {
      doclify
    }
  }
})
