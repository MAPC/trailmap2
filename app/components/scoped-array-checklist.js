import Ember from 'ember';
import computed from 'ember-computed';

export default Ember.Component.extend({
  getVals: Ember.on('init', function() {
    let optionList = this.get('optionList');
    this.set('codes', optionList.mapBy('code'));
  }),
  generateString: function() {
    let codes = this.get('codes').filter((el) => {
      let val = !!this.get(`option${el}`);
      console.log(val);
      return val;
    });
    console.log(codes);
  },
  actions: {
    reset: function(id, val) {
      this.set(id, val);
      this.generateString();
    }
  }
});
