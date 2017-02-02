import DS from 'ember-data';
import Contentful from 'ember-data-contentful/models/contentful';

export default Contentful.extend({
  title: DS.attr('string'),
  description: DS.attr('string'),
  stateConfiguration: DS.attr(),
  background: DS.belongsTo('contentful-asset')

});
