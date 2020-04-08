jest.setTimeout(60000)

const { Nuxt, Builder } = require('nuxt-edge')
const axios = require('axios')

const config = require('./fixture/nuxt.config')

let nuxt

const url = path => `http://localhost:3000${path}`

// const setupNuxt = async (config) => {
//   nuxt = new Nuxt(config)

//   // Spy addTemplate
//   // addTemplate = nuxt.moduleContainer.addTemplate = jest.fn(
//   //   nuxt.moduleContainer.addTemplate
//   // )

//   const build = new Builder(nuxt)

//   await build.validatePages()
//   await build.generateRoutesAndFiles()
//   await nuxt.listen(3000)
// }

const testSuite = () => {
  test('asyncData', async () => {
    const html = (await axios.get(url('/asyncData'))).data
    expect(html).toContain('collection')
  })

  test('mounted', async () => {
    const window = await nuxt.renderAndGetWindow(url('/mounted'))
    window.onNuxtReady(() => {
      const html = window.document.body.innerHTML
      expect(html).toContain('collectionbbb')
    })
  })
}

describe('module', () => {
  beforeAll(async () => {
    nuxt = new Nuxt(config)

    // Spy addTemplate
    // addTemplate = nuxt.moduleContainer.addTemplate = jest.fn(
    //   nuxt.moduleContainer.addTemplate
    // )

    await new Builder(nuxt).build()
    await nuxt.listen(3000)
  })

  afterAll(async () => {
    await nuxt.close()
  })

  testSuite()
})
