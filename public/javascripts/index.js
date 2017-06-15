/* globals $*/
var map;
$('#searchButton').on('click', function (event) {
  var formLocation = $('#searchText').val();

  if (formLocation) {
    $('.form-group span').remove();
    $('.form-group').removeClass('has-error');

    $.ajax('/search', {
      method: 'post',
      data: {
        location: formLocation
      },
      success: function (data) {
        showResults(data);
      },
      error: logAjaxError
    });

  } else {
    $('.form-group').addClass('has-error');
    $('.form-group').append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>'
      +'<span id="inputError2Status" class="sr-only">(error)</span>');
  }
  
  event.preventDefault();
});

function logAjaxError(jqXHR, textStatus, errorThrown) {
  console.log('AJAX error. Status:', textStatus, 'error:', errorThrown);
}

function showResults(data) {
  populateList(data);
  populateMap(data);
}


function populateList(data) {
  var list = $('#listResults');
  list.empty();
  data.forEach(function (element, index, array) {
    var item = $('<div class="panel panel-default"><div class="panel-body"><h4>'+ element.name +'</h4><div><img class="yelp-rating" src="/images/yelp/'+ element.rating
      +'.png"><a target="_blank" href="'+ element.url +'"><img class="yelp-logo" src="/images/yelp/logo.png"></a><p>Based on '
      + element.review_count + ' reviews</p><a href="' + element.zillowLink + '" target="_blank">'
      + element.unitsAvailable + ' available units on Zillow</a></div></div></div>');
    list.append(item);
  })
}

function makeItFit(markers) {
  var bounds = new google.maps.LatLngBounds();
  markers.forEach(function (element) {
    bounds.extend(element.getPosition());
  });

  map.fitBounds(bounds);
  map.setZoom(map.getZoom()-1);
}

function populateMap(data) {
  if (!map) {
    map = new google.maps.Map( $('#map')[0] );
    map.setZoom( 16 );
  }

  var markers = [];

  data.forEach(function (element, index, array) {
    var marker = new google.maps.Marker({
      position: { lat: element.coordinates.latitude, lng: element.coordinates.longitude }});
    marker.setMap(map);

    var markerInfo = '<h4>'+ element.name +'</h4><div><img class="yelp-rating" src="/images/yelp/'+ element.rating
      +'.png"><a target="_blank" href="'+ element.url +'"><img class="yelp-logo" src="/images/yelp/logo.png"></a><p>Based on '
      + element.review_count + ' reviews</p><a href="' + element.zillowLink + '" target="_blank">'
      + element.unitsAvailable + ' available units on Zillow</a></div>';
    var infowindow = new google.maps.InfoWindow({
      content: markerInfo,
      maxWidth: 200
    });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
    markers.push(marker);
  });

  makeItFit(markers);

}