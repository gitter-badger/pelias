
var client = require('pelias-esclient')(),
    schema = require('../config/schema.json');

var debug = client.errorHandler( console.log );
var TYPE = 'admin1'

client.indices.deleteMapping( { index: 'pelias', type: TYPE }, function( err, res ){
  debug( err, res );
  client.indices.putMapping( { index: 'pelias', type: TYPE, body:schema.mappings[TYPE] }, function( err, res ){
    debug( err, res );
    process.exit(0);
  });
});