import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin, addServerMiddleware } from '@nuxt/kit'
import Doclify, { DoclifyOptions } from '@doclify/javascript'
import { DoclifyProxyOptions } from '@doclify/proxy'
import defu from 'defu'

export interface ModuleOptions extends DoclifyOptions {
  proxy?: DoclifyProxyOptions
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@doclify/nuxt',
    configKey: 'doclify',
    compatibility: {
      nuxt: '^3.0.0 || ^2.15.0',
      bridge: true,
    },
  },
  defaults: {
    repository: process.env.DOCLIFY_REPOSITORY ?? '',
    key: process.env.DOCLIFY_KEY ?? '',
    url: process.env.DOCLIFY_URL ?? '',
    proxy: {
      path: process.env.DOCLIFY_PROXY_PATH ?? '/doclify',
      webhookToken: process.env.DOCLIFY_PROXY_WEBHOOK_TOKEN ?? '',
      cache: process.env.NODE_ENV === 'production' ? {
        driver: {
          type: process.env.DOCLIFY_PROXY_CACHE_DRIVER_TYPE as any ?? 'memory',
          redis: {
            host: process.env.DOCLIFY_PROXY_CACHE_DRIVER_REDIS_HOST ?? '',
            port: process.env.DOCLIFY_PROXY_CACHE_DRIVER_REDIS_PORT ?? 6379
          }
        },

      } : undefined
    }
  },
  setup(options, nuxt) {
    nuxt.options.runtimeConfig.doclify = defu(nuxt.options.runtimeConfig.doclify, {
      key: options.key,
      repository: options.repository,
      url: options.url,
      timeout: options.timeout,
      language: options.language,
      proxy: options.proxy
    })

    nuxt.options.runtimeConfig.public.doclify = defu(nuxt.options.runtimeConfig.public.doclify, {
      key: options.proxy ? undefined : options.key,
      repository: options.proxy ? undefined : options.repository,
      url: options.url,
      timeout: options.timeout,
      language: options.language,
      proxy: !!options.proxy
    })

    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)

    addPlugin(resolve(runtimeDir, 'plugin'))

    nuxt.hook('autoImports:dirs', (dirs) => {
      dirs.push(resolve(runtimeDir, 'composables'))
    })

    nuxt.hook('listen', (server) => {
      process.env.DOCLIFY_PORT = (server.address() as any).port
    })

    if (options.proxy) {
      addServerMiddleware({
        route: options.proxy.path + '/**',
        handler: resolve(runtimeDir, 'middleware')
      })
    }
  },
})

declare module 'nuxt3/dist/app/nuxt' {
  interface NuxtApp {
    $doclify: Doclify
  }
}

declare module '@nuxt/schema' {
  interface PrivateRuntimeConfig {
    doclify?: ModuleOptions
  }

  interface PublicRuntimeConfig {
    doclify?: DoclifyOptions & { proxy: boolean }
  }
}
