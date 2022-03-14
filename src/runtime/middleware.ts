import { IncomingMessage, ServerResponse } from 'http'
import DoclifyProxy from '@doclify/proxy'
import config from '#config'

let proxyInstance: DoclifyProxy | undefined

const getProxy = (): DoclifyProxy => {
  if (!proxyInstance) {
    const doclifyConfig = config.doclify

    const options = {
      ...doclifyConfig.proxy
    }

    options.url = options.url || doclifyConfig.url || config.DOCLIFY_URL
    options.repository = options.repository || doclifyConfig.repository || config.DOCLIFY_REPOSITORY
    options.key = options.key || doclifyConfig.key || config.DOCLIFY_KEY

    proxyInstance = new DoclifyProxy(options)
  }

  return proxyInstance
}

export default async function(req: IncomingMessage, res: ServerResponse) {
  const proxy = getProxy()

  await new Promise<void>((resolve, reject) => {
    const next = (err?: unknown) => {
      if (err) {
        return reject(err)
      }

      return resolve()
    }

    return proxy.middleware(req, res, next)
  })
}