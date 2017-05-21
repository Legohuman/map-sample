(function () {
    var map = L.map('map').setView([41.876, -100.624], 4);
    var selectedOrganisationId = null;
    var sidebar = document.getElementById('sidebar');

    initTiles();

    var states = addStates().addTo(map);

    var cities = addCities().addTo(map);

    var organisations = addOrganisations();


    map.on('zoomend', function () {
        if (map.getZoom() > 5) {
            map.removeLayer(states);
            map.removeLayer(cities);
            map.addLayer(organisations);
        } else {
            map.addLayer(states);
            map.addLayer(cities);
            map.removeLayer(organisations);
        }
    });


    function initTiles() {
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 14,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo(map);
    }

    function addCities() {
        var citiesGeom = [];
        for (var i = 0; i < 15; i++) {
            var lat = Math.random() * 20 + 30;
            var lng = Math.random() * 30 - 120;

            var circle = L.circle([lat, lng], {
                radius: 20000,
                color: '#FF0000',
                fillColor: '#FF0000',
                fillOpacity: 0.5
            });
            citiesGeom.push(circle)
        }
        return L.layerGroup(citiesGeom);
    }

    function addOrganisations() {
        var organisationsGeom = [];
        for (var i = 0; i < 1400; i++) {
            var id = 'organisation_' + i;
            var lat = Math.random() * 20 + 30;
            var lng = Math.random() * 30 - 120;
            var stage = Math.random() * 4;
            var color = stage > 2 ? '#8B2D14' : stage > 1 ? '#E66100' : '#4675AE';

            var circle = L.circle([lat, lng], {
                radius: Math.random() * 20000,
                color: color,
                fillColor: color,
                fillOpacity: 0.5
            });
            addClickListener(circle, id);
            organisationsGeom.push(circle)
        }
        return L.layerGroup(organisationsGeom)
    }

    function addClickListener(circle, id) {
        circle.on({
            click: function () {
                onOrganisationClick(id)
            }
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

    function addStates() {
        return L.geoJson(statesData, {
            style: style,
            onEachFeature: onEachFeature
        });
    }

    function style(feature) {
        return {
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7,
            fillColor: getStateColor(feature.properties.density)
        };
    }

    function getStateColor(d) {
        return d > 200 ? '#656fc6' :
            d > 100 ? '#6bc2b7' :
                d > 50 ? '#f5eba7' :
                    '#dcdeec';
    }

    function onEachFeature(feature, layer) {
        layer.on({
            click: zoomToFeature
        });
    }

    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }
})();
