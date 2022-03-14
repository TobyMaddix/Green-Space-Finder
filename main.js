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
    function clearMainSection() {
        $("#spacesList").remove();
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

            function displayResult(name, latitude, longitude, id) {
                var eSection = document.getElementById("spacesList");
                if (eSection == null) {$("#main").append("<div class='mainSection' id='spacesList'></div>");}
                $("#spacesList").append("<div class='mainSectionArticle' id='spacesListArticle" + id + "'></div>");
                $("#spacesListArticle" + id).append("<p>" + name + "</p>");
                $("#spacesListArticle" + id).append("<p>" + latitude + "</p>");
                $("#spacesListArticle" + id).append("<p>" + longitude + "</p>");
            }
            
            clearMainSection();
            displayResult(data.result.postcode, data.result.longitude, data.result.latitude, 1);
            displayResult(data.result.postcode, data.result.longitude, data.result.latitude, 2);
            displayResult(data.result.postcode, data.result.longitude, data.result.latitude, 3);
            displayResult(data.result.postcode, data.result.longitude, data.result.latitude, 4);
            displayResult(data.result.postcode, data.result.longitude, data.result.latitude, 5);
        }).fail(function(data){ 
            console.log(data);
            console.log("ERROR! " + data.status);

            //animate color change to show fail
            $("#searchField").css({"background-color":"rgba(200,40,20,1)", "color":"white"});
            clearMainSection();
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