let map;

let allDataLayer = L.layerGroup(); // New layer for all data points

let layers = {
    "Housing Cost": L.layerGroup(),
    "Food Cost": L.layerGroup(),
    "Tax Rate": L.layerGroup(),
    "Income": L.layerGroup(),
    "Rain": L.layerGroup(),
    "Sun": L.layerGroup(),
    "All Data": allDataLayer // Add the new layer here
};

let farmersMarketLayer = L.layerGroup();

function loadFarmersMarkets() {
    d3.json("farmers_cord.json").then(data => {
        console.log("Farmers market data loaded", data);
        data.forEach(market => {
            let lat = parseFloat(market.latitude);
            let lon = parseFloat(market.longitude);
            let count = parseInt(market["Count of State"]);

            if (!isNaN(lat) && !isNaN(lon) && !isNaN(count)) {
                let radius = count * .5; // Adjust this factor to scale the size of the marker
                let marker = L.circleMarker([lat, lon], {
                    radius: radius,
                    fillColor: "#ff7800",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });

                let popupContent = `
                    <h3>${market["Row Labels"]}</h3>
                    <p>Number of Farmers Markets: ${count}</p>
                `;
                marker.bindPopup(popupContent);
                farmersMarketLayer.addLayer(marker);
            }
        });
    });
}

function createMap() {
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    map = L.map("map-id", {
        center: [40.73, -74.0059],
        zoom: 4
    });
    streetmap.addTo(map);

    d3.json("chat_sun_rain_data.json").then(createCountyLayers);
    loadFarmersMarkets(); 

    L.control.layers({"Street Map": streetmap}, Object.assign({}, layers, {"Farmers Markets": farmersMarketLayer}), { collapsed: false }).addTo(map);
}

function createCountyLayers(response) {
    response.forEach(county => {
        let lat = parseFloat(county.latitude);
        let lon = parseFloat(county.longitude);
        if (!isNaN(lat) && !isNaN(lon)) {
            let housingCost = parseFloat(county['Average of housing_cost']);
            let foodCost = parseFloat(county['Average of food_cost']);
            let taxRate = parseFloat(county['Average of total_tax_rate']);
            let income = parseFloat(county['Average of median_family_income']);
            let rain = parseFloat(county['Inches of Rain']);
            let sun = parseFloat(county['Days of Sun']);
            let facts = county["ChatGPT_Info"];

            let popupContent = `
                <h3>${county['County']}</h3>
                <p>${facts}</p>
                <p>Total Inches of Rain (per year): ${rain}</p>
                <p>Total Days of Sun (per year): ${sun}</p>
                <p>Average Housing Cost (per year): ${housingCost}</p>
                <p>Average Food Cost (per year): ${foodCost}</p>
                <p>Average Tax Rate: ${taxRate}</p>
                <p>Average Median Income (per year): ${income}</p>
                <a href="https://www.google.com/maps/search/?api=1&query=${lat},${lon}" target="_blank">View on Google Maps</a>
            `;

            let marker = L.marker([lat, lon]).bindPopup(popupContent);
            addMarkerToLayer('Housing Cost', housingCost, marker);
            addMarkerToLayer('Food Cost', foodCost, marker);
            addMarkerToLayer('Tax Rate', taxRate, marker);
            addMarkerToLayer('Income', income, marker);
            addMarkerToLayer('Rain', rain, marker);
            addMarkerToLayer('Sun', sun, marker);

            // Create a new marker for the all data layer
            let allDataMarker = L.marker([lat, lon]).bindPopup(popupContent);
            allDataMarker.data = { housingCost, foodCost, taxRate, income, rain, sun };
            allDataLayer.addLayer(allDataMarker);
        }
    });
}

function applyAllFilters() {
    // Get filter values
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

    allDataLayer.eachLayer(function(marker) {
        // Check if marker meets all filter criteria
        let data = marker.data;
        if (data.housingCost >= minHousingCost && data.housingCost <= maxHousingCost
            && data.foodCost >= minFoodCost && data.foodCost <= maxFoodCost
            && data.taxRate >= minTaxRate && data.taxRate <= maxTaxRate
            && data.income >= minIncome && data.income <= maxIncome
            && data.rain >= minRain && data.rain <= maxRain
            && data.sun >= minSun && data.sun <= maxSun) {
            marker.addTo(map);
        } else {
            marker.remove();
        }
    });
}


