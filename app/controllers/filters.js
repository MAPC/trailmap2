import Ember from 'ember';

export default Ember.Controller.extend({
  applicationController: Ember.inject.controller('application'),
  actions: {
    toggleAll(props) {
      let applicationController = this.get('applicationController');
      let properties = applicationController.getProperties(props);
      let values = Object.values(properties);
      let keys = Object.keys(properties);
      if(values.includes(true)) {
        keys.forEach((key) => {
          applicationController.set(key, false);
        });
      } else {
        keys.forEach((key) => {
          applicationController.set(key, true);
        });
      }
    }
  }
});
