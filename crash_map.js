var getlabel = function (feature) {
    var retstr = "DOT ID: " + feature.properties["MDOT ID"] +
        ", date: " +
        feature.properties["Crash Date"]
    if ( feature.properties["Bicycle Yes/No"] == "Y" ) {
        retstr += "\nCyclist "}
    if ( feature.properties["Pedestrian Yes/No"] == "Y" ) {
        retstr += "\nPedestrian " }
    if (Number(feature.properties["K - Fatalities Count"]) > 0) {
        retstr += "killed" }
    if (Number(feature.properties["A - Suspected Serious Injury Count"]) > 0) {
        retstr += "seriously injured"
    }
    return retstr
}

var circleMarkerStyle = {
    radius: 8,
    fillColor: '#ffffff',
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
}

var getMarker = function (feature, latlng) {
    var localStyle = circleMarkerStyle;
    if (Number(feature.properties["K - Fatalities Count"]) > 0) {
        localStyle.fillColor = "#ff7800"
    } else if (Number(feature.properties["A - Suspected Serious Injury Count"]) > 0) {
        localStyle.fillColor = "#0078ff"
    } else {
        localStyle.fillColor = "#00ff00"
    }
    return L.circleMarker(latlng, localStyle);
}

// 1. Initialize the map
const map = L.map('mapid').setView([43.65734974239763, -70.26189624400604], 15);

// Add a tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© [OpenStreetMap]() contributors'
}).addTo(map);

// Create a Marker Cluster Group
        var markers = L.markerClusterGroup();

// 2. Fetch the remote data
// Replace 'your_remote_data_source.geojson' with your actual API endpoint or GeoJSON file URL
//fetch('Crashes_10_Years.geojson')
fetch('all_crashes.geojson')
    .then(response => response.json())
    .then(data => {
        // 3. Process and add markers using L.geoJSON
        L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup(
                    getlabel(feature)
                )
            },
            pointToLayer(feature, latlng) {
                return getMarker(feature, latlng)
            }
        }).addTo(markers);
   }).catch(error => {
        console.error('Error fetching data:', error);
   });
map.addLayer(markers);
