import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin, addTemplate, addAutoImport, addServerMiddleware } from '@nuxt/kit'
import Doclify, { DoclifyOptions } from '@doclify/javascript'
import DoclifyProxy, { DoclifyProxyOptions } from '@doclify/proxy'
import defu from 'defu'

export interface ModuleOptions extends DoclifyOptions {
  proxy?: DoclifyProxyOptions
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@doclify/nuxt',
    configKey: 'doclify',
    compatibility: {
      nuxt: '^3.0.0',
      bridge: false,
    },
  },
  defaults: {

  },
  setup(options, nuxt) {
    nuxt.options.publicRuntimeConfig.doclify = defu(nuxt.options.publicRuntimeConfig.doclify, {
      key: options.key,
      repository: options.repository,
      url: options.url,
      timeout: options.timeout,
      language: options.language,
      proxy: options.proxy,
    })

    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)
    addPlugin(resolve(runtimeDir, 'plugin'))

    nuxt.hook('autoImports:dirs', (dirs) => {
      dirs.push(resolve(runtimeDir, 'composables'))
    })

    if (options.proxy) {
      addServerMiddleware(resolve(runtimeDir, 'middleware'))
    }
  },
})

declare module '@nuxt/schema' {
  interface ConfigSchema {
    privateRuntimeConfig?: {
      DOCLIFY_URL?: string
      DOCLIFY_REPOSITORY?: string
      DOCLIFY_KEY?: string
    }

    publicRuntimeConfig?: {
      DOCLIFY_URL?: string
      DOCLIFY_REPOSITORY?: string
      DOCLIFY_KEY?: string
      doclify?: ModuleOptions
    }
  }
}
