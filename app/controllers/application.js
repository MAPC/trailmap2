import Ember from 'ember';
import computed from 'ember-computed';
import cartodbSql from '../utils/cartodb-sql';
import config from '../config/environment';
import request from 'ember-ajax';

let filters = config.APP.filters;
let paramNames = filters.uniqBy('alias').mapBy('alias').concat(['showProposed']);

export default Ember.Controller.extend({
  ajax: Ember.inject.service(),
  queryParams: ['protected','shared','bike_lane','walk','multi_use_path','landline'],
  // these long field sql pieces need to be moved into environment. the API should change to allow for this.
  walkingtrailsQuery: makeSql('walk_fac_type', ["(CASE WHEN fac_type=1 THEN 1 WHEN fac_type=2 THEN 1 WHEN fac_type=3 THEN 1 END) AS fac_type_simp_code", "CASE WHEN fac_type=1 THEN 'Paved Walkway' WHEN fac_type=2 THEN 'Footpath' WHEN fac_type=3 THEN 'Cartpath' END AS fac_type_name"]),
  bikefacilitiesQuery: makeSql('bike_fac_type', ["(CASE WHEN fac_type=1 then 'Bike Lane' WHEN fac_type=2 THEN 'Cycle Track' WHEN fac_type=3 THEN 'Sign-posted on-road bike route' WHEN fac_type=4 THEN 'Paved bike shoulder' WHEN fac_type=5 THEN 'Shared-Use Path' WHEN fac_type=7 THEN 'Bicycle / Pedestrian priority roadway' WHEN fac_type=9 THEN 'Marked Shared-Lane' END) AS fac_type_str"]),
  landlineregionalgreenwaysQuery: makeSql('land_line_type'),
  dualtrailsQuery: makeSql('dual_fac_type', ["(CASE WHEN fac_type=1 then 'Bike Lane' WHEN fac_type=2 THEN 'Cycle Track' WHEN fac_type=3 THEN 'Sign-posted on-road bike route' WHEN fac_type=4 THEN 'Paved bike shoulder' WHEN fac_type=5 THEN 'Shared-Use Path' WHEN fac_type=7 THEN 'Bicycle / Pedestrian priority roadway' WHEN fac_type=9 THEN 'Marked Shared-Lane' END) AS fac_type_str"]),

  sqlMapping: function() {
    // order matters.
    return [this.get('landlineregionalgreenwaysQuery'),
            this.get('bikefacilitiesQuery'),
            this.get('walkingtrailsQuery'),
            this.get('dualtrailsQuery')];

  }.property('walkingtrailsQuery,bikefacilitiesQuery,landlineregionalgreenwaysQuery,dualtrailsQuery'),

  protected: false,
  shared: false,
  bike_lane: false,
  walk: false,
  multi_use_path: false,
  landline: false,
  proposed: false,
  sublayers: function() {
    // order matters.
    return this.getProperties('protected','shared','bike_lane','walk','multi_use_path','landline');
  }.property('protected,shared,bike_lane,walk,multi_use_path,landline','proposed'),

  bike_fac_type: '1,2,9',
  walk_fac_type: '1',
  dual_fac_type: '5',
  land_line_type: false,
  basemap: 'default',
  showProposed: false,

  zoom: 11,
  lat: 42.32657,
  lng: -71.352,

  currentLocation: null,

  bikeMetaData: config.APP.domains.bike_fac_type,
  bikeFacChecklist: computed('bike_fac_type', 'bikeMetaData', function() {
    let codedValues = this.get('bikeMetaData.domain.codedValues');
    return codedValues.map((c) => {
      return { label: c.name, value: c.code, color: c.color };
    });
  }),

  walkMetaData: config.APP.domains.walk_fac_type,
  dualMetaData: config.APP.domains.dual_fac_type,
  regionalLandLineMetaData: config.APP.domains.landline_regional_greenways,



  actions: {
    toggleCategories(category,defaultValues) {
      let localCategory = this.get(category);
      
      if (localCategory) {
        this.set(category, '');
      } else {
        this.set(category, defaultValues);
      }
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

function makeSql(alias, fields) {
  return computed(...paramNames, function() {
    return cartodbSql(this, filters, alias, fields);
  });
}