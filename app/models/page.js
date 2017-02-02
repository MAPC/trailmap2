import DS from 'ember-data';
import Contentful from 'ember-data-contentful/models/contentful';

export default Contentful.extend({
  title: DS.attr('string'),
  tagline: DS.attr('string'),
  description: DS.attr('string'),
  disclaimer: DS.attr('string'),
  tiles: DS.hasMany('tile')
});
