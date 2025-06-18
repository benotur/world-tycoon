const mapboxToken = 'pk.eyJ1IjoiYmVuNDc3IiwiYSI6ImNtYzBocWxkZDAyODkya3IzcnVuMzZhbGwifQ.FxKhBvo0839jqpUyKLqVfg';

const europeanCountries = [
    "ALB","AND","AUT","BLR","BEL","BIH","BGR","HRV","CYP","CZE","DNK","EST","FIN","FRA","DEU","GRC","HUN","ISL","IRL","ITA","LVA","LIE","LTU","LUX","MLT","MDA","MCO","MNE","NLD","MKD","NOR","POL","PRT","ROU","RUS","SMR","SRB","SVK","SVN","ESP","SWE","CHE","UKR","GBR","VAT"
];

const allCountries = [
    { id: "FRA", name: "France", buff: "Faster population growth", price: 0, requires: [] },
    { id: "DEU", name: "Germany", buff: "Higher starting money", price: 120, requires: ["FRA"] },
    { id: "ITA", name: "Italy", buff: "Industry upgrades are cheaper", price: 80, requires: ["FRA"] },
    { id: "ESP", name: "Spain", buff: "", price: 100, requires: ["FRA"] },
    { id: "BEL", name: "Belgium", buff: "", price: 60, requires: ["FRA", "DEU"] },
    { id: "NLD", name: "Netherlands", buff: "", price: 60, requires: ["BEL"] },
    { id: "CHE", name: "Switzerland", buff: "", price: 70, requires: ["FRA", "DEU"] },
    { id: "AUT", name: "Austria", buff: "", price: 70, requires: ["DEU"] },
    { id: "POL", name: "Poland", buff: "", price: 110, requires: ["DEU"] },
    { id: "CZE", name: "Czechia", buff: "", price: 60, requires: ["DEU"] },
    { id: "SVK", name: "Slovakia", buff: "", price: 60, requires: ["CZE"] },
    { id: "HUN", name: "Hungary", buff: "", price: 60, requires: ["SVK"] },
    { id: "SVN", name: "Slovenia", buff: "", price: 50, requires: ["AUT"] },
    { id: "HRV", name: "Croatia", buff: "", price: 50, requires: ["SVN"] },
    { id: "SRB", name: "Serbia", buff: "", price: 50, requires: ["HRV"] },
    { id: "ROU", name: "Romania", buff: "", price: 80, requires: ["HUN"] },
    { id: "BGR", name: "Bulgaria", buff: "", price: 70, requires: ["ROU"] },
    { id: "GRC", name: "Greece", buff: "", price: 90, requires: ["BGR"] },
    { id: "PRT", name: "Portugal", buff: "", price: 80, requires: ["ESP"] },
    { id: "GBR", name: "United Kingdom", buff: "", price: 100, requires: ["FRA"] },
    { id: "IRL", name: "Ireland", buff: "", price: 60, requires: ["GBR"] },
    { id: "DNK", name: "Denmark", buff: "", price: 80, requires: ["DEU"] },
    { id: "NOR", name: "Norway", buff: "", price: 100, requires: ["DNK"] },
    { id: "SWE", name: "Sweden", buff: "", price: 100, requires: ["DNK"] },
    { id: "FIN", name: "Finland", buff: "", price: 100, requires: ["SWE"] },
    { id: "EST", name: "Estonia", buff: "", price: 60, requires: ["FIN"] },
    { id: "LVA", name: "Latvia", buff: "", price: 60, requires: ["EST"] },
    { id: "LTU", name: "Lithuania", buff: "", price: 60, requires: ["LVA"] },
    { id: "BLR", name: "Belarus", buff: "", price: 80, requires: ["LTU"] },
    { id: "UKR", name: "Ukraine", buff: "", price: 100, requires: ["POL"] },
    { id: "MDA", name: "Moldova", buff: "", price: 60, requires: ["UKR"] },
    { id: "RUS", name: "Russia", buff: "", price: 200, requires: ["BLR"] },
    { id: "ISL", name: "Iceland", buff: "", price: 80, requires: ["GBR"] },
    { id: "LUX", name: "Luxembourg", buff: "", price: 40, requires: ["BEL"] },
    { id: "AND", name: "Andorra", buff: "", price: 40, requires: ["ESP", "FRA"] },
    { id: "MCO", name: "Monaco", buff: "", price: 40, requires: ["FRA"] },
    { id: "SMR", name: "San Marino", buff: "", price: 40, requires: ["ITA"] },
    { id: "VAT", name: "Vatican City", buff: "", price: 40, requires: ["ITA"] },
    { id: "LIE", name: "Liechtenstein", buff: "", price: 40, requires: ["CHE", "AUT"] },
    { id: "ALB", name: "Albania", buff: "", price: 50, requires: ["GRC"] },
    { id: "MNE", name: "Montenegro", buff: "", price: 50, requires: ["SRB"] },
    { id: "MKD", name: "North Macedonia", buff: "", price: 50, requires: ["SRB", "GRC"] },
    { id: "BIH", name: "Bosnia and Herzegovina", buff: "", price: 50, requires: ["HRV"] },
    { id: "MLT", name: "Malta", buff: "", price: 50, requires: ["ITA"] },
];

