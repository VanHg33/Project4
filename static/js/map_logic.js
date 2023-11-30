console.log("map_logic.js")

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
let capacityLayer = new L.LayerGroup();

let overlays = {
    "Solar Power Projects": mapLabels,
    "Solar Power Capacity": capacityLayer
};

L.control.layers(baseMaps, overlays, { collapsed: false }).addTo(myMap);

// Read GeoJSON data from the GitHub raw file URL
fetch('https://raw.githubusercontent.com/VanHg33/Module_23-24_Project_4_FinalProject/main/resources/Global-Solar-Power-Tracker-January-2023.geojson')
    .then(response => response.json())
    .then(data => {
        console.log(data);

        // Iterate over the GeoJSON data and add markers to the map
        data.features.forEach(feature => {
            const { Latitude, Longitude, "Project Name": projectName, "Capacity (MW)": capacityMW, Country: country, "City": City,
                "Technology Type": technologyType, "State/Province": StateProvince } = feature.properties;

            const marker = L.marker([Latitude, Longitude])
                .bindPopup(`<strong>${projectName}</strong> <hr>Capacity: ${capacityMW} <hr>Location: ${City}, ${StateProvince}, ${country} \
                <hr>Technology Type: ${technologyType}`)
                .addTo(mapLabels);
        });

        mapLabels.addTo(myMap);
    })
    

fetch('https://raw.githubusercontent.com/VanHg33/Module_23-24_Project_4_FinalProject/main/resources/Global-Solar-Power-Tracker-January-2023.geojson')
    .then(response => response.json())
    .then(data => {
        // Iterate over the GeoJSON data and add markers to the map
        data.features.forEach(feature => {
            const { Latitude, Longitude, "Project Name": projectName, "Capacity (MW)": capacityMW, Country: country, "City": City,
                "Technology Type": technologyType, "State/Province": StateProvince } = feature.properties;

            let color = "";
            if (capacityMW > 200) {
                color = "red";
            } else if (capacityMW < 20) {
                color = "blue";
            } else {
                color = "green";
            }

            // Adjust the radius based on the capacity
            const radius = Math.sqrt(capacityMW);

            const marker = L.circleMarker([Latitude, Longitude], {
                radius: radius,
                fillColor: color,
                color: "white",
                fillOpacity: 0.75,
            }).bindPopup(`<strong>${projectName}</strong> <hr>Capacity: <span style="color: ${color};">${capacityMW} MW</span> <hr>Location: ${City}, ${StateProvince}, ${country} \
                <hr>Technology Type: ${technologyType}`);

            marker.addTo(capacityLayer);
        });

        capacityLayer.addTo(myMap);

        // Create a custom legend for Solar Power Capacity
        var capacityLegend = L.control({ position: 'bottomright' });

        capacityLegend.onAdd = function (myMap) {
            var div = L.DomUtil.create('div', 'info legend');
            var colors = ['red', 'green', 'blue'];
            var labels = ['> 200 MW', '20-200 MW', '< 20 MW'];

            // Loop through capacity levels and generate a label with a colored square for each
            for (var i = 0; i < colors.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + colors[i] + '"></i> ' + labels[i] + '<br>';
            }

            return div;
        };

        // Add the Solar Power Capacity legend to the map
        capacityLegend.addTo(myMap);
    })