import { defineEventHandler } from 'h3'
import type { RuntimeConfig } from 'nuxt/schema'
import { DoclifyProxy, type DoclifyProxyOptions } from '@doclify/proxy'
import { useRuntimeConfig } from 'nitropack/runtime'

let proxyInstance: DoclifyProxy | undefined

function getProxy(config: RuntimeConfig): DoclifyProxy {
  if (!proxyInstance) {
    const doclifyConfig = config.doclify

    const baseUrl = config.app.baseURL.replace(/\/$/, '')

    const options = {
      url: doclifyConfig.url,
      repository: doclifyConfig.repository,
      key: doclifyConfig.key,
      ...doclifyConfig.proxy,
    } as DoclifyProxyOptions

    // prepend base path
    options.path = baseUrl + options.path

    proxyInstance = new DoclifyProxy(options)
  }

  return proxyInstance
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  return getProxy(config)
    .middleware(event.node.req, event.node.res) as any
})
