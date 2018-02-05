var map;
//Foursquare clientID and clientSecret
var clientID = "NKPPM1VB2BPVNEL0MHDXNUOKA3LCV2VLI3V0HDKQXCUVBBVL";
var clientSecret = "ERWLF2P4J2D5ET5C4CFULRQFC33FBSHHU0E5RQAANHUS0U1W";


function ViewModel(){

  var self = this;
  this.markers = [];
  this.search = ko.observable("");

  this.initMap = function() {
    var styles = [
      {
        featureType: 'water',
        stylers: [
          { color: '#19a0d8' }
        ]
      }
    ];
        var map = document.getElementById('map');
        var options = {
            center: new google.maps.LatLng(37.7749295, -122.41941550000001),
            zoom: 10,
            styles: styles
        };
        var location = [
            {
                title: 'Half Moon Bay',
                lat: 37.45894426360077,
                lng: -122.43521123193204,
            },
            {
                title: 'Twin Peaks',
                lat: 37.752529660262965,
                lng: -122.44760513305664,
            },
            {
                title: 'Golden Gate',
                lat: 37.769629,
                lng:  -122.486229,
            },
            {
                title: 'Zoo',
                lat: 37.733254,
                lng: -122.505455,
            },
            {
                title: 'Pier 39',
                lat: 37.808699 ,
                lng: -122.40984,
            }
        ];
        // Creating map
        map = new google.maps.Map(map, options);
        for (var i = 0; i < location.length; i++){
          this.title = location[i].title;
          this.lat = location[i].lat;
          this.lng = location[i].lng;
          // Google Maps marker setup
          this.marker = new google.maps.Marker({
              map: map,
              position: {
                  lat: this.lat,
                  lng: this.lng
              },
              title: this.title,
              lat: this.lat,
              lng: this.lng,
              id: i,
              animation: google.maps.Animation.DROP,
          });
          this.marker.setMap(map);
          this.markers.push(this.marker);
          // var largeInfoWindow = new google.maps.InfoWindow({
          //   content: this.title
          // });
          this.marker.addListener('click', self.mapper);
        }

};

this.mapper = function() {
    self.populateInfoWindow(this);
};

//for the info window
this.populateInfoWindow = function(marker){
    var url = 'https://api.foursquare.com/v2/venues/search?ll=' +
        marker.lat + ',' + marker.lng + '&client_id=' + clientID +
        '&client_secret=' + clientSecret + '&query=' + marker.title +
        '&v=20170708';
        $.getJSON(url).done(function(data) {
        var response = data.response.venues[0];
            self.city = response.location.formattedAddress[1];
            InfoWindow.setContent(marker.title+self.city);
        }).fail(function(){
          alert('foursquare erroe');
        });
        var InfoWindow = new google.maps.InfoWindow({
            // content: marker.title + self.city
        });
      InfoWindow.open(map, marker);
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout((function() {
                  marker.setAnimation(null);
            }).bind(marker),700);
  };

  this.initMap();
//filtering
  this.filter = ko.computed(function() {
      var a = [];
      for (var i = 0; i < this.markers.length; i++) {
          var m = this.markers[i];
          if (m.title.toLowerCase().includes(this.search())) {
              a.push(m);
              this.markers[i].setVisible(true);
          } else {
              this.markers[i].setVisible(false);
          }
      }
      return a;
  }, this);

}


function error(){
  alert("There is a problem loading the application");
}

function start(){
  ko.applyBindings(new ViewModel());
}
