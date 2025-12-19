    // 1. Initialize the map
    const map = L.map('mapid').setView([43.65734974239763, -70.26189624400604], 15);

    // Add a tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© [OpenStreetMap]() contributors'
    }).addTo(map);

    // 2. Fetch the remote data
    // Replace 'your_remote_data_source.geojson' with your actual API endpoint or GeoJSON file URL
    fetch('Crashes_10_Years.geojson')
        .then(response => response.json())
        .then(data => {
            // 3. Process and add markers using L.geoJSON
            L.geoJSON(data, {
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(
                        feature.properties["MDOT ID"] +
                        " : " +
                        feature.properties["Crash Date"]
                    )
                },
                style: function (feature) {
                    if (feature.properties["K - Fatalities Count"] > 0) {
                        return {
                            fillColor: 'red' // red if fatality
                        }
                    }
                    else {
                        return {
                            fillColor: 'blue' // blue if not
                        }
                    }
                }
            }).addTo(map);
       }).catch(error => {
            console.error('Error fetching data:', error);
        });
