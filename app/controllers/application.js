import Ember from 'ember';
import computed from 'ember-computed';
import cartodbSql from '../utils/cartodb-sql';
import config from '../config/environment';
import request from 'ember-ajax';

let filters = config.APP.filters;
let paramNames = filters.uniqBy('alias').mapBy('alias');

export default Ember.Controller.extend({
  ajax: Ember.inject.service(),
  queryParams: filters.uniqBy('alias').mapBy('alias').concat(['zoom', 'lat', 'lng']),
  // these long field sql pieces need to be moved into environment. the API should change to allow for this.
  walkingtrailsQuery: makeSql('walking_trails', ["CASE WHEN fac_type=1 THEN 'Paved Walkway' WHEN fac_type=2 THEN 'Footpath' WHEN fac_type=3 THEN 'Cartpath' END AS fac_type_name"]),
  bikefacilitiesQuery: makeSql('bike_facilities', ["(CASE WHEN fac_type=1 then 'Bike Lane' WHEN fac_type=2 THEN 'Cycle Track' WHEN fac_type=3 THEN 'Sign-posted on-road bike route' WHEN fac_type=4 THEN 'Paved bike shoulder' WHEN fac_type=5 THEN 'Shared-Use Path' WHEN fac_type=7 THEN 'Bicycle / Pedestrian priority roadway' WHEN fac_type=9 THEN 'Marked Shared-Lane' END) AS fac_type_str"]),
  landlineregionalgreenwaysQuery: makeSql('landline_regional_greenways'),

  sqlMapping: function() {
    // order matters.
    return [this.get('landlineregionalgreenwaysQuery'),
            this.get('bikefacilitiesQuery'),
            this.get('walkingtrailsQuery')];

  }.property('walkingtrailsQuery,bikefacilitiesQuery,landlineregionalgreenwaysQuery'),

  bike_fac_type: '1,3,4,5,7,9,2',
  walk_fac_type: '1,2,3',

  zoom: 11,
  lat: 42.32657,
  lng: -71.352,

  bikeMetaData: config.APP.domains.bike_fac_type,
  walkMetaData: config.APP.domains.walk_fac_type,

  actions: {
    getMap(map) {
      map.target.eachLayer(function(layer) {
        window.layer = layer;
      });
      
      map.target.zoomControl.setPosition('topright');
    },
    updatePosition(e) {
      let map = e.target;
      this.setProperties({
        lat: map.getCenter().lat,
        lng: map.getCenter().lng,
        zoom: map.getZoom()
      });
    }
  }
});

function makeSql(table, fields) {
  return computed(...paramNames, function() {
    return cartodbSql(this, filters, table, fields);
  });
}