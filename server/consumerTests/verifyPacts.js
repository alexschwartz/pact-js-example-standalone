'use strict'

const getJSON = require('get-json')
const pact = require('@pact-foundation/pact-node')
require('./testProductsService')

var uriAllProdPacts = 'http://localhost:8080/pacts/provider/ProductService/latest/prod'
getJSON(uriAllProdPacts).then((allPacts) => {
  console.debug('parsed: ' + JSON.stringify(allPacts, null, 4))

  const pactUrls = allPacts._links.pacts.map(p => p.href)
  console.log('pactUris: ' + JSON.stringify(pactUrls, null, 4))

  const opts = {
      providerBaseUrl: 'http://localhost:3001', // where your service will be running during the test, either staging or localhost on CI
      providerStatesSetupUrl: 'http://localhost:3001/test/setup', // the url to call to set up states
      pactUrls: pactUrls, // the pacts to test against
      publishVerificationResult: false,
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
