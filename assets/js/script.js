/*Global variables */
var searchTerm = document.getElementById("searchTerm");
var limitVal = 100; /* temp field for testing, can be replaced with user input*/
var searches = []; /*Array of all searches*/
var searchResults = [];/*Array of search objects found with single search*/

var searchBtnEl = document.querySelector('#search-button');
searchBtnEl.addEventListener('click',searchIncidents);

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

/* Pseudocode logic 

1. On Search click - Get geocode coordinates to center map there
2. Get incidents by proximity using the coordinates received before
3. Display list of incidents
4. Create map on proximity coordinates

*/

/*Search Button function */
function searchIncidents(target) {
    target.preventDefault();
    var searchTerm = document.querySelector('#searchTerm').value;
    
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
            incidents.forEach(incident => {
                var incidentType = incident.properties.type;
                if (incidentType === "Theft" || incidentType === "Hazard" || incidentType === "Crash") { // We can replace this with a seperate function later if necessary
                    var searchID = incident.properties.id
                    fetch('https://bikewise.org:443/api/v2/incidents/'+ searchID)
                    .then(function(incidentResponse){
                        return incidentResponse.json();
                    })
                    .then(function(incidentResponse){
                        var incidentObject = {
                            id: incidentResponse.incident.id,
                            title: incidentResponse.incident.title,
                            type: incidentResponse.incident.type,
                            address: incidentResponse.incident.address,
                            description: incidentResponse.incident.description,
                            occurred_at: incidentResponse.incident.occurred_at,
                            coordinates: incident.geometry.coordinates
                        };
                        searchResults.push(incidentObject);
                        addMarker(incidentObject);
                    })
                    .catch(error => console.log(error));
                }
            });
            console.log(searchResults);
            storeIncidents(searchResults);
        })
        .catch(error => console.log(error));
    });
}

function storeIncidents(data) {
    localStorage.setItem('incidents',JSON.stringify(data));
}

function addMarker (incident) {
    console.log(incident.title);
    var marker = new google.maps.Marker({
        position: {lat: incident.coordinates[1],lng:incident.coordinates[0]},
        map: map,
        icon: markerIcons[incident.type].icon,
        title: incident.title,
        scale: 2
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


let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: userLocation.lat, lng: userLocation.lon },
        zoom: 12,
    });

}