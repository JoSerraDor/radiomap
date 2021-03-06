function myFunction() {
  var map = L.map('map').setView([51.426002, 7.503215], 8);
  if (map.tap) map.tap.disable();
  L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
}).addTo(map);
  map._layersMinZoom=8;

var selectedRadio = 0;

var RadioByName = {};

var markersLayer = new L.LayerGroup(); 
  
var radioMarkers = [];

map.addLayer(markersLayer);
  var controlSearch = new L.Control.Search({
    position:'topleft',    
    layer: markersLayer,
    initial: false,
    zoom: 11,
    marker: false,
    textPlaceholder: 'Suche...'
  });

  map.addControl(controlSearch);  


for(i=0; i<radio.length; i++) {
  var icon = L.icon({
            iconUrl: 'icons/icon.png',
            iconSize:     [30, 32], 
            iconAnchor:   [15, 32], 
            popupAnchor: [0, -32]
          });
          if (radio[i].type === "service") {
            icon = L.icon({
              iconUrl: 'icons/icon_service.png',
              iconSize:     [30, 32], 
              iconAnchor:   [15, 32], 
              popupAnchor: [0, -32]
              });
          };

    RadioByName[radio[i].redaktion] = radio[i];
    
    var radio_marker = [];

    radio_marker.redaktion = radio[i].redaktion; 
    radio_marker.lat = radio[i].lat;
    radio_marker.long = radio[i].long;
    radio_marker.stadt = radio[i].stadt;
    radio_marker.redaktion_link = radio[i].redaktion_link;

    var title = radio_marker.redaktion, 
        loc = [radio_marker.long, radio_marker.lat],   
        radio_marker = new L.marker(new L.latLng(loc), {
          icon: icon,
          title: title,
          stadt: radio_marker.stadt,
          redaktion_link: radio_marker.redaktion_link
      });

    markersLayer.addLayer(radio_marker);  


    radio_marker.on('click', function(e) {

       changeSelection(e.target.options.title);
       map.setView([e.target._latlng.lat, e.target._latlng.lng]);

       var myPopup = L.popup().setContent(
         "<strong>" +
         e.target.options.redaktion_link +
         "</strong> | " +
         e.target.options.stadt
      );

      e.target
       .unbindPopup()
       .bindPopup(myPopup)
       .openPopup();
   });

    radioMarkers.push(radio_marker); 
}

controlSearch.on('search:locationfound', function(e) {
      var myPopup = L.popup().setContent(
         "<strong>" +
         e.layer.options.redaktion_link +
         "</strong> | " +
         e.layer.options.stadt
      );

      e.layer
      .unbindPopup()
       .bindPopup(myPopup)
       .openPopup();
  })

.on('search:collapsed', function(e) {
      map.setView([51.426002, 7.503215], 8);
  })

function changeSelection(radioRedaktion) {
    if(selectedRadio == 0 || selectedRadio != radioRedaktion) {
        selectedRadio = radioRedaktion;           
    }
    else {
        selectedRadio = 0;
    }
}
}
