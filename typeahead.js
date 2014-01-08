$(function() {
  $('#typeahead').typeahead([
    {
      name: 'suggestions',
      remote: {
        url: 'http://api-pelias-test.mapzen.com/suggest?query=%QUERY',
        filter: function (geojsonResponse) {
          var arr = [];
          var features = geojsonResponse.features;
          for (key in geojsonResponse.features) {
            if (geojsonResponse.features.hasOwnProperty(key)) {
              obj = geojsonResponse.features[key];
              arr.push({
                value: obj.properties.title,
                lonlat: obj.geometry.coordinates,
                type: obj.properties.description
              });
            }
          }
          return arr;
        }
      },
      template: [
        '<p class="result-type">{{type}}</p>',
        '<p class="result-text">{{value}}</p>',
        '<p class="result-latlng">{{lonlat}}</p>'
      ].join(''),
      engine: Hogan
    }
  ])
}).bind('typeahead:selected', function (obj, datum) {
    console.log(map);
    var marker = L.marker([datum.lonlat[1], datum.lonlat[0]]).addTo(map);
    map.panTo([datum.lonlat[1], datum.lonlat[0]]);
    if (datum.type=='address' || datum.type=='poi') {
      map.setZoom(17);
    }
    else if (datum.type=='street') {
      map.setZoom(15);
    }
    else {
      map.setZoom(13);
    }
});;
