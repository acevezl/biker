/*Global variables */
var searchTerm = document.getElementById("searchTerm");
var limitVal = 5; /* temp field for testing, can be replaced with user input*/
var searches = []; /*Array of all searches*/
var searchResult = [];/*Array of search objects found with single search*/

var searchBtnEl = document.querySelector('#search-button');
searchBtnEl.addEventListener('click',searchIncidents);

/*Search Button function */
function searchIncidents(target) {
    target.preventDefault();
    var searchTerm = document.querySelector('#searchTerm').value;
    console.log(searchTerm);
    fetch (
        /*Bikewise API key and query*/
        'https://bikewise.org:443/api/v2/locations?proximity='+searchTerm+'&proximity_square=100&limit='+ limitVal +'&all=false'

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
                    searchResult.push(incidentObject);
                })
                .catch(error => console.log(error));
            }
        });
        console.log(searchResult);  
    })
    .catch(error => console.log(error));
}
