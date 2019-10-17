'use strict'

const getJSON = require('get-json')
const pact = require('@pact-foundation/pact-node')
require('./testProductsService')

var uriAllProdPacts = 'http://localhost:8080/pacts/provider/ProductService/latest/prod'
getJSON(uriAllProdPacts).then((allPacts) => {
  console.log('parsed: ' + JSON.stringify(allPacts, null, 4))
  const pacts = allPacts._links.pacts
  console.log('pactUris: ' + JSON.stringify(pacts, null, 4))

  const pactUris = pacts.map(p => p.href)
  console.log('pactUris: ' + JSON.stringify(pactUris, null, 4))

  pacts.forEach((p) => {
    console.log('Validate pact ' + p.title+ '\n(' + p.href + ')')

    const opts = {
      providerBaseUrl: 'http://localhost:3001', // where your service will be running during the test, either staging or localhost on CI
      providerStatesSetupUrl: 'http://localhost:3001/test/setup', // the url to call to set up states
      pactUrls: [p.href], // the pacts to test against
      publishVerificationResult: true,
      providerVersion: '1.0.0'
    }

    console.log('options for verifyPacts: ' + JSON.stringify(opts, null, 4))

    pact.verifyPacts(opts).then(() => {
      console.log('success')
      process.exit(0)
    }).catch((error) => {
      console.log('failed', error)
      process.exit(1)
    })
  })
})
