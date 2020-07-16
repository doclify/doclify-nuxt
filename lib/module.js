const path = require('path')
const Doclify = require('@doclify/javascript')

function doclifyModule (_moduleOptions) {
  // Apply defaults
  const options = Object.assign({
    proxy: false,
    url: null,
    repository: null,
    token: null,
    key: null
  }, this.options.doclify || {}, _moduleOptions || {})

  const moduleOptions = {
    ...options
  }

  if (!moduleOptions.repository) {
    moduleOptions.repository = process.env.DOCLIFY_REPOSITORY
  }

  if (!moduleOptions.token && !moduleOptions.key) {
    moduleOptions.token = process.env.DOCLIFY_KEY || process.env.DOCLIFY_TOKEN
  }

  let $doclify

  // don't create instance during build, as env variables might not be present
  if (!this.nuxt.options._build || this.nuxt.options.dev) {
    $doclify = new Doclify(moduleOptions)
  }

  this.nuxt.hook('vue-renderer:ssr:prepareContext', (ssrContext) => {
    ssrContext.$doclify = $doclify
  })

  // Register plugin
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'doclify.js',
    options
  })

  // Proxy integration
  if (options.proxy) {
    this.addServerMiddleware({
      path: '/doclify',
      handler: require('./proxy')($doclify)
    })
  }
}

module.exports = doclifyModule
module.exports.meta = require('../package.json')
