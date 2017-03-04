function myFunction() { // Der gesdamte Code ist in der Funktion myFunction, die dafür sorgt, dass sich die Karte bei jedem Laden aktualisiert
  var map = L.map('map').setView([51.426002, 7.503215], 8); // Geolocation und Zoomlevel der Map im Defaultmodus, Längen- und Breitengrad
  if (map.tap) map.tap.disable(); // mobile friendly
  L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ', // Tilelaxer, also der Hintergrund wie die Farbe der Flüsse oder des Landes. Andere fertige Designs findet man zb unter https://leaflet-extras.github.io/leaflet-providers/preview/
	maxZoom: 16  // maximal mögliches Zoomlevel
}).addTo(map);
  map._layersMinZoom=8; // minimal mögliches Zoomlevel

var selectedRadio = 0; // für die Search Bar Auswahl: Anfangs ist das ausgewählte Radio das Radio 0

var RadioByName = {}; // Leere Variable, die später gefüllt wird

var markersLayer = new L.LayerGroup(); // Leere Schichtgruppe (ein Layer ist zb die Menge der Marker aus einer Datenquelle)
  
var radioMarkers = []; // noch eine leere Variable

map.addLayer(markersLayer); // Hier wird die Search Bar gebaut
  var controlSearch = new L.Control.Search({
    position:'topleft',    // mögliche Positionen: bottomleft, bottomright, topleft, topright
    layer: markersLayer,  // der Layer, der mit der Search Bar durchsucht werden soll, noch ist er leer
    initial: false,
    zoom: 11,   // Zoom bei finden eines gesuchten Markers
    marker: false,
    textPlaceholder: 'Suche...' // Text der vor Eingabe in der Search Bar zu sehen ist
  });

  map.addControl(controlSearch);  // Search Bar zur Karte hinzufügen

  var icon = L.icon({ // Abmessungen des Icons bestimmen
            iconUrl: 'icons/icon.png',  // Path zum Icon
            iconSize:     [30, 32],  // Breite und Höhe
            iconAnchor:   [15, 32], // Stelle des Ankers, mit dem Icon auf den Ort zeigt
            popupAnchor: [0, -32] // Stelle des Ankers, an dem das Popup am Icon sitzt
          });

// For-Schleife: Für jedes Element im Datenlayer radio werden folgende Schritte bearbeitet...
for(i=0; i<radio.length; i++) {

    RadioByName[radio[i].redaktion] = radio[i]; // Der Name der Radioredaktion wird in der Variable RadioByName gespeichert
    
    var radio_marker = []; // in diese Variable speichern wir ketzt für das jeweilige Radio Informationen wie den Redaktionsname und den Längen- und Breitengrad ab
    radio_marker.redaktion = radio[i].redaktion; 
    radio_marker.lat = radio[i].lat;
    radio_marker.long = radio[i].long;
    radio_marker.stadt = radio[i].stadt;
    radio_marker.redaktion_link = radio[i].redaktion_link;

// Die Search Bar durchsucht immer einen Titel und zoomt bei einem Match auf die loc, also die Lokalisation des Markers
// Deshalb definieren wir im nächsten Schritt den title und die loc und kreieren in radio_marker einen Marker an dieser stelle,
// mit dem icon = icon und dem title = Title und so weiter
    var title = radio_marker.redaktion, 
        loc = [radio_marker.long, radio_marker.lat],   
        radio_marker = new L.marker(new L.latLng(loc), {
          icon: icon,
          title: title,
          stadt: radio_marker.stadt,
          redaktion_link: radio_marker.redaktion_link
      });
// Wir fügen diesen Marker zur Variable markersLayer hinzu. Für jeses radio wird in der Schleife also so ein
// Marker in der variable abgelegt
    markersLayer.addLayer(radio_marker);  

// Wenn ein Nutzer auf den Marker einer Redaktion klickt, soll sich ein Popup öffnen. Dafür nehmen wir diese click function
    radio_marker.on('click', function(e) {
// nach dem Klick ist nicht mehr 0 sondern die ausgewähte Redaktion "Selected"
       changeSelection(e.target.options.title);
       // wir zentrieren die Karte bei Klick auf die ausgewählte Redaktion
       map.setView([e.target._latlng.lat, e.target._latlng.lng]);
// Hier basteln wir den Inhalt des Infofensters mit HTML-Elementen
       var myPopup = L.popup().setContent(
         "<strong>" +
         e.target.options.redaktion_link +
         "</strong> | " +
         e.target.options.stadt
      );
// Kniff, damit sich ein Popup öfter öffnen und schließen lässt
      e.target
       .unbindPopup()
       .bindPopup(myPopup)
       .openPopup();
   });
//den radio_marker in radioMarkers ablegen
    radioMarkers.push(radio_marker); 
}

// Damit sich das Popup auch öffnet, wenn der Nutzer nicht auf einen Marker klickt, ihn aber sucht,
// wiederholen wir den Bau des Popups. Eventuell gibt es dafür auch eine elegantere Lösung
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

// wenn die Search Bar geschlossen wird, setzt sich die Karte wieder auf ihr Urspungs Zoomlevel zurück
.on('search:collapsed', function(e) {
      map.setView([51.426002, 7.503215], 8);
  })
// Funktion zur Bestimmung des gerade ausgewählten Radios
function changeSelection(radioRedaktion) {
    if(selectedRadio == 0 || selectedRadio != radioRedaktion) {
        selectedRadio = radioRedaktion;           
    }
    else {
        selectedRadio = 0;
    }
}
}