const industryTypes = [
    { id: "farm", name: "Farm", baseOutput: 5, popNeeded: 5, buildCost: 50, unlocksIn: ["FRA", "ITA"] },
    { id: "factory", name: "Factory", baseOutput: 15, popNeeded: 10, buildCost: 120, unlocksIn: ["DEU", "POL"] },
    { id: "tech", name: "Tech Park", baseOutput: 40, popNeeded: 20, buildCost: 300, unlocksIn: ["GBR", "SWE"] }
];

let unlocked = [];
let money = 100;
let population = 10;
let starterChosen = false;
let starterCountryId = null;
let upgradeCost = 50;
let populationGrowth = 1;
let populationInterval = null;
let industries = {};
let selectedCountry = null;

function getUnlockedCountryCodes() {
    return unlocked;
}

function getUnlockableCountryCodes() {
    return allCountries
        .filter(c => !unlocked.includes(c.id) && canUnlock(c))
        .map(c => c.id);
}

function getCountryByISO3(iso3) {
    return allCountries.find(c => c.id === iso3);
}

function updateGameInfo() {
    document.getElementById('money').textContent = money;
    document.getElementById('population').textContent = population;
}

function saveGameState() {
    const userKey = window.getCurrentUserKey && window.getCurrentUserKey();
    if (!userKey) return;
    firebase.database().ref('users/' + userKey + '/game').set({
        money,
        population,
        starterCountry: starterCountryId,
        unlocked,
        industries
    });
}

function loadGameState(callback) {
    const userKey = window.getCurrentUserKey && window.getCurrentUserKey();
    if (!userKey) return callback(null);
    firebase.database().ref('users/' + userKey + '/game').once('value').then(snapshot => {
        callback(snapshot.val());
    });
}

function canUnlock(country) {
    return country.requires.every(req => unlocked.includes(req));
}

// INDUSTRY SYSTEM
function getAvailableIndustries(countryId) {
    return industryTypes.filter(ind => ind.unlocksIn.includes(countryId));
}

function getCountryIndustries(countryId) {
    return industries[countryId] || [];
}

function totalPopulationUsed() {
    let used = 0;
    for (const countryId of unlocked) {
        const inds = getCountryIndustries(countryId);
        inds.forEach(ind => {
            const type = industryTypes.find(t => t.id === ind.type);
            if (type) used += type.popNeeded * ind.level;
        });
    }
    return used;
}

function totalIndustryIncome() {
    let income = 0;
    let availablePop = population;
    for (const countryId of unlocked) {
        const inds = getCountryIndustries(countryId);
        inds.forEach(ind => {
            const type = industryTypes.find(t => t.id === ind.type);
            if (type && availablePop >= type.popNeeded * ind.level) {
                let output = type.baseOutput * ind.level;
                if (countryId === "DEU" && type.id === "factory") output *= 1.5;
                if (countryId === "FRA" && type.id === "farm") output *= 1.5;
                income += output;
                availablePop -= type.popNeeded * ind.level;
            }
        });
    }
    return Math.floor(income);
}

function showManageIndustries(country) {
    const modal = document.getElementById('country-popup');
    let html = `<h3>Industries in ${country.name}</h3>`;
    const inds = getCountryIndustries(country.id);
    const available = getAvailableIndustries(country.id);

    html += `<p>Population used: ${totalPopulationUsed()} / ${population}</p>`;
    html += `<ul>`;
    inds.forEach((ind, idx) => {
        const type = industryTypes.find(t => t.id === ind.type);
        html += `<li>${type.name} (Level ${ind.level}) - Output: $${type.baseOutput * ind.level}/tick 
        <button class="button" onclick="upgradeIndustry('${country.id}',${idx})">Upgrade ($${type.buildCost * (ind.level + 1)})</button></li>`;
    });
    html += `</ul>`;

    html += `<h4>Build New Industry</h4>`;
    available.forEach(type => {
        html += `<button class="button" onclick="buildIndustry('${country.id}','${type.id}')">Build ${type.name} ($${type.buildCost})</button> `;
    });

    html += `<br><button class="button" onclick="closePopup()">Close</button>`;
    modal.querySelector("#popup-content").innerHTML = html;
    modal.style.display = "block";
}

