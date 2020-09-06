const { resolve } = require('path')

require('dotenv').config()

module.exports = {
  rootDir: resolve(__dirname, '../..'),
  buildDir: resolve(__dirname, '.nuxt'),
  srcDir: __dirname,
  render: {
    resourceHints: false
  },
  modules: [
    { handler: require('../../') }
  ],
  doclify: {
    proxy: true,
    repository: process.env.DOCLIFY_REPOSITORY,
    key: process.env.DOCLIFY_KEY,
    cache: true
  },
  privateRuntimeConfig: {
    DOCLIFY_REPOSITORY: process.env.DOCLIFY_REPOSITORY,
    DOCLIFY_KEY: process.env.DOCLIFY_KEY
  }
}
