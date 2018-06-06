
//store our API endpoint in a variable 
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson";


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});
function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake, 'onEachFeature' is built into leaflet 
  //getting feature.properties.place & feature.properties.time from the geojson..
  //onEachFeature comes with geojson
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + "Loc: " +feature.properties.place + "<h3>" + "Mag: "+ feature.properties.mag+
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");

  };
 function getColor (mag) {
     if (mag > 7){
         return "#DC143C"
     }
     else if (mag>6 && mag<7){
         return "#FF7F50"
     }
     else if (mag>5 && mag<6){
        return "#FF8C00"
    }
    else if (mag>4 && mag<5){
        return "#FF1493"
    }
    else if (mag>3 && mag<4){
        return "#B2222"
    }
    else if (mag>2 && mag<3){
        return "#8B008B"
    }
    else if (mag>1 && mag<2){
        return "8FBC8F"
    }
 }

 function styleData(feature){
    return {
        stroke: true,
        color: "black",
        weight: .45, 
        fillOpacity: .6,
        fillColor: getColor(feature.properties.mag),
        radius:feature.properties.mag *2
    };

 }
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    style: styleData,
 
});
 
 // Sending our earthquakes layer to the createMap function
 createMap(earthquakes);
}
function createMap(earthquakes) {

  // Define streetmap and darkmap layers
 var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
   "access_token=pk.eyJ1IjoibWZiYWRnbGV5IiwiYSI6ImNqaDltemxzeDBlZGYzOWw3anNhZTZiN3UifQ.IiKvQ1KAWD54mgC2dzTnWw"
  );
  
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/navigation-preview-night-v2/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibWZiYWRnbGV5IiwiYSI6ImNqaDltemxzeDBlZGYzOWw3anNhZTZiN3UifQ.IiKvQ1KAWD54mgC2dzTnWw"
  );

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Base Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map...this is the toggle in the upper right hand corner...
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
