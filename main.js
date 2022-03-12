$(document).ready(function(){
    $("#searchField").one("click", function(){
        if(navigator.geolocation) {
            $("#searchField").val("");
            navigator.geolocation.getCurrentPosition(postcode);
        }

        function postcode(position) {
            const latlongUrl = "https://api.postcodes.io/postcodes?lon=" + position.coords.longitude + "&lat=" + position.coords.latitude;
            $.getJSON(latlongUrl, function(data) {
                console.log(data);
                if(data.responce = 200) {
                    console.log("SUCCESS! " + data.status);
                    console.log(data.result[1].postcode);
                    $("#searchField").val(data.result[1].postcode);
                } else {
                    console.log("ERROR! " + data.status);
                }

            });
        }
    });

    function find() {
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
    }

    $("#searchButton").click(function(){
        find();
    });

    $('#searchField').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            find();
        }
      });
});