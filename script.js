/* global google */
/* global $ */

$(function(){
   populateCountries();
   renderCountries(countries);
   //$( "#firstCountries" ).combobox();
//    $( "#firstCountries" ).autocomplete({
//       source: countries
//     });
   $('#showButton').click(showThingsToDo);


   $('#firstCountries').on('change', countrySelectionChanged);
   $('#exploreButton').on('click', function(){
      var country =  $('#firstCountries').val();
     if (country===null) {
      swal({  title: "Pick a country first!",   
               text: "You can do this by clicking on the map or choosing from a list",   
               imageUrl: "Earth.ico" 
            });
    } else {
      showThingsToDo(country);
      /*isMapMode = false;
      modeChanged();*/
      //showThingsToDo(country);
    }
   });
   $('#backToMap').click(function(){

       isMapMode = true;
       modeChanged();
   });
   var date = new Date();
   $('#datepickerDepart').datepicker();
   $('#datepickerDepart').datepicker('setDate', date.toLocaleDateString());
   $('#datepickerReturn').datepicker();
   $('#datepickerReturn').datepicker('setDate', date.toLocaleDateString());
   modeChanged();

}); 

var isMapMode = true;
var airports = airportData.airports;
var countries = [];
var countryInfo = {};
var map;
var geocoder;

function initMap() {
    var style = [
  {
    "featureType": "landscape.natural.landcover",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "water",
    "stylers": [
      { "hue": "#00b2ff" },
      { "color": "#7ac7eb" }
    ]
  },{
    "featureType": "road.highway",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      { "visibility": "on" },
      { "color": "#94ffa5" },
      { "hue": "#ff0008" },
      { "weight": 1.5 }
    ]
  },{
    "featureType": "administrative.locality",
    "elementType": "labels.text",
    "stylers": [
      { "visibility": "on" },
      { "weight": 0.1 },
      { "color": "#444880" }
    ]
  },{
  }
]
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 50, lng: 27.644},
        zoom: 3,
        styles: style
    });
    map.addListener('click', function(e) {	 
        var latLng = e.latLng;
        positionCountryByLatLng(latLng);
    });
    map.addListener('idle', function(e){
        $('.gmnoprint').remove();
    });
};

function countrySelectionChanged(event) {
    var country = $('#firstCountries').val();
    if (country===null) {
      swal("Oops!", "The data about country you picked is currently unavailable. Please, choose another country to explore or try again later")
    } else {
      positionCountry(country);
      var exploreText = $('#exploreButton').text();
      $('#exploreButton').text("Explore " + country);
    }
};

function positionCountry(country) {
    if(!geocoder) {
        geocoder = new google.maps.Geocoder();    
    }
    geocoder.geocode( { 'address': country}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            map.fitBounds(results[0].geometry.viewport);
        }
    });
};

function positionCountryByLatLng(latLng) {
    if(!geocoder) {
        geocoder = new google.maps.Geocoder();    
    }
    geocoder.geocode({'location': latLng}, function(results, status){
        if (status == google.maps.GeocoderStatus.OK && results.length) {
            var last_result = results[results.length - 1];
            var country = last_result.formatted_address;
            $('#firstCountries').val(country);
            countrySelectionChanged();
        }
    })
};

function modeChanged() {
    if(isMapMode) {
        $('#first').show();
        $('#details').hide();
    } else {
        $('#first').hide();
        $('#details').show();
    }
};
  
function populateCountries(){
    for (var i = 0; i<airports.length; ++i) {
        var airport = airports[i];
        var country = airport.country;
        if(!countryInfo[country]) {
            countryInfo[country] = {};
            countryInfo[country].cities = [];
        }
        
        countryInfo[country].cities.push($.extend({}, airport));
    }
    var countryNames = Object.keys(countryInfo);
    for(var i = 0; i<countryNames.length; ++i) {
        countries.push(countryNames[i]);
    }
    countries.sort();
};

function renderCountries(countries) {
    var dropDown = $('.countries');
    var defaultOption = $("<option selected disabled hidden value=''>Select country</option>");
    dropDown.append(defaultOption);
    for(var i = 0; i<countries.length; ++i) {
        var country = countries[i];
        var option = $("<option></option>");
        option.val(country);
        option.text(country);
        dropDown.append(option);    
    }
};

function showThingsToDo(selectedCountry) {
    if(selectedCountry){
      $('.pic-container')[0].innerHTML = "";
      var cities = countryInfo[selectedCountry].cities;
      var i;
      var map = {};
      for(i = 0; i<cities.length; i++){
        if (!map[cities[i].city]) {
          var city = cities[i];
          showThings(city);
          map[cities[i].city] = true;
        }
      }
      if (i===cities.length&&isMapMode) {

        swal("Oops!", "The data about country you picked is currently unavailable. Please, choose another country to explore or try again later");
    
    }
  };
}




