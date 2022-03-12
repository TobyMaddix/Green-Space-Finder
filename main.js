$(document).ready(function(){
    $("#searchField").one("click", function(){
        if(navigator.geolocation) {
            var position;
            navigator.geolocation.getCurrentPosition(postcode);
        }

        function postcode(position) {
            const latlongUrl = "https://api.postcodes.io/postcodes?lon=" + position.coords.longitude + "&lat=" + position.coords.latitude;
            $.getJSON(latlongUrl, function(data) {
                $("#searchField").val(data.result[1].postcode);
                console.log(data.result.postcode);
            });
        }
    });

    $("#searchButton").click(function(){
        var postcode = $("#searchField").val();
        var location;
    
        const postcodeUrl = "https://api.postcodes.io/postcodes/" + postcode;
    
        $.getJSON(postcodeUrl, function(data) {
            location = data;
            console.log(location);
    
            if(location.responce = "200") {
                console.log("SUCCESS! " + location.status);
                console.log(location.result.longitude);
                console.log(location.result.latitude);

                function result(name, latitude, longitude, row, col) {
                    var eRow = document.getElementById("mainRow" + row);
                    if (eRow == null) {
                        $("#main").append("<div class='mainRow' id='mainRow" + row + "'></div>");
                    }
                    var eCol = document.getElementById("mainRow" + row + "Col" + col);
                    if (eCol == null) {
                        $("#mainRow" + row).append("<div class='mainColLowlight' id='mainRow" + row + "Col" + col + "'></div>");
                    }
                    $("#mainRow" + row + "Col" + col).append("<p>" + name + "</p>");
                    $("#mainRow" + row + "Col" + col).append("<p>" + latitude + "</p>");
                    $("#mainRow" + row + "Col" + col).append("<p>" + longitude + "</p>");
                }
                
                $("#mainRow" + 1).remove();
                $("#mainRow" + 2).remove();
                result(location.result.postcode, location.result.longitude, location.result.latitude, 1, 1);
                result(location.result.postcode, location.result.longitude, location.result.latitude, 1, 2);
                result(location.result.postcode, location.result.longitude, location.result.latitude, 2, 1);
                result(location.result.postcode, location.result.longitude, location.result.latitude, 2, 2);
                result(location.result.postcode, location.result.longitude, location.result.latitude, 2, 3);
            } else {
                console.log("ERROR! " + location.status);
            }
        });
    });
});