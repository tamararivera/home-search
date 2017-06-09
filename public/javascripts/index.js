/* globals $*/
$('#searchButton').on('click', function(event) {
  event.preventDefault();
  $.ajax('/search', {
    method: 'post',
    data: {
      location: $('#searchText').val()
    },
    success: function (data) {
      console.log(data);
    },
    error: logAjaxError
  });
});

function logAjaxError( jqXHR, textStatus, errorThrown ) {
    console.log( 'AJAX error. Status:', textStatus, 'error:', errorThrown );
}