
var client = require('pelias-esclient'),
    schema = require('../config/schema.json');

var debug = client.errorHandler( console.log );

client.indices.create( { index: 'pelias', body: schema }, function( err, res ){
  debug( err, res );
  process.exit(0);
});