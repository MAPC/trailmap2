import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    this.transitionTo('filters', { 
      queryParams:  {
        protected:false,
        shared:false,
        bike_lane:false,
        walk:false,
        multi_use_path:false,
        landline:true,
        zoom:10
      } 
    })
  }
});
