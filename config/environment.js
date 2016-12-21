/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'trailmap',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      filters: [
      {
        name: "fac_type",
        alias: "bike_fac_type",
        table: "bike_facilities",
        type: "list"
      },
      {
        name: "fac_type_simp_code",
        alias: "walk_fac_type",
        table: "walking_trails",
        type: "list"
      },
      {
        name: "fac_type",
        alias: "dual_fac_type",
        table: "bike_facilities",
        type: "list"
      },
      {
        name: "none",
        alias: "land_line_type",
        table: "landline_regional_greenways",
        type: "toggle"
      }
      ],
      domains: {
        bike_fac_type: {
          name: "fac_type",
          type: "esriFieldTypeSmallInteger",
          alias: "Facility Type",
          domain: {
            type: "codedValue",
            name: "fac_type",
            codedValues: [
              {
                name: "Protected Bike Lane",
                code: 2,
                color: "#FDBF6F"
              },
              {
                name: "Sign-posted on-road bike route",
                code: 3,
                color: "#1F78B4"
              },
              {
                name: "Bike Lane",
                code: 1,
                color: "#A6CEE3"
              }
            ]
          },
          editable: true,
          nullable: false
        },
        walk_fac_type: {
          name: "fac_type_simp_code",
          type: "esriFieldTypeSmallInteger",
          alias: "Facility Type",
          domain: {
            type: "codedValue",
            name: "fac_type_simp_code",
            codedValues: [
              {
                name: "Walkways & Trails",
                code: 1,
                color: "#A6CEE3"
              }
            ]
          },
          editable: true,
          nullable: false
        },
        dual_fac_type: {
          name: "dual_fac_type",
          type: "esriFieldTypeSmallInteger",
          alias: "Facility Type",
          domain: {
            type: "codedValue",
            name: "dual_fac_type",
            codedValues: [
              {
                name: "Multi-Use Path",
                code: 5,
                color: "#A6CEE3"
              }
            ]
          },
          editable: true,
          nullable: false
        },
        landline_regional_greenways: {
          name: "landline_regional_greenways",
          type: "esriFieldTypeSmallInteger",
          alias: "Facility Type",
          domain: {
            type: "codedValue",
            name: "landline_regional_greenways",
            codedValues: [
              {
                name: "Regional Land Lines",
                code: false,
                color: "#A6CEE3"
              }
            ]
          },
          editable: true,
          nullable: false
        }
      }
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.locationType = 'hash';
    ENV.baseUrl = '/trailmap/';

  }

  return ENV;
};

