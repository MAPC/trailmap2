import Ember from 'ember';
import computed from 'ember-computed';

export default Ember.Component.extend({
  classNames: ['filter-list', 'menu'],
  checklistItems: null,
  valuesList: '',

  init() {
    this._super(...arguments);
    this.checklistItems = this.checklistItems || [];
  },

  parsedValuesList: computed('valuesList', function() {
    let valuesList = this.get('valuesList');
    return JSON.parse(`[${valuesList}]`);
  }),

  actions: {
    toggleItem(item, value) {
      let newList = this.get('parsedValuesList');
      value ? newList.pushObject(item.value) : newList.removeObject(item.value)
      
      this.set('valuesList', newList.toString());
    }
  }
});
