var cities, organisations;
var citiesGeom = [];
var organisationsGeom = [];
var map;
var prevZoom;
var sidebar = document.getElementById('sidebar');
var selectedOrganisationId;


function initMap() {
    cities = {
        chicago: {
            center: {lat: 41.878, lng: -87.629},
            stage: 2714856
        },
        newyork: {
            center: {lat: 40.714, lng: -74.005},
            stage: 8405837
        },
        losangeles: {
            center: {lat: 34.052, lng: -118.243},
            stage: 3857799
        },
        vancouver: {
            center: {lat: 49.25, lng: -123.1},
            stage: 603502
        }
    };

    organisations = {};
    for (var i = 0; i < 1400; i++) {
        organisations['organisation_' + i] = {
            center: {lat: Math.random() * 20 + 30, lng: Math.random() * 30 - 120},
            stage: Math.random() * 4
        }
    }

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: {lat: 41.876, lng: -100.624}
    });

    var statesGeom = new google.maps.Polygon({
        paths: statesBorders.california,
        map: map,
        strokeColor: '#2a5dcf',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#2a5dcf',
        fillOpacity: 0.35
    });

    for (var cityId in cities) {
        // Add the circle for this city to the map.
        var city = cities[cityId];
        var cityColor = '#FF0000';
        var cityCircle = new google.maps.Circle({
            strokeColor: cityColor,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: cityColor,
            fillOpacity: 0.35,
            map: map,
            center: city.center,
            radius: Math.sqrt(city.stage) * 80
        });
        addCityClickListener(cityCircle, cityId);
        citiesGeom.push(cityCircle);
    }

    for (var organisationId in organisations) {
        // Add the circle for this city to the map.
        var organisation = organisations[organisationId];
        var color = organisation.stage > 2 ? '#FF0000' : organisation.stage > 1 ? '#FFFF00' : '#FF00FF';
        var organisationCircle = new google.maps.Circle({
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color,
            fillOpacity: 0.35,
            center: organisation.center,
            radius: organisation.stage * 8000
        });
        addOrganisationClickListener(organisationCircle, organisationId);
        organisationsGeom.push(organisationCircle);
    }

    map.addListener('zoom_changed', function () {
        console.log('zoom changed to', map.zoom);

        var mapMode = getMapMode(map.zoom);
        if (!prevZoom || prevZoom > map.zoom || getMapMode(prevZoom) !== mapMode) {
            prevZoom = map.zoom;

            setTimeout(function () {
                if (mapMode === 'organisations') {
                    showOrganisations()
                } else {
                    showCities()
                }
            }, 50);
        }
    });

    map.addListener('dragend', function () {
        var mapMode = getMapMode(map.zoom);
        if (mapMode === 'organisations') {
            showOrganisations()
        } else {
            showCities()
        }
    })
}

function addCityClickListener(circle, id) {
    circle.addListener('click', function (event) {
        onCityClick(id)
    });
}

function addOrganisationClickListener(circle, id) {
    circle.addListener('click', function (event) {
        onOrganisationClick(id)
    });
}

function onOrganisationClick(id) {
    console.log('organisation click', id);
    if (selectedOrganisationId === id) {
        selectedOrganisationId = null;
        sidebar.style.display = 'none';
    } else {
        selectedOrganisationId = id;
        sidebar.innerHTML = 'Organisation profile ' + id;
        sidebar.style.display = 'block';
    }
}

function onCityClick(id) {
    console.log('city click', id);
    map.setOptions({
        zoom: 7,
        center: cities[id].center
    });
}

function getMapMode(zoom) {
    return zoom > 6 ? 'organisations' : 'cities';
}

function setGeomObjectsMap(geomObjectArray, map) {
    geomObjectArray.forEach(function (obj) {
        if (map == null || isObjVisibleOnMap(obj, map)) {
            obj.setMap(map)
        }
    });
}

function isObjVisibleOnMap(geomObject, map) {
    return map.getBounds().contains(geomObject.center)
}

function showCities() {
    setGeomObjectsMap(organisationsGeom, null);
    setGeomObjectsMap(citiesGeom, map);
}

function showOrganisations() {
    setGeomObjectsMap(organisationsGeom, map);
    setGeomObjectsMap(citiesGeom, null);
}
