var currentLocationName = '';
var currentLocation = 
    {
        lat: 0,
        lon: 0
    }
var incidentsArray = [];

function getGeoLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    currentLocation.lat = position.coords.latitude;
    currentLocation.lon = position.coords.longitude;
    getIncidentsByCoordinates();
}

function getIncidentsByCoordinates(){
    console.log(currentLocation);
    fetch(
        'https://bikewise.org:443/api/v2/locations?page=1&proximity='+currentLocation.lat+'%2C'+currentLocation.lon+
        '&proximity_square=100&limit=25'
    )
    .then(function(incidentResponse) {
        return incidentResponse.json();
    })
    .then(function(incidentResponse){
        console.log(incidentResponse.features);
        var incidents = incidentResponse.features;
        incidents.forEach(incident => {
            fetch('https://bikewise.org:443/api/v2/incidents/'+incidentDetails.incident.id)
            .then(function(incidentDetails) {
                return incidentDetails.json();
            })
            .then(function(incidentDetails) {
                var incidentObject = {
                    id: incidentDetails.incident.id,
                    title: incidentDetails.incident.title,
                    type: incidentDetails.incident.type,
                    address: incidentDetails.incident.address,
                    description: incidentDetails.incident.description,
                    image_url: incidentDetails.incident.media.image_url,
                    occurred_at: incidentDetails.incident.occurred_at,
                    updated_at: incidentDetails.incident.updated_at,
                    coordinates: incident.geometry.coordinates
                }
                incidentsArray.push(incidentObject);
            })
            .catch (error => console.log(error));
        });
        console.log(incidentsArray);
    })
    .catch(error => console.log(error));
}

var searchBtn = document.querySelector('#search-button');
searchBtn.addEventListener('click', getIncidentsByCoordinates);

getGeoLocation();
