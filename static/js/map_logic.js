console.log("map_logic.js")

// Build base map
// Build base map
var basemap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let myMap = L.map("map", {
    center: [-27, 133],
    zoom: 4
});

basemap.addTo(myMap);

// Build the menu
let baseMaps = {
    "AU Map Boundaries and Capitals": basemap
};

let mapLabels = new L.LayerGroup();
let overlays = {
    "Solar Power Projects": mapLabels,
};

L.control.layers(baseMaps, overlays, { collapsed: false }).addTo(myMap);

// Read GeoJSON data from the GitHub raw file URL
fetch('https://raw.githubusercontent.com/VanHg33/Module_23-24_Project_4_FinalProject/main/resources/Global-Solar-Power-Tracker-January-2023.geojson')
    .then(response => response.json())
    .then(data => {
        console.log(data);

        // Iterate over the GeoJSON data and add markers to the map
        data.features.forEach(feature => {
            const { latitude, longitude, "Project Name": projectName, "Capacity (MW)": capacityMW, Country: country } = feature.properties;

            const marker = L.marker([latitude, longitude])
                .bindPopup(`${projectName}<hr>Capacity: ${capacityMW} MW<hr>Country: ${country}`)
                .addTo(mapLabels);
        });

        mapLabels.addTo(myMap);
    })
    .catch(error => console.error('Error reading GeoJSON file:', error));

  