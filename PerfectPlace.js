let map;
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
let layers = {
    "Housing Cost": L.layerGroup(),
    "Food Cost": L.layerGroup(),
    "Tax Rate": L.layerGroup(),
    "Income": L.layerGroup(),
    "Rain": L.layerGroup(),
    "Sun": L.layerGroup(),
};

function createMap() {
    map = L.map("map-id", {
        center: [40.73, -74.0059],
        zoom: 3
    });
    streetmap.addTo(map);

    d3.json("chat_sun_rain_data.json").then(createCountyLayers);

    L.control.layers({"Street Map": streetmap}, layers, { collapsed: false }).addTo(map);
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

            let popupContent = `
                <h3>${county['County']}</h3>
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

    layers[category].eachLayer(function(marker) {
        if (marker.categoryValue >= minRange && marker.categoryValue <= maxRange) {
            if (!marker.isVisible) {
                marker.addTo(map);
                marker.isVisible = true;
            }
        } else {
            if (marker.isVisible) {
                marker.removeFrom(map);
                marker.isVisible = false;
            }
        }
    });
}



createMap(); // Initialize the map and layers
