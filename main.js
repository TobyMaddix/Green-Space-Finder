function getLocation() {
    document.getElementById("searchField").value = "BS70EQ";
}

function walk() {
    document.getElementById("searchButton").disabled = true;
    document.getElementById("searchField").disabled = true;

    var postcode = document.getElementById("searchField").innerHTML;
    var location;
}