import Ember from 'ember';
import { computed, observer } from 'ember-computed';
import trackPage from '../mixins/track-page';

const host = 'https://mapc.github.io/trailmap-about/';

export default Ember.Route.extend(trackPage, {
  init() {
    this._super(...arguments);
    this.set('locations', []);
  },

  model() {
    return $.getJSON(host);
  },

  afterModel(model) {
    let indexController = this.controllerFor('index');
    indexController.set('host', host);
    if(model) {
      indexController.set('aboutPage', model[0]);  
    }
  },

  queryParams: { 
    'zoom': { 
      replace: true 
    },
    'lat': { 
      replace: true 
    },
    'lng': { 
      replace: true 
    }
  },

  locations: null, 

  geolocation: Ember.inject.service(),
  tracking: false,

  actions: {
    getLocation() {
      let mapController = this.controllerFor('application');
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
    if (this.get("tracking")) {
      let currentLocation = this.get('geolocation.currentLocation');
      if (currentLocation) {
        this.get('locations').pushObject({ lat: currentLocation[0], lng: currentLocation[1]});  
      }
      let mapController = this.controllerFor('application');
      mapController.set('locations', this.get('locations'));
    }
  })
});
