/*Global variables */
var searchTerm = document.getElementById("searchTerm");
var limitVal = 50; /* temp field for testing, can be replaced with user input*/
/*Array of search objects found with single search*/
var currentView = 'list';
var searchResults = localStorage.getItem('incidents')? JSON.parse(localStorage.getItem('incidents')) : [];
var lastSearchTerm = localStorage.getItem('lastSearchTerm')? localStorage.getItem('lastSearchTerm') : '';

var searchBtnEl = document.querySelector('#search-button');
var switchBtnEl = document.querySelector('#switch-button');

searchBtnEl.addEventListener('click',searchIncidents);
switchBtnEl.addEventListener('click', buttonSwitch);

const API_KEY = 'AIzaSyAkyWj8KKqiOI4fXLQMJASgN7smEGqGPAc';

const markerIcons = {
    Hazard: {
      icon: './assets/images/pin-16-orange.png',
    },
    Accident: {
      icon: './assets/images/pin-16-red.png',
    },
    Theft: {
      icon:  './assets/images/pin-16-purple.png',
    },
};

var userLocation = localStorage.getItem('userLocation')? JSON.parse(localStorage.getItem('userLocation')) : {
    lat: 37.3394,
    lon: -121.895
};

/*Search Button function */
function searchIncidents(target) {
    target.preventDefault();

    var searchTerm = document.querySelector('#searchTerm').value;

    if (searchTerm === '') {
        return false;
    }

    fetch (
        /* Google geocode API key and query*/
        'https://maps.googleapis.com/maps/api/geocode/json?address='+searchTerm+'&key='+API_KEY
    ).then (function(geoCodeResponse) {
        return geoCodeResponse.json();
    })
    .then(function(geoCode){
        userLocation.lat = geoCode.results[0].geometry.location.lat;
        userLocation.lon = geoCode.results[0].geometry.location.lng;
        proximity=userLocation.lat+','+userLocation.lon;

        localStorage.setItem ('lastSearchTerm', searchTerm);

        initMap();

        fetch (
            /*Bikewise API key and query*/
            'https://bikewise.org:443/api/v2/locations?proximity='+proximity+'&proximity_square=100&limit='+ limitVal +'&all=false'
        )
        .then(function(response){
           return response.json();
        })
        .then(function(response){
            var incidents = response.features;
            searchResults = [];
            incidents.forEach(incident => {
                var incidentType = incident.properties.type;
                if (incidentType === "Theft" || incidentType === "Hazard" || incidentType === "Crash") { // We can replace this with a seperate function later if necessary
                    var searchID = incident.properties.id
                    fetch('https://bikewise.org:443/api/v2/incidents/'+ searchID)
                    .then(function(incidentResponse){
                        return incidentResponse.json();
                    })
                    .then(function(incidentResponse){
                        var incidentObject = new Object({
                            id: incidentResponse.incident.id,
                            title: incidentResponse.incident.title,
                            type: incidentResponse.incident.type,
                            address: incidentResponse.incident.address,
                            description: incidentResponse.incident.description,
                            occurred_at: incidentResponse.incident.occurred_at,
                            coordinates: [incident.geometry.coordinates[0], incident.geometry.coordinates[1]]
                        });

                        searchResults.push(incidentObject);
                        localStorage.setItem('incidents',JSON.stringify(searchResults));
                        
                    })
                    .catch(error => console.log(error));
                }
            });
            return searchResults;
        })
        .then (listResultLocations(searchResults))
        .catch(error => console.log(error));
        
    })
    .catch(error => console.log(error));
}

