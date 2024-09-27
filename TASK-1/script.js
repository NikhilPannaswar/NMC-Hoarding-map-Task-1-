var map;
var markers = [];
var myLocationMarker = null;
var myLocationCircle = null;

function initMap() {
    // Initialize the map centered in Nagpur
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 21.1458, lng: 79.0882},
        zoom: 13
    });

    // Add red markers for all locations from the `locations` variable in data.js
    locations.forEach(function(location) {
        var marker = new google.maps.Marker({
            position: { lat: location.latitude, lng: location.longitude },
            map: map,
            title: location.fileNumber.toString(),
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' // Red marker
        });


        var infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="width: 250px; padding: 0; box-sizing: border-box;">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRbcrj53mGyk-u4JwrIb6z1RBAeCpxR78gfQ&s" 
                         alt="Image" style="width: 100%; height: auto; display: block;">
                    <p style="margin: 8px 0;"><strong>File Number:</strong> ${location.fileNumber}</p>
                    <p style="margin: 8px 0;"><strong>Date of Survey:</strong> ${location.dateOfSurvey}</p>
                    <p style="margin: 8px 0;"><strong>Address:</strong> ${location.address}</p>
                    <p style="margin: 8px 0;"><strong>Category:</strong> ${location.category}</p>
                </div>`
        });
        

        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });

        markers.push(marker);
    });

    // Add double-click event listener for setting "My Location"
    map.addListener('dblclick', function(e) {
        setMyLocation(e.latLng);
    });

    // Show All Button
    document.getElementById('showAll').addEventListener('click', showAllMarkers);
    document.getElementById('showAll').addEventListener('click', initMap);
}

// Function to set the blue marker for "My Location"
function setMyLocation(latLng) {
    // Remove existing My Location marker and circle if they exist
    if (myLocationMarker) {
        myLocationMarker.setMap(null);
    }
    if (myLocationCircle) {
        myLocationCircle.setMap(null);
    }

    // Add blue marker for My Location
    myLocationMarker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: "My Location",
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Blue marker
    });

    // Add 200m radius circle around My Location
    myLocationCircle = new google.maps.Circle({
        map: map,
        radius: 200,    // 200 meters
        fillColor: '#00AAFF',
        strokeColor: '#0000FF',
        strokeOpacity: 0.35,
        fillOpacity: 0.2,
        center: latLng
    });

    // Hide markers outside the 200m radius
    hideMarkersOutsideRadius(latLng);
}

// Function to hide markers outside the 200m radius
function hideMarkersOutsideRadius(latLng) {
    markers.forEach(function(marker) {
        var distance = google.maps.geometry.spherical.computeDistanceBetween(marker.getPosition(), latLng);
        if (distance > 200) {
            marker.setVisible(false);
        } else {
            marker.setVisible(true);
        }
    });
}

// Show all markers again
function showAllMarkers() {
    markers.forEach(function(marker) {
        marker.setVisible(true);
    });
    if (myLocationMarker) {
        myLocationMarker.setMap(null);
    }
    if (myLocationCircle) {
        myLocationCircle.setMap(null);
    }
}
