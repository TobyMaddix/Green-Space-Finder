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
        $("#spacesList").append("<div class='mainSectionArticle' id='spacesListArticle" + id + "'></div>");

        if(data.name){$("#spacesListArticle" + id).append("<h2 style='background-color: rgb(250,250,250);'>" + data.name + "</h2>");}

        if(data.imageFile || data.links || data.latitude || data.longitude || distance){
            $("#spacesListArticle" + id).append("<div id='spacesListArticle" + id + "Content' style='display:flex; flex-wrap:nowrap; gap:1vw;'></div>");

            if(data.imageFile || data.links) {
                $("#spacesListArticle" + id + "Content").append("<div id='spacesListArticle" + id + "ContentLeft' style='flex-basis: 50%;'></div>");
                if(data.imageFile){$("#spacesListArticle" + id + "ContentLeft").append("<img src='" + data.imageFile + "' style='max-width:100%;'>");}
                if(data.links){$("#spacesListArticle" + id + "ContentLeft").append("<p>" + data.links + "</p>");}
            }

            if(data.latitude || data.longitude || distance) {
                $("#spacesListArticle" + id + "Content").append("<div id='spacesListArticle" + id + "ContentRight' style='flex-basis: 50%;'></div>");
                if(data.latitude){$("#spacesListArticle" + id + "ContentRight").append("<p>" + data.latitude + "</p>");}
                if(data.longitude){$("#spacesListArticle" + id + "ContentRight").append("<p>" + data.longitude + "</p>");}
                if(distance){$("#spacesListArticle" + id + "ContentRight").append("<p>" + distance + "</p>");}
            }
        }

        if(data.infoFile){
            $.get(data.infoFile, function(text){
                $("#spacesListArticle" + id).append("<p>" + text + "</p>");
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

            $.getJSON("media/database/space.json", function(spaceData){
                console.log(spaceData);
                console.log("SUCCESS!");

                var displayOrder = []
                var nodeItem;
                var nodeDist;
                var distance;
                var sectionBreak = false;
                //run through the green space data base
                for(var display = 0; 5 > display; display++) {
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
                    if(distance < 0.01){
                        displayOrder.push(nodeItem);
                        if(sectionBreak == false) {$("#spacesList").append("<div class='mainSectionBreak'></div>"); sectionBreak = true;}
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