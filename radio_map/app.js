function myFunction() {
  var map = L.map('map').setView([51.426002, 7.503215], 8);
  // improve experience on mobile
  if (map.tap) map.tap.disable();
  L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
}).addTo(map);
  map._layersMinZoom=5;

  $(document).ready(function() {
      $.ajax({
          type: "GET",
          url: "radio.json",
          dataType: "json",
          mimeType: "application/json",
          success: function(data) {processData(data);}
       });
  });

  var icon = L.icon({
              iconUrl: 'icons/icon.png',
              iconSize:     [30, 32], // size of the icon
              iconAnchor:   [15, 32], // point of the icon which will correspond to marker's location
              popupAnchor: [0, -32]
          });

  function processData(allText) {

    for (var i in allText){
             data = allText[i];

            L.marker([data.long, data.lat], {icon: icon})
          .addTo(map)
          .bindPopup("<strong>" + data.redaktion + "</strong>" + 
                      " | " + data.stadt);

          }
  }


}
