import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    let applicationController = this.controllerFor('application');
    applicationController.sendAction('trackLocation');
  }
});
