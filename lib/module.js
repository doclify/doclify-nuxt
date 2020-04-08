const path = require('path')

function doclifyModule (_moduleOptions) {
  // Combine options
  const moduleOptions = { ...this.options.doclify, ..._moduleOptions }

  // Apply defaults
  const options = Object.assign({
    proxy: false,
    repository: null,
    key: null,
    webhookToken: null
  }, moduleOptions)

  // Register plugin
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'doclify.js',
    options
  })

  // Proxy integration
  if (options.proxy) {
    process.env.DOCLIFY_WEBHOOK_TOKEN = process.env.DOCLIFY_WEBHOOK_TOKEN || options.webhookToken

    this.addServerMiddleware({
      path: '/doclify',
      handler: require('./proxy')(options)
    })
  }
}

module.exports = doclifyModule
module.exports.meta = require('../package.json')
