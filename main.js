$(document).ready(function(){

    function getStats(statsData) {
        $.getJSON(statsData, function(data){
            $("#statsListed").text("Listed Spaces - " + data.dev_stats.spaces_listed);
            $("#statsComplete").text("Complete - " + data.dev_stats.spaces_complete);
            $("#statsDetailed").text("Detailed - " + data.dev_stats.spaces_detailed);
            $("#statsBasic").text("Basic - " + data.dev_stats.spaces_basic);
        });
    }

    getStats("media/database/stats.json");


    function getPostcode(position) {
        const latlongUrl = "https://api.postcodes.io/postcodes?lon=" + position.coords.longitude + "&lat=" + position.coords.latitude;

        $.getJSON(latlongUrl, function(data) {
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

    
    //remove any content from the main section
    function mainSection_clear() {
        $("#spacesList").remove();
    }

    //add a new article to the new section
    function mainSectionArticle_display(name, latitude, longitude, id, size) {
        var eSection = document.getElementById("spacesList");
        if (eSection == null) {$("#main").append("<div class='mainSection' id='spacesList'></div>");}
        $("#spacesList").append("<div class='mainSectionArticle' id='spacesListArticle" + id + "' style='flex-grow:" + size + "'></div>");
        $("#spacesListArticle" + id).append("<p>" + name + "</p>");
        $("#spacesListArticle" + id).append("<p>" + latitude + "</p>");
        $("#spacesListArticle" + id).append("<p>" + longitude + "</p>");
    }

    function getSpaces() {
        var postcode = $("#searchField").val();
        var location;
    
        const postcodeUrl = "https://api.postcodes.io/postcodes/" + postcode;
    
        $.getJSON(postcodeUrl, function(postcodeData) {
            console.log(postcodeData);
            console.log("SUCCESS! " + postcodeData.status);
            console.log(postcodeData.result.longitude);
            console.log(postcodeData.result.latitude);

            //animate to default colors if success
            $("#searchField").css({"background-color":"rgba(250,250,250,1)", "color":"rgba(80, 80, 80, 1)"});

            //print out all db results
            mainSection_clear();
            mainSectionArticle_display(postcodeData.result.postcode, postcodeData.result.longitude, postcodeData.result.latitude, 0, 1);
            $("#spacesList").append("<div class='mainSectionBreak'></div>");
            $.getJSON("media/database/space.json", function(spaceData){
                console.log(spaceData);
                console.log("SUCCESS!");
                for(var i = 0; spaceData.green_space.length > i; i++) {
                    console.log(i);
                    mainSectionArticle_display(spaceData.green_space[i].name, spaceData.green_space[i].longitude, spaceData.green_space[i].latitude, i+1, 1);
                }
            }).fail(function(){
                console.log(spaceData);
                console.log("ERROR!");
            });
        }).fail(function(postcodeData){ 
            console.log(postcodeData);
            console.log("ERROR! " + postcodeData.status);

            //animate color change to show fail
            $("#searchField").css({"background-color":"rgba(200,40,20,1)", "color":"white"});
            mainSection_clear();
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