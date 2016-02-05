function featureDiagnostics(testsArray) {
  var fullHouse = 0;
  var container = $( '#diagnostics' );
  for (var i = 0; i < testsArray.length; i++){
    if(Modernizr[testsArray[i]]) {
      var alertID = 'div#' + testsArray[i];
      var alert = $( alertID );
      alert.removeClass('alert-danger');
      alert.addClass('alert-success');
      $( alert ).children( '.sr-only' ).text('Supported:');
      var icon = $( alert ).children( '.glyphicon' );
      icon.removeClass('glyphicon-remove-sign');
      icon.addClass('glyphicon-ok-sign');
      fullHouse++;
    }
  }
  if (fullHouse === testsArray.length) {
    $( container ).append(
      '<p>
        It looks like your browser should work perfectly.
      </p>'
    );
  } else if (fullHouse === 0) {
    $( container ).append(
      '<p>
        It looks like your browser doesn’t support the necessary web technologies.
        Please try a more modern browser such as Google Chrome.
      </p>'
    );
  } else {
    $( container ).append(
      '<p>
        It looks like your browser doesn’t support all the necessary web technologies.
        Some features may not work.
      </p>'
    );
  }
  $( container ).append(
    '<p>
      If you’re having trouble, please
      <a href="mailto:swithinbank@gmail.com?subject=Troglodyte%20Angel%20Synth">
        contact Chris Swithinbank
      </a>
      with details.
    </p>'
  );
}
$( document ).ready(function() {
    $( 'div#no-js-diagnosed' ).replaceWith(
      '<p>Feature support in your browser:</p>
      <div class="col-sm-4">
        <div class="alert alert-danger" id="webaudio">
          <span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>
          <span class="sr-only">Unsupported:</span>
          <strong>Web Audio API</strong> — vital
        </div>
      </div>
      <div class="col-sm-4">
        <div class="alert alert-danger" id="applicationcache">
          <span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>
          <span class="sr-only">Unsupported:</span>
          <strong>Application Cache</strong> — required for offline support
        </div>
      </div>
      <div class="col-sm-4">
        <div class="alert alert-danger" id="localstorage">
          <span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>
          <span class="sr-only">Unsupported:</span>
          <strong>Local Storage</strong> — required to recall previous settings
        </div>
      </div>'
    );
    var testsArray = ['webaudio', 'applicationcache', 'localstorage'];
    featureDiagnostics(testsArray);
});
