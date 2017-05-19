function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: {lat: 41.876, lng: -87.624}
    });

    var ctaLayer = new google.maps.KmlLayer({
        url: 'https://raw.githubusercontent.com/Legohuman/map-sample/master/googlemaps/us_states.kml',
        map: map
    });
}
