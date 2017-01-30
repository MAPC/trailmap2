import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['splash-intro'],
  didInsertElement: function() {
    $('.logo')
      .transition('fade down', { duration: 1750 })
    ;
    $('p')
      .transition('fade down', { duration: 1750 })
    ;
    // $('.option')
    //   .transition('fade down', { duration: 1750 })
    // ;
  }
});
