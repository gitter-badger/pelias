// GOOGLE ANALYTICS
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-47035811-1', 'mapzen.com');
ga('send', 'pageview');

var map, activeResult, browser_lat, browser_lng;
var markers = [];
var searchResults = [];

function setCoords() {
  var center = map.getCenter();
  $('#lon').val(center.lng);
  $('#lat').val(center.lat);
  $('#sort_ll').val(center.lng + ',' + center.lat);
  var bounds = map.getBounds();
  var ne = bounds._northEast.lng+','+bounds._northEast.lat;
  var sw = bounds._southWest.lng+','+bounds._southWest.lat;
  $('#filter_bb').val(ne+','+sw);
}

function create_marker(obj) {
  var lonlat = [obj.geometry.coordinates[1], obj.geometry.coordinates[0]];
  var type = obj.properties.type;
  for (i=0; i<markers.length; i++) {
    map.removeLayer(markers[i]);
  }
  marker = L.marker(lonlat);
  marker.bindPopup(getPopupText(obj));
  markers.push(marker);
  map.addLayer(marker);
  map.panTo(lonlat);
  marker.openPopup();
}

function getPopupText(obj) {
  var text = [];
  if (obj.properties.name != null) { text.push('<b>Name:</b> '+obj.properties.name) }
  if (obj.properties.neighborhood_name != null) { text.push('<b>Neighborhood:</b> '+obj.properties.neighborhood_name) }
  if (obj.properties.locality_name != null) { text.push('<b>Locality:</b> '+obj.properties.locality_name) }
  if (obj.properties.local_admin_name != null) { text.push('<b>Local admin:</b> '+obj.properties.local_admin_name) }
  if (obj.properties.admin2_name != null) { text.push('<b>Admin2:</b> '+obj.properties.admin2_name) }
  if (obj.properties.admin1_name != null) { text.push('<b>Admin1:</b> '+obj.properties.admin1_name) }
  if (obj.properties.admin1_abbr != null) { text.push('<b>Admin1 abbr:</b> '+obj.properties.admin1_abbr) }
  if (obj.properties.country_name != null) { text.push('<b>Country:</b> '+obj.properties.country_name) }
  if (obj.properties.country_code != null) { text.push('<b>Country code:</b> '+obj.properties.country_code) }
  return '<p>' + text.join('<br/>') + '</p>';
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

function getDescription(type) {
  if (type=='poi' || type=='address' || type=='street') {
    return "OSM: " + type;
  }
  else if (type == 'geoname') {
    return "Geoname";
  }
  else {
    return "Quattroshapes: " + type.replace('_', ' ');
  }
}

function getAdmin(obj) {
  var admin = [];
  if (obj.neighborhood_name!=null) { admin.push(obj.neighborhood_name) }
  if (obj.local_admin_name!=null) { admin.push(obj.local_admin_name) }
  else if (obj.locality_name!=null) { admin.push(obj.locality_name) }
  else if (obj.admin2_name!=null) { admin.push(obj.admin2_name) }
  if (obj.admin1_abbr!=null) { admin.push(obj.admin1_abbr) }
  return admin.join(", ");
}

$(function() {
  // MAP SETUP
  map = L.mapbox.map('map', 'randyme.gajlngfe').setView([40.73035,-73.98639], 15);
  map.on('move', setCoords);

  // SEARCH SETUP
  if (location.search != '') {
    var $_GET = {};
    document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
      function decode(s) {
        return decodeURIComponent(s.split("+").join(" "));
      }
      $_GET[decode(arguments[1])] = decode(arguments[2]);
    });
    if ($_GET.type=='reverse') {
      showReverse();
      $('#lon').val($_GET.lon);
      $('#lat').val($_GET.lat);
      var query_string = '/reverse?lat=' + $_GET.lat + '&lng=' + $_GET.lon;
      $.ajax({
        type: 'GET',
        dataType: "json",
        url: 'http://api-pelias-test.mapzen.com' + query_string,
        success: function(geoJson) {
          var lonlat = [$_GET.lon, $_GET.lat];
          var desc = getDescription(geoJson.level);
          var admin = getAdmin(geoJson);
          $('#geocoding-results').append(['<a href="#" class="list-group-item"><h4 class="list-group-item-heading">',
            geoJson.name+'</h4><p class="list-group-item-text">'+admin+'</p></a>'
          ].join(''));
          var lonlat = [$_GET.lat, $_GET.lon];
          for (i=0; i<markers.length; i++) {
            map.removeLayer(markers[i]);
          }
          marker = L.marker(lonlat);
          markers.push(marker);
          map.addLayer(marker);
          map.panTo(lonlat);
        }
      });
    }
    else {
      $('#typeahead').val($_GET.query);
      var query_string = '/search?query=' + $_GET.query;
      if ($_GET.sort=='on') {
        query_string += '&center='+$_GET.sort_ll;
      }
      if ($_GET.filter=='on') {
        query_string += '&viewbox='+$_GET.filter_bb;
      }
      $.ajax({
        type: 'GET',
        dataType: "json",
        url: 'http://api-pelias-test.mapzen.com' + query_string,
        success: function(geoJson) {
          create_marker(geoJson.features[0]);
          for (key in geoJson.features) {
            if (geoJson.features.hasOwnProperty(key)) {
              obj = geoJson.features[key];
              searchResults.push(obj);
              var admin = getAdmin(obj.properties);
              var desc = getDescription(obj.properties.type);
              $('#search-results').append(['<a href="#" class="list-group-item" id="'+'search-result-'+key+'">',
                '<h4 class="list-group-item-heading">'+obj.properties.name+'</h4><p class="list-group-item-text">',
                admin+'</p></a>'
              ].join(''));
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
  }
  else {
    // CURRENT LOCATION
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          map.setView([position.coords.latitude, position.coords.longitude])
        },
        function(msg) {
          console.log(msg);
        }
      );
    }
  }
  $('#typeahead').typeahead([{
    name: 'suggestions',
    remote: {
      url: 'http://api-pelias-test.mapzen.com/suggest?size=10&query=%QUERY',
      filter: function (geojsonResponse) {
        var arr = [];
        var features = geojsonResponse.features;
        for (key in geojsonResponse.features) {
          if (geojsonResponse.features.hasOwnProperty(key)) {
            obj = geojsonResponse.features[key];
            arr.push({
              value: obj.properties.name,
              desc: getDescription(obj.properties.type),
              type: obj.properties.type,
              geoJson: obj
            });
          }
        }
        return arr;
      }
    },
    template: [
      '<p class="result-text">{{value}}</p>',
      '<p class="result-desc">{{desc}}</p>'
    ].join(''),
    limit: 10,
    engine: Hogan
  }]).bind('typeahead:selected', function (obj, datum) {
    $('#search-results').empty();
    $('#search-results').append(['<a href="#" class="list-group-item">',
      '<h4 class="list-group-item-heading">'+datum.value+'</h4><p class="list-group-item-text">',
      getDescription(datum.geoJson.properties.type)+'</p></a>'
    ].join(''));
    create_marker(datum.geoJson);
  });

  // DEFAULT VALUES
  if ($('#lon').val()=='' && $('#lat').val()=='') {
    setCoords();
  }
  if ($_GET!=null && $_GET.sort=='on') {
    $('#sort').prop('checked', true);
  }
  if ($_GET!=null && $_GET.filter=='on') {
    $('#filter').prop('checked', true);
  }
});
