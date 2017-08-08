/**
 * InteractiveMap
 * When a map is found - replace the static map (you added a static map right?)
 * and convert it into a Google Map with the Google Maps API which we will
 * async load in if one isn't on the page already
 *
 * Expects the following HTML
 `
    <div data-behavior="InteractiveMap" class="" data-directions="DRIVING" data-latitude="LAT" data-longitude="LONG">
      <img
        src="https://maps.googleapis.com/maps/api/staticmap?center=LAT,LONG&zoom=4&size=740x480&amp;key=KEY"
        alt=""
        height="480"
        width="740"
     >
    </div>
 `
 */

A17.Behaviors.InteractiveMap = function(container) {

  /**
   * @param string
   * ID attribute of our added script
   */
  _scriptTagId = 'GoogleMapAPIScript';

  /**
   * @param string
   * Google Maps API key
   */
  _apiKey = 'AIzaSyB0AYFpwKKoAreACPxfvL52r3VRWYRdWko';

  /**
   * _loadAPI
   * Check to see if the API script is present and if not
   * add it to the DOM
   *
   * @return {void}
   */
  function _loadAPI() {

    var script = null;
    var scriptTag = document.getElementById(_scriptTagId);

    if(!scriptTag) {
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.className = '';
      script.src = 'https://maps.google.com/maps/api/js?callback=GoogleMapsCallback&key=' + _apiKey;
      script.id = _scriptTagId;
      document.body.appendChild(script);
    } else {
      // Ok so the <script> tag is already on the page so now we need to know what its state is:
      // State 1:
      // The class isn't there then we assume another instance of this InteractiveMap has created the <script>
      // tag but it hasn't loaded yet from Google’s CDN so we will let that instance trigger the event when
      // State 2:
      // The class is there which means the <script> is in place and has loaded however, we assume that
      // the eventListener has not been added in this case e.g. maybe the page content has come from AJAX
      if (scriptTag.classList.contains('gmaps-api-loaded')) {
        A17.Helpers.triggerCustomEvent(document, scriptTagId);
      }
    }
  }

  /**
   * _replaceStaticMap
   *
   * We atart with an <img> tag that has a static map. Hide that and put an
   * interactive Google Map in there.
   *
   * @return {void}
   */
  function _replaceStaticMap() {

    var image = container.querySelector('img').setAttribute('style', 'display:none;');
    var gmapDOM = document.createElement('div');
    var gmap = '';
    var location = {
        lat: parseFloat(container.getAttribute('data-latitude')),
        lng: parseFloat(container.getAttribute('data-longitude'))
    };
    var map = null;
    var marker = null;
    var zoomLevel = 11;

    gmapDOM.className = 'gmap';
    container.appendChild(gmapDOM);

    gmap = container.querySelector('.gmap');

    map = new google.maps.Map(gmap, {
      zoom: zoomLevel,
      scrollwheel: false,
      center: location
    });

    // Show directions or just a simple marker?
    if (container.getAttribute('data-directions')) {
      _loadDirections(map, location);
    } else {
      marker = new google.maps.Marker({
        position: location,
        map: map
      });
    }

  }

  /**
   * _loadDirections
   *
   *  Display directions from the user's location to the destination
   *
   * @return {void}
   */
  function _loadDirections(map, destination) {

    var directionsDisplay = null;
    var zoomLevel = 11;
    var request = null;
    var directionsService = null;
    var userLocation = {lat: 41.85, lng: -87.65}; // TODO get location with HTML5

    directionsDisplay = new google.maps.DirectionsRenderer({
      map: map
    });

    // Set destination, origin and travel mode.
    request = {
      destination: destination,
      origin: userLocation,
      travelMode: container.getAttribute('data-directions')
    };

    // Pass the directions request to the directions service.
    directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function(response, status) {
      if (status == 'OK') {
        // Display the route on the map.
        directionsDisplay.setDirections(response);
      }
    });

  }

  function _init() {
    _loadAPI();

    document.addEventListener(_scriptTagId, _replaceStaticMap, false);
  }

  this.destroy = function() {
    // remove specific event handlers - if any
    document.removeEventListener(_scriptTagId, _replaceStaticMap, false);

    // remove properties of this behavior
    A17.Helpers.purgeProperties(this);
  };

  this.init = function() {
    _init();
  };

  this.callback = function() {
    _replaceStaticMap();
  };
};

/**
 * GoogleMapsCallback
 *
 * As we are only loading the Google Maps API script when a module require it
 * We need a callback function(and Google Maps API requires it to be be global) to
 * determine if/when its script has loaded.
 *
 * So this callback adds some classes and triggers a custom event so our
 * InteractiveMap behavior knows to generate a map - without this we might get
 * an error when we call Google Map API's functions.
 *
 * @return {void}
 */
var GoogleMapsCallback = function () {
  var script = document.getElementById('GoogleMapAPIScript');

  script.classList.add('gmaps-api-loaded');
  A17.Helpers.triggerCustomEvent(document, 'GoogleMapAPIScript');
}
