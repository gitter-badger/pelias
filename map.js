var map;

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
    $('#query').val(query);
    var query_string = '/search?query=' + query;
    $.ajax({
      type: 'GET',
      dataType: "json",
      url: 'http://api-pelias-test.mapzen.com' + query_string,
      success: function(geoJson) {
        var markerLayer = L.mapbox.markerLayer(geoJson);
        markerLayer.addTo(map);
        map.fitBounds(markerLayer.getBounds());
        var description = geoJson.features[0].properties.description;
        if (description=='address' || description=='poi') {
          map.setZoom(17);
        }
        else if (description=='street') {
          map.setZoom(15);
        }
        else {
          map.setZoom(13);
        }
      }
    });
  }
});
