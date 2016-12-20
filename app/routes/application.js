import Ember from 'ember';

export default Ember.Route.extend({
  geolocation: Ember.inject.service(),
  model() {
    this.get('geolocation').trackLocation(null, (geoObject) => {
      this.controllerFor('application').set('currentLocation', this.get('geolocation.currentLocation'));
    });
  }
});
