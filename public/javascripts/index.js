/* globals $*/
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
          results = data;
          localStorage['HomeSearchTestResults'] = JSON.stringify(results);
        },
        error: logAjaxError
      });
    }
  }
  event.preventDefault();
});

function logAjaxError(jqXHR, textStatus, errorThrown) {
  console.log('AJAX error. Status:', textStatus, 'error:', errorThrown);
}