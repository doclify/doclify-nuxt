const path = require('path')
const LRU = require('@doclify/lru-cache')

function doclifyModule (_moduleOptions) {
  // Apply defaults
  const options = Object.assign({
    proxy: false,
    url: null,
    repository: null,
    token: null,
    key: null,
    cache: null
  }, this.options.doclify || {}, _moduleOptions || {})

  if (options.cache) {
    options.cache = Object.assign({
      max: 1000,
      ttl: 30 * 1000
    }, typeof options.cache === 'object' ? options.cache : {})
  }

  const moduleOptions = {
    ...options
  }

  if (!moduleOptions.repository) {
    moduleOptions.repository = process.env.DOCLIFY_REPOSITORY
  }

  if (!moduleOptions.token && !moduleOptions.key) {
    moduleOptions.token = process.env.DOCLIFY_KEY || process.env.DOCLIFY_TOKEN
  }

  let $cache

  // don't create instance during build, as env variables might not be present
  const isBuild = this.nuxt.options._build && !this.nuxt.options.dev
  if (!isBuild) {
    if (options.cache) {
      $cache = new LRU(options.cache)
      moduleOptions.cache = $cache
    }

    // make instance globally available for use inside server middleware
    process.$doclifyCache = $cache
  }

  this.nuxt.hook('vue-renderer:ssr:prepareContext', (ssrContext) => {
    ssrContext.$doclifyCache = $cache
  })

  // Register plugin
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'doclify.js',
    options
  })

  // Proxy integration
  if (options.proxy && !isBuild) {
    this.addServerMiddleware({
      path: '/doclify',
      handler: require('./proxy')(moduleOptions)
    })
  }
}

module.exports = doclifyModule
module.exports.meta = require('../package.json')
