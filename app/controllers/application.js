import Ember from 'ember';
import computed from 'ember-computed';

export default Ember.Controller.extend({
  queryParams: ['protected','shared','bike_lane','walk','multi_use_path','landline','zoom','lat','lng', 'proposed'],

  protected: true,
  shared: true,
  bike_lane: true,
  walk: true,
  multi_use_path: true,
  landline: false,
  proposed: false,
  sublayers: function() {
    // order matters.
    return this.getProperties('protected','shared','bike_lane','walk','multi_use_path','landline');
  }.property('protected,shared,bike_lane,walk,multi_use_path,landline'),


  basemap: 'default',

  zoom: 11,
  lat: 42.32657,
  lng: -71.352,

  geolocation: Ember.inject.service(),
  currentLocation: null,
  customIcon: Ember.computed(function() {
    return L.icon.pulse({iconSize:[20,20],color:'blue'});
  }),

  feedback_adding: false,
  feedback_lat: null,
  feedback_lng: null,
  feedback_name: null,
  feedback_email: null,
  feedback_text: null,
  feedback_status: false,

  actions: {
    updateFeedbackLocation(e) {
      let location = e.target.getLatLng();
      this.setProperties({
        feedback_lat: location.lat,
        feedback_lng: location.lng
      });
    },

    submitFeedback() {
      this.set('feedback_status', 'loading');
      var geojson = {
        "type": "Point",
        "coordinates":[this.get('feedback_lng'),this.get('feedback_lat')] 
      };

      var sql = "SELECT osm2_upsert_trailmap_userdata(ARRAY[-1], ARRAY['" + JSON.stringify(geojson) + "'],'" + this.get('feedback_name') + "','" + this.get('feedback_email') + "', '"  + this.get('feedback_text')  +  "' )";

      $.post('//mapc-admin.carto.com/api/v2/sql', {"q":sql}, (data,status) => {
        this.set('feedback_status', 'success');
      }).
      fail(() => {
        this.set('feedback_status', 'fail');
      });
    },
    resetFeedback() {
      this.set('feedback_status', false);
    },

    toggleAll(props) {
      let properties = this.getProperties(props);
      let values = Object.values(properties);
      let keys = Object.keys(properties);
      if(values.includes(true)) {
        keys.forEach((key) => {
          this.set(key, false);
        });
      } else {
        keys.forEach((key) => {
          this.set(key, true);
        });
      }
    },

    updatePosition(e) {
      let map = e.target;
      this.setProperties({
        lat: map.getCenter().lat,
        lng: map.getCenter().lng
      });
    },

    trackLocation() {
      this.get('geolocation').trackLocation({enableHighAccuracy: true}, (geoObject) => {
        this.set('currentLocation', this.get('geolocation.currentLocation'));
      });
      this.get('geolocation').getLocation().then((geoObject) => {
        let { latitude, longitude } = geoObject.coords;
        this.setProperties({lat: latitude, lng: longitude, zoom: 18 });
      });
      
      this.transitionToRoute('filters', { queryParams: { bike_lane: false, 
                                                          protected: false, 
                                                          shared: false,
                                                          walk: true,
                                                          multi_use_path: false,
                                                          landline: false } });

    }
  }
});
