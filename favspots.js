     
     var map, features;
     var curr_pos;

    function initMap() {
     	var phoenix = {lat: 33.494514, lng: -112.012748};
        map = new google.maps.Map(
        	document.getElementById('map'), {center: phoenix, zoom: 12});

      infoWindow = new google.maps.InfoWindow;
	    var station_image = {
		  url:'https://png.icons8.com/ios/50/000000/city-railway-station-filled.png',
		  scaledSize: new google.maps.Size(25, 25), 
      };
     
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var new_pos = new google.maps.LatLng(pos.lat, pos.lng);
            nearest_marker = findNearestMarker(new_pos,features);
            distance = (google.maps.geometry.spherical.computeDistanceBetween(new_pos, nearest_marker.position)/1609);
            distance = +distance.toFixed(3);
    		    curr_pos = new google.maps.Marker({
            	  position: pos,
            	  map: map,
            	  title: 'Current Position'
          	}); 

          	curr_pos.addListener('click', function() {
          		  infowindow = new google.maps.InfoWindow({
            	  content: '<h2>Closest Station:</h2>'+'<h3>'+nearest_marker.name+'</h3>'+'<p>'+distance+' miles away</p>'});
    			      infowindow.open(map, curr_pos);
  			    });
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
      } 
      else {
          handleLocationError(false, infoWindow, map.getCenter());
      }

 	    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
      var icons = {
        station: {
        icon: station_image
        },
        restaurant: {
        icon: station_image
        },
        coffeeshop: {
        icon: station_image
        },
        music: {
        icon: station_image
        },
        art: {
        icon: station_image
        },
        misc: {
        icon: station_image
        }
      };

      features = [
        {}
          
      ];

      features.forEach(function(feature) {
        var marker = new google.maps.Marker({
          position: feature.position,
          icon: icons[feature.type].icon,
          map: map
        });
        infoWindow2 = new google.maps.InfoWindow();
        marker.addListener('click', function() {
          infoWindow2.setContent('Loading...');
          getSchedule(feature, infoWindow2);
    		  infoWindow2.open(map, marker);
  		  });
      });

  	  

    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }

    

    function findNearestMarker(coords, features) {
      var minDist = 10000,
        nearest_marker,
        markerDist,
        len = features.length,
        i;
      for (i = 0; i < len; i += 1) {
          markerDist = google.maps.geometry.spherical.computeDistanceBetween(coords, features[i].position);
          if (markerDist < minDist) {
              minDist = markerDist;
              nearest_marker = features[i];
          }
      }
      var closest_marker_path = [
        coords,
        nearest_marker.position
      ]
      var closest_marker_line = new google.maps.Polyline({
        path: closest_marker_path,
        geodesic:true,
        strokeColor: '#0000FF',
        strokeOpacity: 0.8,
        strokeWeight: 4
      });
      closest_marker_line.setMap(map);
      return nearest_marker;
    }