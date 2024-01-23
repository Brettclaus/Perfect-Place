// Initialize global variables for map and layer groups
let map;
let allDataLayer = L.layerGroup(); // Layer for all data points
let farmersMarketLayer = L.layerGroup(); // Layer for farmers markets
let violentCrimeLayer = L.layerGroup(); // Layer for violent crimes
let propertyCrimeLayer = L.layerGroup(); // Layer for property crimes
let colIndexLayer = L.layerGroup(); // Layer for cost of living index
let fastFoodLayer = L.layerGroup(); // Layer for fast food locations
let travelScoreLayer = L.layerGroup(); // Layer for travel scores

// Object containing all the layers for toggling on/off
let layers = {
    "Housing Cost": L.layerGroup(),
    "Food Cost": L.layerGroup(),
    "Tax Rate": L.layerGroup(),
    "Income": L.layerGroup(),
    "Rain": L.layerGroup(),
    "Sun": L.layerGroup(),
    "All Data": allDataLayer,
    "Farmers Markets": farmersMarketLayer,
    "Fast Food Types": fastFoodLayer,
    "Cost of Living Index": colIndexLayer,
    "Violent Crime Rate": violentCrimeLayer,
    "Property Crime Rate": propertyCrimeLayer,
    "Average Travel Score": travelScoreLayer,
};

