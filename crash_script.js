
const driveractions= [
	"Driver Action 1 Unit 1 Description",
	"Driver Action 2 Unit 1 Description"
]

const victimactions= [
	"Driver Action 1 Unit 2 Description",
	"Driver Action 2 Unit 2 Description",
]

const categories = [ // [label, color of marker]
	['killed', '#ff0000'],
	['seriously injured', '#0000ff'],
	['injured', '#00ff00'],
	['possibly injured', '#0080A0'],
	['no injury reported', '#A0A0A0']
];

var getcategory = function (feature) {
    if (Number(feature.properties["K - Fatalities Count"]) > 0) {
        return categories[0]
    }
    else if (Number(feature.properties["A - Suspected Serious Injury Count"]) > 0) {
        return categories[1]
    }
    else if (Number(feature.properties["B - Suspected Minor Injuries Count"]) > 0) {
        return categories[2]
    }
    else if (Number(feature.properties["C - Possible Injuries Count"]) > 0) {
        return categories[3]
    }
    else {
    	return categories[4]
    }
}

var getboundary = function (city, map) { // Add municipal boundary
    url = `https://nominatim.openstreetmap.org/search.php?city=${city}&state=maine&polygon_geojson=1&format=jsonv2`
    fetch(url).then(function(response) {
        return response.json();
    })
    .then(function(json) {
        boundaryFeature = json[0].geojson;
        L.geoJSON(boundaryFeature,{
            color: 'blue',        // Outline color
            fillColor: '#00004', // Fill color
            fillOpacity: 0.10     // Fill opacity (0.0 to 1.0)
        }).addTo(map);
    });
    return map;
}

var getlabel = function (feature) { // For use constructing popup
    var retstr = "DOT ID: " + feature.properties["MDOT ID"] +
        ", date: " +
        feature.properties["Crash Date"]
    if ( feature.properties["Bicycle Yes/No"] == "Y" ) {
        retstr += "<br>Cyclist: "
    }
    else if ( feature.properties["Pedestrian Yes/No"] == "Y" ) {
        retstr += "<br>Pedestrian: "
    }
    retstr += getcategory(feature)[0];
    retstr += "<br><i>Driver action[s] reported:</i>";
    for (var i = 0; i < driveractions.length; i++) {
    	action = feature.properties[driveractions[i]];
    	retstr +=  `<br>${i + 1}. ${action}`;
    }
    retstr += "<br><i>Victim action[s] reported:</i>";
    for (var i = 0; i < victimactions.length; i++) {
    	action = feature.properties[victimactions[i]];
    	retstr +=  `<br>${i + 1}. ${action}`;
	}
	return retstr
}

const circleMarkerStyle = {
    radius: 8,
    fillColor: '#000000',
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
}

const cities = [
    'portland',
    'south portland',
    'falmouth',
    'westbrook'
    ];

var getMarker = function (feature, latlng) {
    var localStyle = circleMarkerStyle;
	localStyle.fillColor = getcategory(feature)[1];
    return L.circleMarker(latlng, localStyle);
}

// Initialize the map
const map = L.map('mapid').setView([43.65734974239763, -70.26189624400604], 15);

// Add municipal boundaries
cities.forEach((city) => {
  getboundary(city, map);
});

// Add a tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 24,         // Allows user to zoom in up to level 24 on the map
    maxNativeZoom: 19,   // Tells Leaflet to stop fetching new tiles past 19 and scale existing ones
    attribution: '© [OpenStreetMap]() contributors'
}).addTo(map);

// Create legend
var legend = L.control({position: 'topright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var labels = ['<strong>Categories</strong>'];

    for (var i = 0; i < categories.length; i++) {
        div.innerHTML += labels.push(
            '<i style="background:' + categories[i][1] + '"></i> ' +
				categories[i][0]
        );
    }
    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);

// Create a Marker Cluster Group
var markers = L.markerClusterGroup({
	maxZoom: 24,
    disableClusteringAtZoom: 18, // Markers will decluster at zoom level 18 and below
    // maxClusterRadius: 30 // Use default
});

// Fetch the remote data
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