function addMarkerToLayer(category, value, marker) {
    let color, latOffset, lonOffset;
    switch (category) {
        case 'Housing Cost': 
            color = 'fuchsia'; 
            latOffset = 0.05; 
            lonOffset = 0.05;
            break;
        case 'Food Cost': 
            color = 'green'; 
            latOffset = -0.05; 
            lonOffset = 0.05;
            break;
        case 'Tax Rate': 
            color = 'red'; 
            latOffset = 0.05; 
            lonOffset = -0.05;
            break;
        case 'Income': 
            color = 'orange'; 
            latOffset = -0.05; 
            lonOffset = -0.05;
            break;
        case 'Rain': 
            color = 'blue'; 
            latOffset = -0.005; 
            lonOffset = -0.005;
            break;
        case 'Sun': 
            color = 'yellow'; 
            latOffset = 0.005; 
            lonOffset = 0.005;
            break;
        default: 
            color = 'gray'; 
            latOffset = 0; 
            lonOffset = 0;
    }

    let adjustedLatLng = new L.LatLng(marker.getLatLng().lat + latOffset, marker.getLatLng().lng + lonOffset);
    
    let circleMarker = L.circleMarker(adjustedLatLng, {
        radius: 8,
        fillColor: color,
        color: '#000',
        weight: 1,
        opacity: .5,
        fillOpacity: 0.5
    }).bindPopup(marker.getPopup().getContent());

    circleMarker.category = category;
    circleMarker.categoryValue = value;
    circleMarker.isVisible = true; // Initially all markers are visible

    layers[category].addLayer(circleMarker);
}

function updateRangeFilter(category, minId, maxId) {
    const minRange = parseFloat(document.getElementById(minId).value);
    const maxRange = parseFloat(document.getElementById(maxId).value);
    document.getElementById(minId + 'Value').textContent = minRange;
    document.getElementById(maxId + 'Value').textContent = maxRange;

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
}


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('minHousingCostRange').addEventListener('input', function() {
      updateRangeFilter('Housing Cost', 'minHousingCostRange', 'maxHousingCostRange');
    });
    document.getElementById('maxHousingCostRange').addEventListener('input', function() {
      updateRangeFilter('Housing Cost', 'minHousingCostRange', 'maxHousingCostRange');
    });

    document.getElementById('minFoodCostRange').addEventListener('input', function() {
      updateRangeFilter('Food Cost', 'minFoodCostRange', 'maxFoodCostRange');
    });
    document.getElementById('maxFoodCostRange').addEventListener('input', function() {
      updateRangeFilter('Food Cost', 'minFoodCostRange', 'maxFoodCostRange');
    });

    document.getElementById('minTaxRateRange').addEventListener('input', function() {
      updateRangeFilter('Tax Rate', 'minTaxRateRange', 'maxTaxRateRange');
    });
    document.getElementById('maxTaxRateRange').addEventListener('input', function() {
      updateRangeFilter('Tax Rate', 'minTaxRateRange', 'maxTaxRateRange');
    });

    document.getElementById('minIncomeRange').addEventListener('input', function() {
      updateRangeFilter('Income', 'minIncomeRange', 'maxIncomeRange');
    });
    document.getElementById('maxIncomeRange').addEventListener('input', function() {
      updateRangeFilter('Income', 'minIncomeRange', 'maxIncomeRange');
    });

    document.getElementById('minRainRange').addEventListener('input', function() {
      updateRangeFilter('Rain', 'minRainRange', 'maxRainRange');
    });
    document.getElementById('maxRainRange').addEventListener('input', function() {
      updateRangeFilter('Rain', 'minRainRange', 'maxRainRange');
    });

    document.getElementById('minSunRange').addEventListener('input', function() {
      updateRangeFilter('Sun', 'minSunRange', 'maxSunRange');
    });
    document.getElementById('maxSunRange').addEventListener('input', function() {
      updateRangeFilter('Sun', 'minSunRange', 'maxSunRange');
    });

  document.addEventListener('DOMContentLoaded', function() {
    // Event listeners for range inputs
    document.getElementById('minHousingCostRange').addEventListener('input', applyAllFilters);
    document.getElementById('maxHousingCostRange').addEventListener('input', applyAllFilters);
    document.getElementById('minFoodCostRange').addEventListener('input', applyAllFilters);
    document.getElementById('maxFoodCostRange').addEventListener('input', applyAllFilters);
    document.getElementById('minTaxRateRange').addEventListener('input', applyAllFilters);
    document.getElementById('maxTaxRateRange').addEventListener('input', applyAllFilters);
    document.getElementById('minIncomeRange').addEventListener('input', applyAllFilters);
    document.getElementById('maxIncomeRange').addEventListener('input', applyAllFilters);
    document.getElementById('minRainRange').addEventListener('input', applyAllFilters);
    document.getElementById('maxRainRange').addEventListener('input', applyAllFilters);
    document.getElementById('minSunRange').addEventListener('input', applyAllFilters);
    document.getElementById('maxSunRange').addEventListener('input', applyAllFilters);


});
createMap(); // Initialize the map and layers
});
