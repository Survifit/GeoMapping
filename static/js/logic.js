// Week 17 / Hwk #14 Geo-Mapping of earthquakes
// UofMN Data Visualization and Analytics
// Created by Chris Howard
// 06/29/2019
var earthquakeLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Grabbing our GeoJSON data..
d3.json(earthquakeLink, function(data) {

    // Adding tile layer
    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });
    
    var baseMaps = {
        Satellite: satellite,
        Light: light,
        Dark: dark
    };

    var map = L.map("map", {
        center: [39.0473, -95.6752],
        zoom: 4,
        layers: [satellite]
    });


    var plateOutlines = L.geoJson(plates, {
        style: function(feature) {
            return {
                color: "yellow",
                weight: 1.5
            };
        }
    });

    // Creating a geoJSON layer with the retrieved data
    var earthquakeMarkers = L.geoJson(data, {
        // Style each feature (in this case a neighborhood)
        pointToLayer: function(feature, latlng) {
            var markerColor = "";
            if (feature.properties.mag > 5) {
                markerColor = "red";
            } else if (feature.properties.mag > 4) {
                markerColor = "darkorange";
            } else if (feature.properties.mag > 3) {
                markerColor = "orange";
            } else if (feature.properties.mag > 2) {
                markerColor = "gold";
            } else if (feature.properties.mag > 1) {
                markerColor = "yellow";
            } else {
                markerColor = "green";
            };
            var geojsonMakerOptions = {
                radius: 15000 * feature.properties.mag,
                fillColor: markerColor,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            return L.circle(latlng, geojsonMakerOptions);
        },

        // Called on each feature
        onEachFeature: function(feature, layer) {
            
            // Giving each feature a pop-up with information pertinent to it
            layer.bindPopup("<h1>" + feature.properties.title + "</h1>");

        }
        });

    var overlayMaps = {
        "Earthquakes": earthquakeMarkers.addTo(map),
        "Fault Lines": plateOutlines.addTo(map)
    };



    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(map);

    var legend = L.control({position: 'bottomright'});
        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 1, 2, 3, 4, 5],
                labels = ["green", "yellow", "gold", "orange", "darkorange", "red"];
        
            // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + labels[i] + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }
        
            return div;
        };
    legend.addTo(map);

});