const devMode = true;

$(document).ready(function(){
    if(devMode) {
        $("#searchField").val("BS16NE");
        getSpaces();
    }


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
        const latlongUrl = "https://api.postcodes.io/postcodes?lon=" + position.coords.longitude + "&lat=" + position.coords.latitude; //find nearest postcode to estimated position

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
    function mainSectionArticle_display(data, distance, id) {
        var eSection = document.getElementById("spacesList");
        if (eSection == null) {$("#main").append("<div class='mainSection' id='spacesList'></div>");}
        
        if(data.imageFile){
            //set background as image and increase header margin
            $("#spacesList").append("<div class='mainSectionArticle' id='spacesListArticle" + id + "' style='background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(20, 20, 20, 01) 60%, rgba(20, 20, 20, 01) 100%), url(" + data.imageFile + "); background-position: center; background-repeat: no-repeat; background-size: cover;'></div>");
            if(data.name){$("#spacesListArticle" + id).append("<h2 class='spacesListArticleTitle' style='margin-top: 60%; margin-bottom: 1.5vh;'>" + data.name + "</h2>");}
        }else{
            //no image as background and normal header margin
            $("#spacesList").append("<div class='mainSectionArticle' id='spacesListArticle" + id + "'></div>");
            if(data.name){$("#spacesListArticle" + id).append("<h2 class='spacesListArticleTitle' style='margin-top: 1.5vh; margin-bottom: 1.5vh;'>" + data.name + "</h2>");}
        }
        if(distance){$("#spacesListArticle" + id).append("<p margin-top: 0; margin-bottom: 0.5vh;'>" + distance + "</p>");}
        if(data.links){
            $("#spacesListArticle" + id).append("<div id='spacesListArticle" + id + "Links' style='display: flex; flex-wrap: wrap; gap: 1vw;'></div>");
            $("#spacesListArticle" + id + "Links").append("<p>" + data.links + "</p>");
        }
        if(data.infoFile){
            $.get(data.infoFile, function(text){
                $("#spacesListArticle" + id).append("<p style='margin-top: 0.5vh; margin-bottom: 1vh;'>" + text + "</p>");
            });
        }
    }

    function getDistance(n1, n2, n3, n4) {
        function makePosative(n) {
            if(n < 0) {var num1 = n - (n * 2);} else {var num1 = n;}
            return num1;
        }

        //implement better checks on negatives and distance
        var num1 = makePosative(n1);
        var num2 = makePosative(n2);
        var num3 = makePosative(n3);
        var num4 = makePosative(n4);
        return Math.sqrt((num1-num3) * (num1-num3) + (num2-num4) * (num2-num4));
    }

    function getTime(distance, method) {
        mode = {walk:"7", bike:"2"};
        return distance % 0.1 * 7;
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

            $("#searchField").css({"background-color":"rgba(250,250,250,1)", "color":"rgba(80, 80, 80, 1)"}); //animate to default colors if success

            mainSection_clear();
            mainSectionArticle_display({
                name:postcode,
                longitude:postcodeData.result.longitude,
                latitude:postcodeData.result.latitude},
                0, 0);
            
            //open layer map
            $("#spacesListArticle0").append("<div id='spacesListArticleMap' style='width: 100%; height: 30vh;'></div>");
            var olMap = new ol.Map({
                target: "spacesListArticleMap",
                layers: [
                  new ol.layer.Tile({
                    source: new ol.source.OSM()
                  })
                ],
                view: new ol.View({
                  center: ol.proj.fromLonLat([postcodeData.result.longitude, postcodeData.result.latitude]),
                  zoom: 16
                })
              });

            $.getJSON("media/database/space.json", function(spaceData){
                console.log(spaceData);
                console.log("SUCCESS!");

                var displayOrder = []
                var nodeItem;
                var nodeDist;
                var distance;
                var sectionBreak = false;
                
                //run through the green space data base
                for(var display = 0; 6 > display; display++) {
                    var nodeItem = 0;
                    var nodeDist = getDistance(postcodeData.result.longitude, postcodeData.result.latitude, spaceData.green_space[0].longitude, spaceData.green_space[0].latitude);
                    for(var i = 0; spaceData.green_space.length > i; i++) {
                        distance = getDistance(postcodeData.result.longitude, postcodeData.result.latitude, spaceData.green_space[i].longitude, spaceData.green_space[i].latitude);

                        //don't show if distance out of range
                        if(distance < 0.01 && distance < nodeDist && displayOrder.includes(i) == false){
                            console.log(displayOrder.includes(i) == false);
                            nodeItem = i; 
                            nodeDist = distance;
                        }
                    }
                    if(distance < 0.03){
                        displayOrder.push(nodeItem);
                        if(sectionBreak == false) {$("#spacesList").append("<div class='mainSectionBreak'></div>"); sectionBreak = true;} //make divide in conmtent but only once
                        mainSectionArticle_display(spaceData.green_space[nodeItem], nodeDist, display+1, 1);
                    }
                }
            }).fail(function(){
                console.log(spaceData);
                console.log("ERROR!");
            });
        }).fail(function(postcodeData){ 
            console.log(postcodeData);
            console.log("ERROR! " + postcodeData.status);

            $("#searchField").css({"background-color":"rgba(200,60,40,1)", "color":"white"}); //animate color change to show fail
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