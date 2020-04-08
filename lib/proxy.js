const url = require('url')
const Doclify = require('@doclify/javascript')

let doclifyOptions = null

const resolveDoclify = () => {
  if (!process.$doclify) {
    process.$doclify = new Doclify(doclifyOptions)
  }

  return process.$doclify
}

const handleWebook = function (req, res) {
  if (req.headers['x-doclify-token'] === process.env.DOCLIFY_WEBHOOK_TOKEN) {
    resolveDoclify().cache.reset()
  } else {
    res.statusCode = 403
  }

  res.end()
}

const handleProxy = async function (req, res) {
  // eslint-disable-next-line node/no-deprecated-api
  const { query, pathname } = url.parse(req.url, true)

  // normalize query
  for (const name in query) {
    if (!isNaN(query[name])) {
      query[name] = Number(query[name])
    }
  }

  res.setHeader('Content-Type', 'application/json')

  let json

  try {
    const cached = req.headers['x-cache']
    const requestType = cached ? 'cachedRequest' : 'request'

    const data = await resolveDoclify()[requestType](
      pathname.replace(/^\//, ''),
      {
        params: query
      }
    )

    json = JSON.stringify(data)
  } catch (err) {
    res.statusCode = err.code > 0 ? err.code : 500

    json = JSON.stringify(err.data || {})
  }

  res.setHeader('Content-Length', Buffer.byteLength(json, 'utf8'))
  res.end(json, 'UTF-8')
}

const handler = function (req, res) {
  if (req.url === '/webhook') {
    return handleWebook(req, res)
  } else {
    return handleProxy(req, res)
  }
}

module.exports = function (options) {
  doclifyOptions = options

  return handler
}
