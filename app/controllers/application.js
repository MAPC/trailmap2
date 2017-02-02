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

  actions: {
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
        lng: map.getCenter().lng,
        zoom: map.getZoom()
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
