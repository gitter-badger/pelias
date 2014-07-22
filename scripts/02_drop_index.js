
var client = require('pelias-esclient')(),
    schema = require('../config/schema');

client.indices.delete( { index: 'pelias' }, function( err, res ){
  console.log( '[delete mapping]', '\t', 'pelias', err || '\t', res );
  process.exit( !!err );
});