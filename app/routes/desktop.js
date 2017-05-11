import Ember from 'ember';
import trackPage from '../mixins/track-page';

export default Ember.Route.extend(trackPage, {
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
