import Doclify from '@doclify/javascript'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const options: Record<string, any> = {
    ...config.public.doclify,
    proxy: undefined
  }

  const path = config.app.baseURL.replace(/\/$/, '') + '/doclify'

  if (config.public.doclify.proxy) {
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
