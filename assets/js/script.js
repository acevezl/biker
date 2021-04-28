/*Script goes here*/

var searchTerm = document.getElementById("searchTerm");

var search = function(){
    fetch (
        /*Bikewise API key and query*/
        //'https://bikewise.org:443/api/v2/incidents?page=1&incident_type=crash&proximity='+ searchTerm +'&proximity_square=100'
        'https://bikewise.org:443/api/v2/locations?proximity='+searchTerm+'&proximity_square=100'

    )
        .then(function(response){
            return response.json();
        })
        .then(function(response){
            /* to return 1 value
            console.log(response.incidents[0]);
            //console.log("Type of incident: " + response.features[0].properties.type, "Coordinates: " + response.features[0].geometry.coordinates);
            var incidentType = response.features[0].properties.type;
            console.log("incident Type: "+ incidentType);
            var coordinates = response.features[0].geometry.coordinates;
            console.log("coordinates: " + coordinates);
            */
            console.log(response.features);
            //console.log(response.features.length);
            for(var i = 0; i < response.features.length; i++){
                var incidentID = response.features[i].properties.id;
                var incidentType = response.features[i].properties.type;
                var coordinates = response.features[i].geometry.coordinates;

                //console.log("Incident ID: " + incidentID, " Incident Type: " + incidentType, " coordinates: "+ coordinates);

                if (incidentType === "Theft" || incidentType === "Hazard" || incidentType === "Crash") {
                    console.log("Incident ID: " + incidentID, " Incident Type: " + incidentType, " coordinates: "+ coordinates);
                    
                }
                
            }

        });
}
