let map;
let layers = {
    "Housing Cost": L.layerGroup(),
    "Food Cost": L.layerGroup(),
    "Tax Rate": L.layerGroup(),
    "Income": L.layerGroup()
};

function createMap() {
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    map = L.map("map-id", {
        center: [40.73, -74.0059],
        zoom: 3,
        layers: [streetmap, ...Object.values(layers)]
    });

    L.control.layers({"Street Map": streetmap}, layers, {collapsed: false}).addTo(map);
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

            let popupContent = `
                <h3>${county['\ufeffRow Labels']}</h3>
                <p>Housing Cost: ${housingCost}</p>
                <p>Food Cost: ${foodCost}</p>
                <p>Tax Rate: ${taxRate}</p>
                <p>Income: ${income}</p>
                <a href="https://www.google.com/maps/search/?api=1&query=${lat},${lon}" target="_blank">View on Google Maps</a>
            `;

            let marker = L.marker([lat, lon]).bindPopup(popupContent);
            addMarkerToLayer('Housing Cost', housingCost, marker);
            addMarkerToLayer('Food Cost', foodCost, marker);
            addMarkerToLayer('Tax Rate', taxRate, marker);
            addMarkerToLayer('Income', income, marker);
        }
    });

    createMap();
}

function addMarkerToLayer(category, value, marker) {
    marker[category] = value;
    layers[category].addLayer(marker);
}

function updateRangeFilter(category, minId, maxId) {
    const minRange = parseFloat(document.getElementById(minId).value);
    const maxRange = parseFloat(document.getElementById(maxId).value);
    document.getElementById(minId + 'Value').textContent = minRange;
    document.getElementById(maxId + 'Value').textContent = maxRange;

    layers[category].eachLayer(function(marker) {
        if (marker[category] >= minRange && marker[category] <= maxRange) {
            marker.addTo(map);
        } else {
            marker.remove();
        }
    });
}

d3.json("counties_col.json").then(createCountyLayers);
