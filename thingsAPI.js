
function showThings (city) {
  $.ajax({
    url: "http://terminal2.expedia.com:80/x/activities/search?location=" + city + "&startDate=2016-08-08&endDate=2016-08-18&apikey=lZg5sVj3LGQC7PZFGX6tkAw2mwAzyINJ",
    type: "get",
    success: function(res) { 
      var things = [];
      var results = res.activities;
      for (var i = 0; i<results.length; i++) {
        var thingsObject = {};
        thingsObject.title = results[i].title;
        thingsObject.image = results[i].imageUrl;
        things.push(thingsObject);
      }
      visualizationThings (city, things);
    }
  });
}

function visualizationThings (city, things) {
   var title = $("<h3></h3>");
   title.text(city);
   $('.pic-container').append(title);
   for (var i = 0; i<things.length; i++) {
       var image = $('<img>',{id:'theImg', src:"http:" + things[i].image, height: 197, width: 350});
       $('.pic-container').append(image);
   }
}

function showTravelData (airport, date, coords) {
  var travelData = {};
  $.ajax({
    url: "http://terminal2.expedia.com:80/x/mflights/search?departureDate=&returnDate=2016-02-20&departureAirport="+ airport.departure.code + "&arrivalAirport=" + airport.arrival.code + "&apikey=TkefBxxLZbMGgOvKRGFLIkYJxcB3bYtA",
    type: "get",
    success: function(res) { 
      var results = res.offers;
      var price = results[0].baseFarePrice.formattedWholePrice;
      travelData.flightPrice = price;
      //console.log(travelData.flightPrice)
    }
  });
  $.ajax({
    url: "http://terminal2.expedia.com/x/cars/search?pickupdate=2016-03-21T10:00&dropoffdate=2016-03-28T16:30&pickuplocation=" +airport.arrival.code + "&dropofflocation=" + airport + "&sort=price&limit=2&apikey=PxOSAzW4pRSLSJSVYnuQQoAQNPGGBWOV",
    type: "get",
    success: function(res) { 
      var results = res.CarInfoList.CarInfo;
      var priceCar = results[0].Price.TotalRate.Value;
      travelData.carPrice = '$' + Math.round(priceCar);
      //console.log(travelData.carPrice)
    }
  });
  $.ajax({
    url: "http://terminal2.expedia.com:80/x/hotels?maxhotels=3&location=47.6063889%2C-122.3308333&radius=5km&checkInDate=2016-02-10&checkOutDate=2016-02-11&adults=2&sort=price&apikey=0Eb5uaO0qiviAKfn4E6pbzGrdSaYA7Or",
    type: "get",
    success: function(res) { 
      var results = res.HotelInfoList.HotelInfo;
      var priceHotel = results[0].Price.TotalRate.Value;
      travelData.hotelPrice = '$' + Math.round(priceHotel);
      //console.log(travelData.hotelPrice)
    }
  });
}