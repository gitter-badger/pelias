
var client = require('pelias-esclient')(),
    schema = require('../config/schema.json');

var debug = client.errorHandler( console.log );

client.indices.delete( { index: 'pelias' }, function( err, res ){
  debug( err, res );
  process.exit(0);
});