// Function to load travel score data and add to the map
function loadTravelScoreData() {
    d3.json("travel_coord.json").then(data => {
        data.forEach(city => {
            // Extracting latitude, longitude, and travel score
            let lat = parseFloat(city.latitude);
            let lon = parseFloat(city.longitude);
            let travelScore = parseFloat(city["Average Travel Score"]);
        if (!isNaN(lat) && !isNaN(lon)) { // Check for NaN values

            // Determining marker color based on travel score
            let travelColor = travelScore < 40 ? "red" : travelScore < 60 ? "orange" : "green";

            // Creating a marker for each city
            let travelScoreMarker = L.circleMarker([lat, lon], {
                radius: 5,
                fillColor: travelColor,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(`<h3>${city.City}, ${city.State}</h3><p>Average Travel Score: ${travelScore}</p>`);

            // Adding the marker to the travel score layer
            travelScoreLayer.addLayer(travelScoreMarker);
        }
        });
    });
}

// Function to load violent crime data and add to the map
function loadViolentCrimeData() {
    d3.json("crime_coord.json").then(data => {
        data.forEach(city => {
            // Extracting latitude, longitude, and violent crime rate
            let lat = parseFloat(city.latitude);
            let lon = parseFloat(city.longitude);
            let violentCrimeRate = parseFloat(city["Violent Crime"]);
        if (!isNaN(lat) && !isNaN(lon)) { // Check for NaN values

            // Determining marker color based on violent crime rate
            let violentCrimeColor = violentCrimeRate < 200 ? "green" : violentCrimeRate < 400 ? "orange" : "red";

            // Creating a marker for each city
            let violentCrimeMarker = L.circleMarker([lat, lon], {
                radius: 5,
                fillColor: violentCrimeColor,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(`<h3>${city.City}, ${city.State}</h3><p>Violent Crime Rate: ${violentCrimeRate}</p>`);

            // Adding the marker to the violent crime layer
            violentCrimeLayer.addLayer(violentCrimeMarker);
        }
        });
    });
}

// Function to load property crime data and add to the map
function loadPropertyCrimeData() {
    d3.json("crime_coord.json").then(data => {
        data.forEach(city => {
            // Extracting latitude, longitude, and property crime rate
            let lat = parseFloat(city.latitude);
            let lon = parseFloat(city.longitude);
            let propertyCrimeRate = parseFloat(city["Property Crime"]);
        if (!isNaN(lat) && !isNaN(lon)) { // Check for NaN values

            // Determining marker color based on property crime rate
            let propertyCrimeColor = propertyCrimeRate < 2000 ? "green" : propertyCrimeRate < 3000 ? "orange" : "red";

            // Creating a marker for each city
            let propertyCrimeMarker = L.circleMarker([lat, lon], {
                radius: 5,
                fillColor: propertyCrimeColor,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(`<h3>${city.City}, ${city.State}</h3><p>Property Crime Rate: ${propertyCrimeRate}</p>`);

            // Adding the marker to the property crime layer
            propertyCrimeLayer.addLayer(propertyCrimeMarker);
        }
        });
    });
}

// Function to load Cost of Living Index (COLI) data and add to the map
function loadCOLIndex() {
    d3.json("COL_coord.json").then(data => {
        data.forEach(city => {
            // Extracting latitude, longitude, and COLI
            let lat = parseFloat(city.latitude);
            let lon = parseFloat(city.longitude);
            let colIndex = parseFloat(city["Cost of Living Index"]);
        if (!isNaN(lat) && !isNaN(lon)) { // Check for NaN values

            // Determining marker color based on COLI
            let markerColor = colIndex < 99 ? "green" : colIndex < 110 ? "orange" : "red";

            // Creating a marker for each city
            let marker = L.circleMarker([lat, lon], {
                radius: 5,
                fillColor: markerColor,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(`<h3>${city.City}, ${city.State}</h3><p>Cost of Living Index: ${colIndex}</p>`);

            // Adding the marker to the COLI layer
            colIndexLayer.addLayer(marker);
        }
        });
    });
}

// Function to load farmers market data and add to the map
function loadFarmersMarkets() {
    d3.json("farmers_coord.json").then(data => {
        data.forEach(market => {
            // Extracting latitude, longitude, and market count
            let lat = parseFloat(market.latitude);
            let lon = parseFloat(market.longitude);
            let count = parseFloat(market["Count of State"]);
        if (!isNaN(lat) && !isNaN(lon)) { // Check for NaN values

            // Creating a marker for each farmers market location
            let marker = L.circleMarker([lat, lon], {
                radius: count *.5, // Scaling radius based on count
                fillColor: "green",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7
            }).bindPopup(`<h3>${market["Row Labels"]}</h3><p>Number of Farmers Markets: ${count}</p>`);

            // Adding the marker to the farmers market layer
            farmersMarketLayer.addLayer(marker);
        }
        });
    });
}

// Function to load fast food data and add to the map
function loadFastFood() {
    d3.json("fastFood_coord.json").then(data => {
        data.forEach(city => {
            // Extracting latitude, longitude, and fast food chain count
            let lat = parseFloat(city.latitude);
            let lon = parseFloat(city.longitude);
            let count = parseInt(city["UniqueFastFoodChains"]);
        if (!isNaN(lat) && !isNaN(lon)) { // Check for NaN values

            // Creating a marker for each fast food location
            let marker = L.circleMarker([lat, lon], {
                radius: count * 2, // Scaling radius based on count
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7
            }).bindPopup(`<h3>${city["City"]}</h3><p>Number of Unique Fast Food Options: ${count}</p>`);

            // Adding the marker to the fast food layer
            fastFoodLayer.addLayer(marker);
        }
        });
    });
}

// Function to create and initialize the map
function createMap() {
    // Base map layer configurations
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Initializing the map
    map = L.map("map-id", {
        center: [40.73, -74.0059],
        zoom: 4
    });

    // Loading Appalachian Trail data as a geoJSON layer
    /*fetch('Full_AT.json')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function (feature) {
                return {color: "#008000"};
            }
        }).addTo(map);
    });

    // Loading Pacific Crest Trail data as a geoJSON layer
    fetch('Full_PCT.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function (feature) {
                return {color: "#008000"};
            }
        }).addTo(map);
    });*/

       // Adding the base map layer and initializing other data layers
       streetmap.addTo(map);
       d3.json("chat_sun_rain_data.json").then(createCountyLayers);
       loadFarmersMarkets();
       loadPropertyCrimeData();
       loadViolentCrimeData();
       loadFastFood();
       loadCOLIndex();
       loadTravelScoreData();
   
       // Adding a layer control to toggle different layers
       L.control.layers({"Street Map": streetmap}, layers, { collapsed: false }).addTo(map);
   }
   
   // Function to create layers based on county data
   function createCountyLayers(response) {
       response.forEach(county => {
           // Extracting latitude, longitude, and other county data
           let lat = parseFloat(county.latitude);
           let lon = parseFloat(county.longitude);
        if (!isNaN(lat) && !isNaN(lon)) { // Check for NaN values

           // Creating a popup content for each county
           let facts = county["ChatGPT_Info"];
           let popupContent = `<h3>${county['County']}</h3><p>${facts}</p>
                               <p>Total Inches of Rain (per year): ${county['Inches of Rain']}</p>
                               <p>Total Days of Sun (per year): ${county['Days of Sun']}</p>
                               <p>Average Housing Cost (per year): ${county['Average of housing_cost']}</p>
                               <p>Average Food Cost (per year): ${county['Average of food_cost']}</p>
                               <p>Average Tax Rate: ${county['Average of total_tax_rate']}</p>
                               <p>Average Median Income (per year): ${county['Average of median_family_income']}</p>
                               <a href="https://www.google.com/maps/search/?api=1&query=${lat},${lon}" target="_blank">View on Google Maps</a>`;
   
           // Creating a marker for each county
           let marker = L.marker([lat, lon]).bindPopup(popupContent);
   
           // Adding markers to respective layers based on category
           addMarkerToLayer('Housing Cost', county['Average of housing_cost'], marker);
           addMarkerToLayer('Food Cost', county['Average of food_cost'], marker);
           addMarkerToLayer('Tax Rate', county['Average of total_tax_rate'], marker);
           addMarkerToLayer('Income', county['Average of median_family_income'], marker);
           addMarkerToLayer('Rain', county['Inches of Rain'], marker);
           addMarkerToLayer('Sun', county['Days of Sun'], marker);
   
           // Creating a marker for the all data layer
           let allDataMarker = L.marker([lat, lon]).bindPopup(popupContent);
           allDataMarker.data = {
               housingCost: county['Average of housing_cost'],
               foodCost: county['Average of food_cost'],
               taxRate: county['Average of total_tax_rate'],
               income: county['Average of median_family_income'],
               rain: county['Inches of Rain'],
               sun: county['Days of Sun']
           };
           allDataLayer.addLayer(allDataMarker);
        }
       });
   }
   
   // Function to add markers to specified layer with offset for overlapping markers
   function addMarkerToLayer(category, value, marker) {
       // Color and position offset based on category
       let color, latOffset, lonOffset;
       switch (category) {
           case 'Housing Cost': color = 'fuchsia'; latOffset = 0.05; lonOffset = 0.05; break;
           case 'Food Cost': color = 'green'; latOffset = -0.05; lonOffset = 0.05; break;
           case 'Tax Rate': color = 'red'; latOffset = 0.05; lonOffset = -0.05; break;
           case 'Income': color = 'orange'; latOffset = -0.05; lonOffset = -0.05; break;
           case 'Rain': color = 'blue'; latOffset = -0.005; lonOffset = -0.005; break;
           case 'Sun': color = 'yellow'; latOffset = 0.005; lonOffset = 0.005; break;
           default: color = 'gray'; latOffset = 0; lonOffset = 0;
       }
   
       // Creating a circle marker with the specified offset
       let adjustedLatLng = new L.LatLng(marker.getLatLng().lat + latOffset, marker.getLatLng().lng + lonOffset);
       let circleMarker = L.circleMarker(adjustedLatLng, {
           radius: 8,
           fillColor: color,
           color: '#000',
           weight: 1,
           opacity: 1,
           fillOpacity: 0.8
       }).bindPopup(marker.getPopup().getContent());
   
       // Setting marker properties and adding to the corresponding layer
       circleMarker.category = category;
       circleMarker.categoryValue = value;
       circleMarker.isVisible = true;
       layers[category].addLayer(circleMarker);
   }
   
   // Function to update markers based on filter range values
   function updateRangeFilter(category, minId, maxId) {
       // Getting the current range filter values
       const minRange = parseFloat(document.getElementById(minId).value);
       const maxRange = parseFloat(document.getElementById(maxId).value);
   
       // Displaying the current range values
       document.getElementById(minId + 'Value').textContent = minRange;
       document.getElementById(maxId + 'Value').textContent = maxRange;
   
       // Updating visibility of markers based on filter values
       if (map.hasLayer(layers[category])) {
           layers[category].eachLayer(function(marker) {
               if (marker.categoryValue >= minRange && marker.categoryValue <= maxRange) {
                   if (!map.hasLayer(marker)) {
                       marker.addTo(map);
                       marker.isVisible = true;
                   }
               } else {
                   if (map.hasLayer(marker)) {
                       marker.remove();
                       marker.isVisible = false;
                   }
               }
           });
       }
   
       // Updating the all data layer if it is active
       if (map.hasLayer(allDataLayer)) {
           applyAllFilters();
       }
   }
   
   // Function to apply all filters across layers
   function applyAllFilters() {
       // Getting filter values for each category
       let minHousingCost = parseFloat(document.getElementById('minHousingCostRange').value);
       let maxHousingCost = parseFloat(document.getElementById('maxHousingCostRange').value);
       let minFoodCost = parseFloat(document.getElementById('minFoodCostRange').value);
       let maxFoodCost = parseFloat(document.getElementById('maxFoodCostRange').value);
       let minTaxRate = parseFloat(document.getElementById('minTaxRateRange').value);
       let maxTaxRate = parseFloat(document.getElementById('maxTaxRateRange').value);
       let minIncome = parseFloat(document.getElementById('minIncomeRange').value);
       let maxIncome = parseFloat(document.getElementById('maxIncomeRange').value);
       let minRain = parseFloat(document.getElementById('minRainRange').value);
       let maxRain = parseFloat(document.getElementById('maxRainRange').value);
       let minSun = parseFloat(document.getElementById('minSunRange').value);
       let maxSun = parseFloat(document.getElementById('maxSunRange').value);
   
       // Updating marker visibility based on combined filter values
       if (map.hasLayer(allDataLayer)) {
           allDataLayer.eachLayer(function(marker) {
               let data = marker.data;
               if (data.housingCost >= minHousingCost && data.housingCost <= maxHousingCost &&
                   data.foodCost >= minFoodCost && data.foodCost <= maxFoodCost &&
                   data.taxRate >= minTaxRate && data.taxRate <= maxTaxRate &&
                   data.income >= minIncome && data.income <= maxIncome &&
                   data.rain >= minRain && data.rain <= maxRain &&
                   data.sun >= minSun && data.sun <= maxSun) {
                   if (!map.hasLayer(marker)) {
                       marker.addTo(map);
                   }
               } else {
                   if (map.hasLayer(marker)) {
                       marker.remove();
                   }
               }
           });
       }
   }
   
   // Event listener for document load to initialize the map and set up filters
   document.addEventListener('DOMContentLoaded', function() {
       // Function to update all layers based on the current filter values
       function updateAllLayers() {
           updateRangeFilter('Housing Cost', 'minHousingCostRange', 'maxHousingCostRange');
           updateRangeFilter('Food Cost', 'minFoodCostRange', 'maxFoodCostRange');
           updateRangeFilter('Tax Rate', 'minTaxRateRange', 'maxTaxRateRange');
           updateRangeFilter('Income', 'minIncomeRange', 'maxIncomeRange');
           updateRangeFilter('Rain', 'minRainRange', 'maxRainRange');
           updateRangeFilter('Sun', 'minSunRange', 'maxSunRange');
           applyAllFilters();
       }
   
       // Adding event listeners to each filter range input for real-time updates
       document.querySelectorAll('.filter-section input[type=range]').forEach(input => {
           input.addEventListener('input', updateAllLayers);
       });
   
       // Initializing the map with layers
       createMap();
   });
   