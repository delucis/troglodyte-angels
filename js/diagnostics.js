function featureDiagnostics(testsArray) {
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
    }
  }
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
