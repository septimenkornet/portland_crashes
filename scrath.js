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
        .then(data => {  // 1( 2{
            // 3. Process and add markers using L.geoJSON
            L.geoJSON(data, { // 3( 4{
                onEachFeature: function (feature, layer) { // 5{
                    layer.bindPopup( // 6(
                        feature.properties["MDOT ID"] +
                        " : " +
                        feature.properties["Crash Date"]
                    ); // 5{
                } // 4{
                style: function (feature) { // 3
                    if (feature.properties["K - Fatalities Count"] > 0) { // 4
                        return { // 5
                            fillColor: 'red' // red if fatality
                        };  // 4
                    } // 3
                    else { // 4
                        return { // 5
                            fillColor: 'blue' // blue if not
                        };  // 4
                    } // 3
                } // 2
            }).addTo(map);
       })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
