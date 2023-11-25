// function init() {
// Use d3 to read the JSON file.
// The data from the JSON file is arbitrarily named importedData as the argument.
var countriesData = []

fetch('https://raw.githubusercontent.com/VanHg33/Module_23-24_Project_4_FinalProject/main/resources/solar-power-by-country-2023.json')
    .then(response => response.json())
    .then(importedData => {
        // Process your data here
        console.log(importedData);

        countriesData = importedData;

        // Sort the data array by using the km value.
        countriesData.sort((a, b) => b.solarPowerByCountry_cap2021 - a.solarPowerByCountry_cap2021);

        // Slice the first 20 objects for plotting.
        dataTop20 = countriesData.slice(0, 20);

        // Reverse the array because of the Plotly defaults.
        dataTop20 = dataTop20.reverse();

        // Trace1 for the car km data.
        let trace1 = {
            x: dataTop20.map(row => row.solarPowerByCountry_cap2021),
            y: dataTop20.map(row => row.country),
            text: dataTop20.map(row => `${row.country} - Capacity 2021: ${row.solarPowerByCountry_cap2021} MW`),
            name: "Solar Power Capacity 2021 (MW)",
            type: "bar",
            orientation: "h"
        };

        // Data
        let chartData = [trace1];

        // Apply the group bar mode to the layout.
        let layout = {
            title: {
                text: "Top 20 Countries by Solar Power Capacity (2021)",
                font: {
                    size: 30,
                    family: 'Arial, sans-serif',
                    color: 'black',
                    weight: 'bold',
                },
            },
            xaxis: { title: "Solar Power Capacity (MW)" },
            margin: {
                l: 100,
                r: 200,
                t: 100,
                b: 100
            },
            width: 1300,
            height: 600,
        };

        // Render the plot to the div tag with the id of "plot".
        Plotly.newPlot("plot", chartData, layout);

        optionChanged("China")

    });


fetch('https://raw.githubusercontent.com/VanHg33/Module_23-24_Project_4_FinalProject/main/resources/solar-power-by-country-2023.json')
    .then(response => response.json())
    .then(importedData => {
        // Populate the dropdown menu with country names
        const dropdownMenu = d3.select("#selDataset");
        const countries = countriesData.map(entry => entry.country);
        console.log("countriesData")
        console.log(countriesData)

        for (let i = 0; i < countries.length; i++) {
            dropdownMenu
                .append("option")
                .text(countries[i])
                .property("value", countries[i]);
        }

        // Add an event listener to the dropdown menu
        dropdownMenu.on("change", function () {
            const selectedCountry = this.value;
            console.log("Selected Country:", selectedCountry);
            //   Call a function or perform actions when a country is selected
            updateDemographicInfo(selectedCountry);
            updateCharts(selectedCountry);
        });

        // Call function to update the chart
        function optionChanged(newselectedCountry) {
            // Call all functions need updates
            updateDemographicInfo(newselectedCountry);
            updateCharts(newselectedCountry);
        };

        function updateDemographicInfo(selectedCountry) {
            // Find the selected country in the data
            const selectedCountryData = countriesData.find(entry => entry.country === selectedCountry);

            // Use D3 to select/control the panel box of sample-metadata
            let panelBox = d3.select("#sample");

            // Use ".html("")" to clear any existing metadata
            panelBox.html("");

            // Check if the country data is found
            if (selectedCountryData) {
                // Returns an array of key/values of the enumerable properties of an object
                Object.entries(selectedCountryData).forEach(([key, value]) => {
                    // Use chaining to append every new element ("h6") and set its text
                    panelBox.append("h6").text(`${key.toUpperCase()}: ${value}`);
                });
            } else {
                // Handle the case where the country data is not found
                panelBox.append("h6").text("Demographic information not available for the selected country.");
            }
        }

        function updateCharts(selectedCountry) {
            // Find the selected country in the data
            const selectedCountryData = countriesData.find(entry => entry.country === selectedCountry);

            // Use D3 to select/control the chart div
            let chartDiv = d3.select("#chart");

            // Use ".html("")" to clear any existing chart
            chartDiv.html("");

            // Check if the country data is found
            if (selectedCountryData) {
                // Extract the relevant solar capacity data
                const solarCapacityData = [
                    selectedCountryData.solarPowerByCountry_tot2017,
                    selectedCountryData.solarPowerByCountry_tot2018,
                    selectedCountryData.solarPowerByCountry_tot2019,
                    selectedCountryData.solarPowerByCountry_tot2020,
                    selectedCountryData.solarPowerByCountry_cap2021,
                ];

                // Create a trace for the line chart
                let trace = {
                    x: [2017, 2018, 2019, 2020, 2021],
                    y: solarCapacityData,
                    mode: 'lines+markers',
                    type: 'scatter',
                    name: selectedCountry,
                };

                // Data
                let chartData = [trace];

                // Apply layout
                let layout = {
                    title: `Solar Capacity Over Time - ${selectedCountry}`,
                    xaxis: { title: "Year" },
                    yaxis: { title: "Solar Capacity" },
                    margin: {
                        l: 100,
                        r: 200,
                        t: 100,
                        b: 100
                    },
                    width: 1300,
                    height: 600,
                };

                // Render the line chart
                Plotly.newPlot("chart", chartData, layout);
            } else {
                // Handle the case where the country data is not found
                chartDiv.append("p").text("Solar capacity data not available for the selected country.");
            }
        }
    });

// })

// .catch(error => console.error('Error fetching data:', error));
// }

// Call the init function when the page loads
// init();





