import Ember from 'ember';
// import Accordion from 'semantic-ui-ember/components/ui-accordion';

export default Ember.Component.extend({
  didInsertElement() {
    $('.ui.accordion').accordion();
    $('.ui.accordion .parent-checkbox').click(function(e) {
         //do something
         console.log(e);
         e.stopPropagation();
      });
  }
});
