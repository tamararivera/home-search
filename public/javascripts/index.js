/* globals $*/
var map;
$('#searchButton').on('click', function (event) {
  var formLocation = $('#searchText').val();
  var results = (localStorage['HomeSearchTestResults'])? JSON.parse(localStorage['HomeSearchTestResults']) : [];
  if (!localStorage['HomeSearchTestResults']) {
    if (formLocation) {
      $.ajax('/search', {
        method: 'post',
        data: {
          location: formLocation
        },
        success: function (data) {
          populateMap(data);
          results = data;
          localStorage['HomeSearchTestResults'] = JSON.stringify(results);
        },
        error: logAjaxError
      });
    }
  } else {
    populateMap(results);
  }
  event.preventDefault();
});

function logAjaxError(jqXHR, textStatus, errorThrown) {
  console.log('AJAX error. Status:', textStatus, 'error:', errorThrown);
}

function setCenter(data) {
  var lat = 0;
  var lng = 0;
  data.forEach(function (element, index, array) {
    lat += element.coordinates.latitude;
    lng += element.coordinates.longitude;
  });

  lat = lat / data.length;
  lng = lng / data.length;
  map.setCenter( { lat: lat, lng: lng });
}

function populateMap(data) {
  if (!map) {
    map = new google.maps.Map( $('#map')[0] );
    map.setZoom( 16 );
  }

  setCenter(data);
  data.forEach(function (element, index, array) {
    var marker = new google.maps.Marker({
      position: { lat: element.coordinates.latitude, lng: element.coordinates.longitude }});
    marker.setMap(map);

    var markerInfo = '<h4>'+ element.name +'</h4><div><img class="yelp-rating" src="/images/yelp/'+ element.rating
      +'.png"><a target="_blank" href="'+ element.url +'"><img class="yelp-logo" src="/images/yelp/logo.png"></a><p>Based on '
      + element.review_count + ' reviews</p><a href="' + element.zillowLink + '">'
      + element.unitsAvailable + ' available units on Zillow</a></div>';
    var infowindow = new google.maps.InfoWindow({
      content: markerInfo,
      maxWidth: 200
    });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
  })

}