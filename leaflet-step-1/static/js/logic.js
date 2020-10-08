// const API_KEY = "pk.eyJ1IjoiamF5c3Vlbm8iLCJhIjoiY2tmZGFjN2Y4MGJsbDJxcXdpaGZzYmVoYiJ9.g3UMwdmRpfd0l_NLHVtFwg";


// Create a leaflet map object using "L.map()"
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Add a tile layer using "L.tilelayer()" 
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 12,
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

// Add "light-v10" to our tilelayers on our map
lightmap.addTo(myMap);

// Call the geojson API for all of the earthquakes in the past week. There are several different json files to choose from. 
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Create a function that will define the marker size based on the "magnitude" of the earthquake
function markerSize(magnitude) {
    return magnitude * 30000;
}

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
        console.log(place)

        // Set the color fill based on the depth of earthquake
        var fill = "";
        if (depth > 90) {
            fill = "red"
        }
        else if (depth >70) {
            fill = "orange"
        }
        else if (depth > 30) {
            fill = "yellow"
        }
        else {
            fill = "green"
        }

        // Set the marker radius
        L.circle(latlon, {
            stroke: false,
            fillOpacity: 0.75, 
            color: fill,
            fillColor: fill,
            radius: markerSize(mag)
        }).addTo(myMap);

        
    }
})

// Create Legend
var legend = L.control({position: "bottomright"});
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "Info Legend");
    var depth_label = [-10, 10, 30, 50, 70, 90];
    return div
};

legend.addTo(myMap)