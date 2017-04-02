function xhrGetPromise(url) {
  return new Promise(function(resolve, reject){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
      if(xhr.status == 200)
        resolve(JSON.parse(xhr.responseText));
      else
        reject({status: xhr.status, statusText: "err"});
    }
    xhr.onerror = function() {
      reject({status: xhr.status, statusText: xhr.statusText});
    }
    xhr.send();
  });
}

var droneMarker = null;

function updateMarker(map, imageName, gps, zIndex) {
    if(droneMarker) {
      droneMarker.setPosition({
        lat: gps.lat,
        lng: gps.lng
      });
      return;
    }
    droneMarker = new google.maps.Marker({
      position: {
        lat: gps.lat,
        lng: gps.lng
      },
      map: map,
      icon: imageName,
      zIndex: zIndex
    });
}

function reloadMapData(map) {
  xhrGetPromise("/api/v1/gps").then(function(gps){
    updateMarker(map, '/img/drone.png', gps, 10);
  }).catch(function(err){
    console.log(err);
  });
}


function initMap() {
  var myLatlng = new google.maps.LatLng(42.337171, -71.091393);
  var mapOptions = {
    zoom: 14,
    center: myLatlng,
    mapTypeId: 'roadmap'
  };
  var map = new google.maps.Map(document.getElementById('map'),
      mapOptions);
  reloadMapData(map);
  window.setInterval(reloadMapData, 500, map);
}