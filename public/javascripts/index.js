/* globals $*/
$('#searchButton').on('click', function (event) {
  var formLocation = $('#searchText').val();
  if (formLocation) {
    $.ajax('/search', {
      method: 'post',
      data: {
        location: formLocation
      },
      success: function (data) {
        console.log(data);
      },
      error: logAjaxError
    });
  }
  event.preventDefault();
});

function logAjaxError(jqXHR, textStatus, errorThrown) {
  console.log('AJAX error. Status:', textStatus, 'error:', errorThrown);
}