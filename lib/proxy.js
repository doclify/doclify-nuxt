const url = require('url')

module.exports = async function (req, res) {
  // eslint-disable-next-line node/no-deprecated-api
  const { query, pathname } = url.parse(req.url, true)

  res.setHeader('Content-Type', 'application/json')

  let json

  try {
    const cached = req.headers['x-cache']
    const requestType = cached ? 'cachedRequest' : 'request'

    const data = await process.$doclify[requestType](
      pathname.replace(/^\//, ''),
      {
        params: query
      }
    )

    json = JSON.stringify(data)
  } catch (err) {
    res.statusCode = err.code > 0 ? err.code : 500

    json = JSON.stringify(err.data)
  }

  res.setHeader('Content-Length', Buffer.byteLength(json, 'utf8'))
  res.end(json, 'UTF-8')
}
