
var client = require('pelias-esclient')(),
    schema = require('../config/schema.json');

client.indices.create( { index: 'pelias', body: schema }, function( err, res ){
  console.log( '[put mapping]', '\t', 'pelias', err || '\t', res );
  process.exit( !!err );
});