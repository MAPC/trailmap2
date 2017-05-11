import Ember from 'ember';

export default Ember.Route.extend({
  geolocation: Ember.inject.service(),
  beforeModel() {
    let applicationController = this.controllerFor('application');
    this.get('geolocation').trackLocation({enableHighAccuracy: true}, (geoObject) => {
      applicationController.set('currentLocation', this.get('geolocation.currentLocation'));
    });
    this.get('geolocation').getLocation().then((geoObject) => {
      let { latitude, longitude } = geoObject.coords;
      applicationController.setProperties({lat: latitude, lng: longitude, zoom: 18 });
    });
    
    this.transitionTo('filters', { queryParams: {       bike_lane: true, 
                                                        protected: false, 
                                                        shared: false,
                                                        walk: true,
                                                        multi_use_path: true,
                                                        landline: false } });
  }
});
