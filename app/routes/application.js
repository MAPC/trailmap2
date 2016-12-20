import Ember from 'ember';

export default Ember.Route.extend({
  geolocation: Ember.inject.service(),
  tracking: false,
  actions: {
    getLocation() {
      let applicationController = this.controllerFor('application')
      if (this.get('tracking')) {
        this.toggleProperty('tracking');
        this.get('geolocation').stopTracking();
        applicationController.set('currentLocation', null);
      } else {
        this.toggleProperty('tracking');
        this.get('geolocation').trackLocation(null, (geoObject) => {
          applicationController.set('currentLocation', this.get('geolocation.currentLocation'));
        });        
      }
    }
  }
});
