$(document).ready(function(){

    function getStats(statsData) {
        $.get(statsData, function(data){
            $("#statsListed").text("Listed Spaces - " + data.dev_stats.spaces_listed);
            $("#statsComplete").text("Complete - " + data.dev_stats.spaces_complete);
            $("#statsDetailed").text("Detailed - " + data.dev_stats.spaces_detailed);
            $("#statsBasic").text("Basic - " + data.dev_stats.spaces_basic);
        });
    }

    getStats("media/database/stats.json");


    function getPostcode(position) {
        const latlongUrl = "https://api.postcodes.io/postcodes?lon=" + position.coords.longitude + "&lat=" + position.coords.latitude;

        $.get(latlongUrl, function(data) {
            console.log(data);
            console.log("SUCCESS! " + data.status);
            console.log(data.result[1].postcode);

            $("#searchField").val(data.result[1].postcode);
        }).fail(function(data){
            console.log(data);
            console.log("ERROR! " + data.status);
        });
    }

    $("#searchField").one("click", function(){
        $("#searchField").val("");
    
        if(navigator.geolocation) {navigator.geolocation.getCurrentPosition(getPostcode);}
    });

    
    //remove any content from main
    function clearMain() {
        for(var i = 1; $("#main").length+1 >= i; i++){
            $("#mainRow" + i).remove();
        }
    }

    function getSpaces() {
        var postcode = $("#searchField").val();
        var location;
    
        const postcodeUrl = "https://api.postcodes.io/postcodes/" + postcode;
    
        $.get(postcodeUrl, function(data) {
            console.log(data);
            console.log("SUCCESS! " + data.status);
            console.log(data.result.longitude);
            console.log(data.result.latitude);

            //animate to default colors if success
            $("#searchField").css({"background-color":"rgba(250,250,250,1)", "color":"rgba(80, 80, 80, 1)"});

            function displayResult(name, latitude, longitude, row, col) {
                var eRow = document.getElementById("mainRow" + row);
                if (eRow == null) {$("#main").append("<div class='mainRow' id='mainRow" + row + "'></div>");}
                var eCol = document.getElementById("mainRow" + row + "Col" + col);
                if (eCol == null) {$("#mainRow" + row).append("<div class='mainColLowlight' id='mainRow" + row + "Col" + col + "'></div>");}
                $("#mainRow" + row + "Col" + col).append("<p>" + name + "</p>");
                $("#mainRow" + row + "Col" + col).append("<p>" + latitude + "</p>");
                $("#mainRow" + row + "Col" + col).append("<p>" + longitude + "</p>");
            }
            
            clearMain();
            displayResult(data.result.postcode, data.result.longitude, data.result.latitude, 1, 1);
            displayResult(data.result.postcode, data.result.longitude, data.result.latitude, 1, 2);
            displayResult(data.result.postcode, data.result.longitude, data.result.latitude, 2, 1);
            displayResult(data.result.postcode, data.result.longitude, data.result.latitude, 2, 2);
            displayResult(data.result.postcode, data.result.longitude, data.result.latitude, 2, 3);
        }).fail(function(data){ 
            console.log(data);
            console.log("ERROR! " + data.status);

            //animate color change to show fail
            $("#searchField").css({"background-color":"rgba(200,40,20,1)", "color":"white"});
            clearMain();
        });
    }

    $("#searchButton").click(function(){
        getSpaces();
    });

    $('#searchField').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            getSpaces();
        }
      });
});