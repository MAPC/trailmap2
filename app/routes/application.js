import Ember from 'ember';
import { computed, observer } from 'ember-computed';

export default Ember.Route.extend({
  init() {
    this._super(...arguments);
    this.set('locations', []);
  },
  locations: null, 

  geolocation: Ember.inject.service(),
  tracking: false,

  actions: {
    getLocation() {
      let mapController = this.controllerFor('map');
      if (this.get('tracking')) {
        this.toggleProperty('tracking');
        this.get('geolocation').stopTracking();
        mapController.set('currentLocation', null);
      } else {
        this.toggleProperty('tracking');
        this.get('geolocation').trackLocation({enableHighAccuracy: true}, (geoObject) => {
          mapController.set('currentLocation', this.get('geolocation.currentLocation'));
        });
      }
    }
  },

  trackLocationLine: Ember.observer('geolocation.currentLocation', function() {
    let currentLocation = this.get('geolocation.currentLocation');
    if (currentLocation) {
      this.get('locations').pushObject({ lat: currentLocation[0], lng: currentLocation[1]});  
    }
    let mapController = this.controllerFor('map');
    mapController.set('locations', this.get('locations'));
  })
});
