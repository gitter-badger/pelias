var map, activeResult;
var markers = [];
var searchResults = [];

function create_marker(obj) {
  var lonlat = [obj.geometry.coordinates[1], obj.geometry.coordinates[0]]
  var type = obj.properties.description;
  for (i=0; i<markers.length; i++) {
    map.removeLayer(markers[i]);
  }
  marker = L.marker(lonlat);
  markers.push(marker);
  map.addLayer(marker);
  map.panTo(lonlat);
  if (type=='address' || type=='poi') {
    map.setZoom(17);
  }
  else if (type=='street') {
    map.setZoom(15);
  }
  else {
    map.setZoom(13);
  }
}

function showForward() {
  $('#forward').tab('show');
  $('#reverse-form').hide();
  $('#forward-form').show();
}

function showReverse() {
  $('#reverse').tab('show');
  $('#forward-form').hide();
  $('#reverse-form').show();
}

$(function() {
  map = L.mapbox.map('map', 'randyme.gajlngfe').setView([40.7722, -73.9349], 13);
  if (location.search != '') {
    var $_GET = {};
    document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
      function decode(s) {
        return decodeURIComponent(s.split("+").join(" "));
      }
      $_GET[decode(arguments[1])] = decode(arguments[2]);
    });
    var query = $_GET.query;
    $('#typeahead').val(query);
    var query_string = '/search?query=' + query;
    $.ajax({
      type: 'GET',
      dataType: "json",
      url: 'http://pelias.test.mapzen.com' + query_string,
      success: function(geoJson) {
        create_marker(geoJson.features[0]);
        for (key in geoJson.features) {
          if (geoJson.features.hasOwnProperty(key)) {
            obj = geoJson.features[key];
            searchResults.push(obj);
            $('#search-results').append('<a href="#" class="list-group-item" id="'+'search-result-'+key+'"><h4 class="list-group-item-heading">'+obj.properties.title+'</h4><p class="list-group-item-text">'+obj.properties.description+'</p></a>');
            $('#search-result-'+key).click({key: key}, function(event) {
              var result = searchResults[event.data.key];
              create_marker(result);
              if (activeResult != null) {
                $(activeResult).toggleClass('active');
              }
              activeResult = '#search-result-'+event.data.key;
              $('#search-result-'+event.data.key).toggleClass('active');
            });
          }
        }
        $('#search-result-0').toggleClass('active');
        activeResult = '#search-result-0';
      }
    });
  }

  $('#typeahead').typeahead([{
    name: 'suggestions',
    remote: {
      url: 'http://pelias.test.mapzen.com/suggest?query=%QUERY',
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
  }]).bind('typeahead:selected', function (obj, datum) {
    var lonlat = [datum.lonlat[1], datum.lonlat[0]]
    for (i=0; i<markers.length; i++) {
      map.removeLayer(markers[i]);
    }
    marker = L.marker(lonlat);
    markers.push(marker);
    map.addLayer(marker);
    map.panTo(lonlat);
    map.panTo(lonlat);
    if (datum.type=='address' || datum.type=='poi') {
      map.setZoom(17);
    }
    else if (datum.type=='street') {
      map.setZoom(15);
    }
    else {
      map.setZoom(13);
    }
  });
});
