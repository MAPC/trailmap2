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
      let applicationController = this.controllerFor('application');
      if (this.get('tracking')) {
        this.toggleProperty('tracking');
        this.get('geolocation').stopTracking();
        applicationController.set('currentLocation', null);
      } else {
        this.toggleProperty('tracking');
        this.get('geolocation').trackLocation({enableHighAccuracy: true}, (geoObject) => {
          applicationController.set('currentLocation', this.get('geolocation.currentLocation'));
        });
      }
    }
  },
  trackLocationLine: Ember.observer('geolocation.currentLocation', function() {
    let currentLocation = this.get('geolocation.currentLocation');
    if (currentLocation) {
      this.get('locations').pushObject({ lat: currentLocation[0], lng: currentLocation[1]});  
    }
    let applicationController = this.controllerFor('application');
    applicationController.set('locations', this.get('locations'));
  })
  // some debounce functionality that hits currentLocation at some set interval?
  // or it observes it... then a geojson loads feature. I think this is in leaflet.
});
