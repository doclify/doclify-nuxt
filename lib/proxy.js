const url = require('url')

let $doclify

const handler = async function (req, res) {
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
    const data = await $doclify.cachedRequest(
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

module.exports = function (doclify) {
  $doclify = doclify

  return handler
}
