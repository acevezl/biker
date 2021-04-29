/*Script goes here*/

var searchTerm = document.getElementById("searchTerm");
var limitVal = 5;
var searches = [];
var search = function(){
    fetch (
        /*Bikewise API key and query*/
        //'https://bikewise.org:443/api/v2/incidents?page=1&incident_type=crash&proximity='+ searchTerm +'&proximity_square=100'
        'https://bikewise.org:443/api/v2/locations?proximity='+searchTerm+'&proximity_square=100&limit='+ limitVal +'&all=false'

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
            //console.log(response.features);
            //console.log(response.features.length);
            for(var i = 0; i < response.features.length; i++){
                //console.log(response.features[i]);
                var incidentID = response.features[i].properties.id;
                var incidentType = response.features[i].properties.type;
                var coordinates = response.features[i].geometry.coordinates;

                //console.log("Incident ID: " + incidentID, " Incident Type: " + incidentType, " coordinates: "+ coordinates);

                if (incidentType === "Theft" || incidentType === "Hazard" || incidentType === "Crash") {
                   // console.log("Incident ID: " + incidentID, "\nIncident Type: " + incidentType, "\ncoordinates: "+ coordinates);
                    var searchObj = {
                        id: incidentID,
                        type: incidentType,
                        crdnts: coordinates
                    };
                    //console.log(searchObj);
                    //searches.push(searchObj);

                    /*fetch(
                        'https://bikewise.org:443/api/v2/incidents/'+ incidentID
                        
                    )
                    .then(function(incidentResponse){
                        console.log("incidentID is ----- ", incidentID );
                        return incidentResponse.json();
                    })
                    .then(function(incidentResponse){
                        var incidentName = incidentResponse.incident.title;
                        //console.log("incidentName = ", incidentName);
                        var incidentDate = incidentResponse.incident.occured_at;
                       // console.log("incidentDate = ", incidentDate);
                        var incidentAddress = incidentResponse.incident.address; 
                        //console.log("incidentAddress = ", incidentAddress);
                        //return incidentName, incidentDate, incidentAddress;
                        /*
                        console.log(
                            "Incident ID: " + incidentID, 
                            "\nIncident Type: " + incidentType, 
                            "\ncoordinates: "+ coordinates,
                            "\nincidentName = "+ incidentName,
                            "\nincidentDate = "+ incidentDate,
                            "\nincidentAddress = "+ incidentAddress
                            );
                        
                    })
                    */
                    
                    /*console.log(
                        "Incident ID: " + incidentID, 
                        " Incident Type: " + incidentType, 
                        " coordinates: "+ coordinates,
                        " incidentName = "+ incidentName,
                        " incidentDate = "+ incidentDate,
                        "incidentAddress = "+ incidentAddress
                        );*/
                    
                    /*Object created
                    Title
                    Id
                    address
                    occured_at
                    incidentType
                    Coordinates
                    */


                }
                console.log(searchObj);
                var searchID = searchObj.id;
                console.log(searchID);
                fetch(
                    'https://bikewise.org:443/api/v2/incidents/'+ searchID
                )
                .then(function(incidentResponse){
                    //console.log(searchObj);
                    return incidentResponse.json(); 
                 })
                 .then(function(incidentResponse){
                    console.log(incidentResponse);
                    //console.log(searchObj);
                    console.log(searchID);
                    var incidentName = incidentResponse.incident.title;
                    console.log("incidentName = ", incidentName);
                    searchObj.name = incidentName;
                    var incidentDate = incidentResponse.incident.occured_at;
                    console.log("incidentDate = ", incidentDate);
                    searchObj.date = incidentDate
                    var incidentAddress = incidentResponse.incident.address; 
                    console.log("incidentAddress = ", incidentAddress);
                    searchObj.address = incidentAddress;
                })
                //console.log("I escaped");
                //console.log(searchObj);

            }
            //console.log(searchObj)
            //console.log(searches);
            /*for (var j = 0; j < searches.length; j++) {
                var searchID = searches[j].id;
                console.log(searchID);
                fetch(
                    'https://bikewise.org:443/api/v2/incidents/'+ searchID
                )
                .then(function(incidentResponse){
                    return incidentResponse.json(); 
                 })
                 .then(function(incidentResponse){
                     console.log(searches[j]);
                     console.log(incidentResponse);
                     var incidentName = incidentResponse.incident.title;
                     console.log("incidentName = ", incidentName);
                     var incidentDate = incidentResponse.incident.occured_at;
                     console.log("incidentDate = ", incidentDate);
                     var incidentAddress = incidentResponse.incident.address; 
                     console.log("incidentAddress = ", incidentAddress);
                     searches[j].name = incidentName;
                     console.log(searches[j]);

                 })
            }*/
        })
        /*
        .then(function(incidentResponse){
           return incidentResponse.json(); 
        })
        .then(function(incidentResponse){
            console.log(incidentResponse);
            var incidentName = incidentResponse.incident.title;
            console.log("incidentName = ", incidentName);
            var incidentDate = incidentResponse.incident.occured_at;
            console.log("incidentDate = ", incidentDate);
            var incidentAddress = incidentResponse.incident.address; 
            console.log("incidentAddress = ", incidentAddress);
        })
        */

        /*
        fetch (
            'https://bikewise.org:443/api/v2/incidents/'+ searchID
        )
        */
}
