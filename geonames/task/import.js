
var fs = require('fs'),
    request = require('request'),
    unzip = require('unzip'),
    geonames = require('../geonames'),
    esclient = require('../esclient'),
    admin1_data = require('../geonames/data/admin1.json'),
    admin2_data = require('../geonames/data/admin2.json');

var columns = [
  '_id','name','asciiname','alternatenames','latitude','longitude','feature_class',
  'feature_code','country_code','cc2','admin1_code','admin2_code','admin3_code',
  'admin4_code', 'population','elevation','dem','timezone','modification_date'
];

module.exports = function (country_code) {

  var source = fs.existsSync('geonames/data/allCountries.zip')
    ? fs.createReadStream('geonames/data/allCountries.zip')
    : request.get('http://download.geonames.org/export/dump/allCountries.zip');

  source
    .pipe(unzip.Parse())
    .on('entry', function (entry) {
      entry.pipe(
        geonames.parser({ columns: columns }, function( row, index ) {

          esclient.stream.write(
            JSON.stringify({
              _index: 'pelias', _type: 'geoname', _id: data._id,
              data: {
                name: data.name,
                alternate_names: alternate_names(data),
                country_code: data.country_code,
                admin1_code: data.admin1_code,
                admin1_name: admin1_name(data),
                admin2_code: data.admin2_code,
                admin2_name: admin2_name(data),
                population: data.population,
                center_point: { lat: data.latitude, lon: data.longitude },
                suggest: {
                  input: data.name,
                  output: data.name,
                  payload: {}
                }
              }
            })
          );

        })
      );
    });
});

function admin1_name(data) {
  var admin1_entry = admin1_data[data.country_code+'.'+data.admin1_code];
  if (admin1_entry != null) {
    return admin1_entry['name'];
  }
}

function admin2_name(data) {
  var admin2_entry = admin2_data[data.country_code+'.'+data.admin1_code+'.'+data.admin2_code]
  if (admin2_entry != null) {
    return admin2_entry['name'];
  }
}

function alternate_names(data) {
  if (data.alternatenames != '' && data.alternatenames != null) {
    return data.alternatenames.split(',');
  }
}
