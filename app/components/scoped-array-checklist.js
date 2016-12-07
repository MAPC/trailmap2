import Ember from 'ember';
import computed from 'ember-computed';

export default Ember.Component.extend({
  getVals: Ember.on('init', function() {
    let optionList = this.get('optionList').mapBy('code');
    let valuesList = this.get('valuesList');
    valuesList = JSON.parse(`[${valuesList}]`);
    
    this.set('codes', optionList);
    this.set('valuesList', valuesList);

    optionList.forEach((el) => {
      this.set(`option${el}`, false);
    });

    valuesList.forEach((el) => {
      this.set(`option${el}`, true);
    });
  }),
  generateString: function() {
    let codes = this.get('codes').filter((el) => {
      let val = !!this.get(`option${el}`);
      return val;
    });
    this.set('valuesList', codes);
  },
  actions: {
    reset: function(id, val) {
      this.set(id, val);
      this.generateString();
    }
  }
});
