import Ember from 'ember';

export default Ember.Controller.extend({
  applicationController: Ember.inject.controller('application'),

  actions: {
    transitionTo(route, config) {
      this.transitionToRoute(route,{ queryParams: config});
    }
  }
});
