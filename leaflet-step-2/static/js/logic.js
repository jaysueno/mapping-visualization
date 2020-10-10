// Create a leaflet map object using "L.map()"
var myMap = L.map("map", {
    center: [37.09, -110.71],
    zoom: 4
    // layers: [lightmap, streetMap]
});


var baseMaps = {
    "Light Map": lightmap,
    "Satellite Map": satellitemap,
    "Street Map": streetMap
};

// Add layer control
L.control.layers(lightmap, satellitemap, {
    collapsed: true
}).addTo(myMap);

// Add a tile layer using "L.tilelayer()" 
var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
});

var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
});

// Add "light-v10" to our tilelayers on our map
// lightmap.addTo(myMap);

// Create a function that will define the marker size based on the "magnitude" of the earthquake
function markerSize(magnitude) {
    return magnitude * 30000;
}

// This function will return a color based on a number. It will be used to generate marker colors based on the magnitude of the earthquake
var markerColor = function(value) {
    if (value < 0) {
            return '#F4ECF7'
    } else if (value < 20) {
            return '#D2B4DE'
    } else if (value < 60) {
            return '#A569BD'
    } else if (value < 120) {
            return '#7D3C98'
    } else if (value < 180) {
            return '#4B7282'
    } else {
            return '#4A235A'
    } 
}

// Call the geojson API for all of the earthquakes in the past week. There are several different json files to choose from. 
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Use D3 promise to call the data get a response to populate the markers on the map
d3.json(url).then(function(data) {
    // Loop through locations and create city and state markers
    for (var i = 0; i < data.features.length; i++) {
        console.log(data.features.length);
        // Declare variables
        var lat = data.features[i].geometry.coordinates[1];
        var lon = data.features[i].geometry.coordinates[0];
        var latlon = [lat,lon];
        var mag = data.features[i].properties.mag;
        var depth = data.features[i].geometry.coordinates[2];
        var place = data.features[i].properties.place;
        // console.log(earthquakeData[i].geometry.coordinates)
        // console.log(lat,lon)
        // console.log(place)

        // Set the marker radius
        L.circle(latlon, {
            stroke: "black",
            fillOpacity: 0.5, 
            color: '#FDFEFE',
            fillColor: markerColor(depth),
            fillOpacity: .6,
            weight: 1,
            // set marker size to reflect the magnitude
            radius: mag * 25000
        }).bindPopup(`<h3>Location:${place}</h3><p>Magnitude: ${mag}</p>`)
        .addTo(myMap); 
    }
});

// Create Legend
var legend = L.control({
    position: "bottomright"
});

legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    var limits = [
        '<0',
        '0 - 19',
        '20 - 59',
        '80 - 119',
        '120 - 179',
        '>180'
    ];
    var colors = [
            '#F4ECF7',
            '#D2B4DE',
            '#A569BD',
            '#7D3C98',
            '#4B7282',
            '#4A235A'
    ]; 

    // Legend heading
    var legendInfo = "<h3>Earthquake Depth</h3>"

    div.innerHTML = legendInfo;

    for (var i = 0; i < limits.length; i++) {
            div.innerHTML +=
                '<i style="background:' + (colors[i]) + '"></i> ' +
                limits[i] + '<br>';
        }

    return div;
};

legend.addTo(myMap)