window.buildIndustry = function(countryId, typeId) {
    const type = industryTypes.find(t => t.id === typeId);
    if (!type) return;
    if (money < type.buildCost) {
        alert("Not enough money!");
        return;
    }
    if (population - totalPopulationUsed() < type.popNeeded) {
        alert("Not enough available population!");
        return;
    }
    money -= type.buildCost;
    if (!industries[countryId]) industries[countryId] = [];
    industries[countryId].push({ type: typeId, level: 1 });
    updateGameInfo();
    saveGameState();
    showManageIndustries(getCountryByISO3(countryId));
};

window.upgradeIndustry = function(countryId, idx) {
    const ind = industries[countryId][idx];
    const type = industryTypes.find(t => t.id === ind.type);
    const cost = type.buildCost * (ind.level + 1);
    if (money < cost) {
        alert("Not enough money!");
        return;
    }
    if (population - totalPopulationUsed() < type.popNeeded) {
        alert("Not enough available population!");
        return;
    }
    money -= cost;
    ind.level += 1;
    updateGameInfo();
    saveGameState();
    showManageIndustries(getCountryByISO3(countryId));
};

window.closePopup = function() {
    document.getElementById('country-popup').style.display = "none";
    document.getElementById('floating-industries-btn').style.display = "none";
    selectedCountry = null;
};

function showCountryPopup(country) {
    selectedCountry = country;
    const popup = document.getElementById('country-popup');
    const content = document.getElementById('popup-content');
    if (unlocked.includes(country.id)) {
        content.innerHTML = `
            <h3>${country.name}</h3>
            <p>${country.buff}</p>
            <button class="button" onclick="upgradeCountry('${country.id}')">Upgrade (${upgradeCost} money)</button>
        `;
        document.getElementById('floating-industries-btn').style.display = "block";
    } else {
        content.innerHTML = `
            <h3>${country.name}</h3>
            <p>Locked</p>
            <p>${country.buff || ''}</p>
            <p>Price: ${country.price} money</p>
        `;
        document.getElementById('floating-industries-btn').style.display = "none";
        if (canUnlock(country)) {
            content.innerHTML += `<button class="button" onclick="unlockCountry('${country.id}')">Unlock (${country.price} money)</button>`;
        } else {
            content.innerHTML += `<p style="color:orange;">Requires: ${country.requires.map(r => getCountryByISO3(r).name).join(", ")}</p>`;
        }
    }
    popup.style.display = "block";
}

window.upgradeCountry = function(id) {
    if (money >= upgradeCost) {
        money -= upgradeCost;
        population += 5;
        updateGameInfo();
        saveGameState();
        alert("Upgraded! Population +5.");
    } else {
        alert("Not enough money!");
    }
    document.getElementById('country-popup').style.display = "none";
    document.getElementById('floating-industries-btn').style.display = "none";
    selectedCountry = null;
};

window.unlockCountry = function(id) {
    const country = getCountryByISO3(id);
    if (!country) return;
    if (!canUnlock(country)) {
        alert("You must unlock required countries first: " + country.requires.map(r => getCountryByISO3(r).name).join(", "));
        return;
    }
    if (unlocked.includes(id)) {
        alert("Already unlocked!");
        return;
    }
    if (money >= country.price) {
        unlocked.push(id);
        money -= country.price;
        updateMapboxLayer();
        updateGameInfo();
        saveGameState();
        document.getElementById('country-popup').style.display = "none";
        document.getElementById('floating-industries-btn').style.display = "none";
        selectedCountry = null;
    } else {
        alert("Not enough money!");
    }
};

function updateMapboxLayer() {
    if (!window.map) return;
    const unlockedCodes = unlocked;
    const unlockableCodes = getUnlockableCountryCodes();

    window.map.setPaintProperty('country-highlight', 'fill-color', [
        'case',
        ['in', ['get', 'iso_3166_1_alpha_3'], ['literal', unlockedCodes]], '#4caf50',
        ['in', ['get', 'iso_3166_1_alpha_3'], ['literal', unlockableCodes]], '#e0e0e0',
        '#222'
    ]);
}

function showStarterCountryModal() {
    const modal = document.getElementById('starter-country-modal');
    const options = document.getElementById('starter-country-options');
    options.innerHTML = '';
    allCountries.filter(c => c.price === 0).forEach(country => {
        const div = document.createElement('div');
        div.style.margin = '15px 0';
        div.innerHTML = `
            <strong>${country.name}</strong><br>
            <span>${country.buff}</span><br>
            <button class="button" onclick="chooseStarterCountry('${country.id}')">Choose</button>
        `;
        options.appendChild(div);
    });
    modal.style.display = 'block';
}