function addMarker (incident) {

    var occurredOn = new Date(incident.occurred_at*1000);

    var incidentDescription = '<div class="map-popup">' +
        '<h4>' + incident.title + '</h4>' +
        '<p>' +
        '<strong>Description: </strong>'+ incident.description + '<br>' +
        '<strong>Address: </strong>'+ incident.address + '<br>' +
        '<strong>Occurred on: </strong>'+ occurredOn.toLocaleDateString('en-US',{weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'}) + '<br>' +
        '</p> </div>';

    var infowindow = new google.maps.InfoWindow({
            content: incidentDescription,
        });

    var marker = new google.maps.Marker({
        position: {lat: incident.coordinates[1],lng:incident.coordinates[0]},
        map: map,
        icon: markerIcons[incident.type].icon,
        title: incident.title,
        scale: 2
    }); 

    marker.addListener("click", () => {
        infowindow.open(map, marker);
    });
}

function getGeoLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    userLocation.lat = position.coords.latitude;
    userLocation.lon = position.coords.longitude;
    localStorage.setItem('userLocation',JSON.stringify(userLocation));
}


function listResultLocations(searchResults){
    
    var incidents = searchResults;
    var hazardsEl = document.querySelector('#hazard-list');
    var accidentsEl = document.querySelector('#accident-list');
    var theftsEl = document.querySelector('#theft-list');
    var noHazards = 1; 
    var noAccidents = 1;
    var noThefts = 1;

    hazardsEl.innerHTML = '';
    accidentsEl.innerHTML = '';
    theftsEl.innerHTML = '';
    
    for (i=0; i<incidents.length; i++ ) {
        var li = document.createElement("li");

        var occurredOn = new Date(incidents[i].occurred_at*1000);

        li.innerHTML = 
            '<h4>' + incidents[i].title + '</h4>' +
            '<p>' +
            '<strong>Description: </strong>'+ incidents[i].description + '<br>' +
            '<strong>Address: </strong>'+ incidents[i].address + '<br>' +
            '<strong>Occurred on: </strong>'+ occurredOn.toLocaleDateString('en-US',{weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'}) + '<br>' +
            '</p>';

        if (incidents[i].type === 'Hazard') {
            noHazards = 0;
            hazardsEl.appendChild(li);
        } else if (incidents[i].type === 'Theft') {
            noThefts = 0;
            theftsEl.appendChild(li);
        } else {
            noHazards = 0;
            accidentsEl.appendChild(li);
        }

        addMarker(incidents[i]);
    }

    
    if (noAccidents) {
        var li = document.createElement("li");
        li.innerHTML = "<h4>No accidents found in this area</h4>";
        accidentsEl.appendChild(li);
    } 
    if (noHazards) {
        var li = document.createElement("li");
        li.innerHTML = "<h4>No hazards found in this area</h4>";
        hazardsEl.appendChild(li);
    } 
    if (noThefts) {
        var li = document.createElement("li");
        li.innerHTML = "<h4>No thefts found in this area</h4>";
        theftsEl.appendChild(li);
    } 
            
}

/* Toggle from list to map and vice-versa */
function buttonSwitch(target){
    target.preventDefault();

    var mapEl = document.querySelector('#map-results');
    var listEl = document.querySelector('#list-results');

    if (currentView === 'list') {
        mapEl.setAttribute('style','display: block;');
        listEl.setAttribute('style', 'display: none;');
        currentView ='map';
        switchBtnEl.innerHTML = 'Switch to List';
    } else {
        mapEl.setAttribute('style','display: none;');
        listEl.setAttribute('style', 'display: block;');
        currentView = 'list';
        switchBtnEl.innerHTML = 'Switch to Map';
    }
}

let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: userLocation.lat, lng: userLocation.lon },
        zoom: 12,
    });
}
/*
function initialize() {
    if (lastSearchTerm!='' && searchResults.length > 0) {
        var searchTermEl = document.querySelector('#searchTerm');
        searchTermEl.value = lastSearchTerm;
        
        fetch (
            'https://maps.googleapis.com/maps/api/geocode/json?address='+searchTermEl.value+'&key='+API_KEY
        ).then (function(geoCodeResponse) {
            return geoCodeResponse.json();
        })
        .then(function(geoCode){
            userLocation.lat = geoCode.results[0].geometry.location.lat;
            userLocation.lon = geoCode.results[0].geometry.location.lng;
            proximity=userLocation.lat+','+userLocation.lon;
            initMap();
            listResultLocations(searchResults);
        });
        
    }
    
}

initialize();*/