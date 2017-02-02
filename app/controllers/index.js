import Ember from 'ember';

export default Ember.Controller.extend({
  applicationController: Ember.inject.controller('application'),
  aboutPage: Ember.computed('model', function() {
    return this.get('model')[0];
  }),

  actions: {
    transitionTo(route, config) {
      this.transitionToRoute(route,{ queryParams: config});
    }
  }
});