window.chooseStarterCountry = function(id) {
    starterChosen = true;
    starterCountryId = id;
    unlocked = [id];
    industries = {};

    if (id === "DEU") {
        money = 200;
        population = 10;
        upgradeCost = 50;
        populationGrowth = 1;
    } else if (id === "ITA") {
        money = 100;
        population = 10;
        upgradeCost = 25;
        populationGrowth = 1;
    } else if (id === "FRA") {
        money = 100;
        population = 20;
        upgradeCost = 50;
        populationGrowth = 2;
    } else {
        money = 100;
        population = 10;
        upgradeCost = 50;
        populationGrowth = 1;
    }

    updateGameInfo();
    updateMapboxLayer();
    document.getElementById('starter-country-modal').style.display = 'none';
    saveGameState();

    if (populationInterval) clearInterval(populationInterval);
    populationInterval = setInterval(() => {
        population += populationGrowth;
        money += totalIndustryIncome();
        updateGameInfo();
        saveGameState();
    }, 3000);
};

function startPopulationGrowthAndIncome() {
    if (populationInterval) clearInterval(populationInterval);
    populationInterval = setInterval(() => {
        population += populationGrowth;
        money += totalIndustryIncome();
        updateGameInfo();
        saveGameState();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    updateGameInfo();

    loadGameState((game) => {
        if (game && game.starterCountry) {
            starterCountryId = game.starterCountry;
            starterChosen = true;
            unlocked = Array.isArray(game.unlocked) ? game.unlocked : [starterCountryId];
            industries = game.industries || {};
            if (starterCountryId === "DEU") {
                money = game.money || 200;
                population = game.population || 10;
                upgradeCost = 50;
                populationGrowth = 1;
            } else if (starterCountryId === "ITA") {
                money = game.money || 100;
                population = game.population || 10;
                upgradeCost = 25;
                populationGrowth = 1;
            } else if (starterCountryId === "FRA") {
                money = game.money || 100;
                population = game.population || 20;
                upgradeCost = 50;
                populationGrowth = 2;
            } else {
                money = game.money || 100;
                population = game.population || 10;
                upgradeCost = 50;
                populationGrowth = 1;
            }
            updateGameInfo();
            updateMapboxLayer();
            startPopulationGrowthAndIncome();
        } else {
            showStarterCountryModal();
        }
    });

    mapboxgl.accessToken = mapboxToken;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [15, 54],
        zoom: 3.5
    });
    window.map = map;

    map.once('style.load', () => {
        map.setProjection('mercator');
    });

    map.on('load', () => {
        map.addSource('countries', {
            type: 'vector',
            url: 'mapbox://mapbox.country-boundaries-v1'
        });
        map.addLayer({
            'id': 'country-highlight',
            'type': 'fill',
            'source': 'countries',
            'source-layer': 'country_boundaries',
            'filter': ['in', ['get', 'iso_3166_1_alpha_3'], ['literal', europeanCountries]],
            'paint': {
                'fill-color': [
                    'case',
                    ['in', ['get', 'iso_3166_1_alpha_3'], ['literal', unlocked]], '#4caf50',
                    ['in', ['get', 'iso_3166_1_alpha_3'], ['literal', getUnlockableCountryCodes()]], '#e0e0e0',
                    '#222'
                ],
                'fill-opacity': 0.7
            }
        });

        map.addLayer({
            'id': 'country-outline',
            'type': 'line',
            'source': 'countries',
            'source-layer': 'country_boundaries',
            'filter': ['in', ['get', 'iso_3166_1_alpha_3'], ['literal', europeanCountries]],
            'paint': {
                'line-color': '#fff',
                'line-width': 1
            }
        });

        map.on('click', 'country-highlight', (e) => {
            const feature = e.features[0];
            const iso3 = feature.properties.iso_3166_1_alpha_3;
            const country = getCountryByISO3(iso3);
            if (country) showCountryPopup(country);
        });

        map.on('mouseenter', 'country-highlight', () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'country-highlight', () => {
            map.getCanvas().style.cursor = '';
        });
    });

    document.getElementById('close-popup').onclick = () => {
        document.getElementById('country-popup').style.display = "none";
        document.getElementById('floating-industries-btn').style.display = "none";
        selectedCountry = null;
    };

    document.getElementById('floating-industries-btn').onclick = function() {
        if (selectedCountry && unlocked.includes(selectedCountry.id)) {
            showManageIndustries(selectedCountry);
        }
    };
});