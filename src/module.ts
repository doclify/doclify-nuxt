import { defineNuxtModule, addPlugin, addServerHandler, addImportsDir, createResolver } from '@nuxt/kit'
import type { DoclifyOptions } from '@doclify/javascript'
import type Doclify from '@doclify/javascript'
import type { DoclifyProxyOptions } from '@doclify/proxy'
import { defu } from 'defu'

export interface ModuleOptions extends DoclifyOptions {
  proxy?: DoclifyProxyOptions
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@doclify/nuxt',
    configKey: 'doclify',
  },
  defaults: {
    repository: process.env.DOCLIFY_REPOSITORY ?? '',
    key: process.env.DOCLIFY_KEY ?? '',
    url: process.env.DOCLIFY_URL ?? '',
    proxy: {
      path: process.env.DOCLIFY_PROXY_PATH ?? '/doclify',
      webhookToken: process.env.DOCLIFY_PROXY_WEBHOOK_TOKEN ?? '',
      cache: process.env.NODE_ENV === 'production'
        ? {
            driver: {

              type: process.env.DOCLIFY_PROXY_CACHE_DRIVER_TYPE ?? 'memory',
              redis: {
                host: process.env.DOCLIFY_PROXY_CACHE_DRIVER_REDIS_HOST ?? '',
                port: process.env.DOCLIFY_PROXY_CACHE_DRIVER_REDIS_PORT ?? 6379,
              },
            },

          }
        : undefined,
    } as DoclifyProxyOptions,
  },
  setup(options, nuxt) {
    nuxt.options.runtimeConfig.doclify = defu(nuxt.options.runtimeConfig.doclify, {
      key: options.key,
      repository: options.repository,
      url: options.url,
      timeout: options.timeout,
      language: options.language,
      proxy: options.proxy,
    })

    nuxt.options.runtimeConfig.public.doclify = defu(nuxt.options.runtimeConfig.public.doclify, {
      key: options.proxy ? undefined : options.key,
      repository: options.proxy ? undefined : options.repository,
      url: options.url,
      timeout: options.timeout,
      language: options.language,
      proxy: !!options.proxy,
    }) as any

    const resolver = createResolver(import.meta.url)
    nuxt.options.build.transpile.push(resolver.resolve('runtime'))

    addPlugin(resolver.resolve('runtime/plugin'))
    addImportsDir(resolver.resolve('runtime/composables'))

    nuxt.hook('listen', (_, listener) => {
      if (listener && listener.url) {
        const url = new URL(listener.url)
        process.env.DOCLIFY_PORT = url.port
      }
    })

    if (options.proxy) {
      addServerHandler({
        route: options.proxy.path + '/**',
        handler: resolver.resolve('runtime/server/middleware'),
      })
    }
  },
})

declare module '@nuxt/schema' {
  interface NuxtApp {
    $doclify: Doclify
  }

  interface PrivateRuntimeConfig {
    doclify: ModuleOptions
  }

  interface PublicRuntimeConfig {
    doclify: DoclifyOptions & { proxy: boolean }
  }
}
