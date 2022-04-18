import { defineEventHandler } from 'h3'
import DoclifyProxy from '@doclify/proxy'
import { useRuntimeConfig } from '#nitro'

let proxyInstance: DoclifyProxy | undefined

const getProxy = (): DoclifyProxy => {
  if (!proxyInstance) {
    const config = useRuntimeConfig()
    const doclifyConfig = config.doclify

    const baseUrl = config.app.baseURL.replace(/\/$/, '')

    const options = {
      ...doclifyConfig.proxy
    }

    // prepend base path
    options.path = baseUrl + options.path

    options.url = options.url || doclifyConfig.url
    options.repository = options.repository || doclifyConfig.repository
    options.key = options.key || doclifyConfig.key

    proxyInstance = new DoclifyProxy(options)
  }

  return proxyInstance
}


export default defineEventHandler(({ req, res }) => {
  const proxy = getProxy()

  return proxy.middleware(req, res)
})
