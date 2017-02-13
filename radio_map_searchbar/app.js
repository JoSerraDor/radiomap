function myFunction() {
  var map = L.map('map').setView([51.426002, 7.503215], 8);
  // improve experience on mobile
  if (map.tap) map.tap.disable();
  L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
}).addTo(map);
  map._layersMinZoom=8;

var selectedRadio = 0;

var RadioByName = {};

  var markersLayer = new L.LayerGroup();  //layer contain searched elements
  
  map.addLayer(markersLayer);
  var controlSearch = new L.Control.Search({
    position:'bottomleft',    
    layer: markersLayer,
    initial: false,
    zoom: 12,
    marker: false,
    textPlaceholder: 'Suche...'
  });
  map.addControl(controlSearch);

  // create newsroom markers
var radioMarkers = [];

var icon = L.icon({
            iconUrl: 'icons/icon.png',
            iconSize:     [30, 32], // size of the icon
            iconAnchor:   [15, 32], // point of the icon which will correspond to marker's location
            popupAnchor: [0, -32]
          });

for(i=0; i<radio.length; i++) {
    RadioByName[radio[i].redaktion] = radio[i];
    
    var radio_marker = [];

    radio_marker.redaktion = radio[i].redaktion;  // associate marker with newsroom
    radio_marker.lat = radio[i].lat;
    radio_marker.long = radio[i].long;
    radio_marker.stadt = radio[i].stadt;
    radio_marker.redaktion_link = radio[i].redaktion_link;

    var title = radio_marker.redaktion,  //value searched
        loc = [radio_marker.long, radio_marker.lat],    //position found
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

    radioMarkers.push(radio_marker);  // keep marker reference for later
} 

function changeSelection(radioRedaktion) {
    if(selectedRadio == 0 || selectedRadio != radioRedaktion) {
        selectedRadio = radioRedaktion;

        for(i=0; i<radioMarkers.length; i++) {
            if(radioMarkers[i].options.title == radioRedaktion) {
                radioMarkers[i].openPopup();                    
            }
        }           
    }
    else {
        selectedRadio = 0;
    }
}
}
