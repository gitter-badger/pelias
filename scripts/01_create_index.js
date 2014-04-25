
var client = require('../esclient'),
    schema = require('../config/schema.json');

var debug = client.errorHandler( console.log );

client.indices.create( { index: 'pelias', body: schema }, debug );