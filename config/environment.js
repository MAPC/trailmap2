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
        name: "fac_type",
        alias: "walk_fac_type",
        table: "walking_trails",
        type: "list"
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
                name: "Bike Lane",
                code: 1,
                color: "#A6CEE3"
              },
              {
                name: "Sign-posted on-road bike route",
                code: 3,
                color: "#1F78B4"
              },
              {
                name: "Paved bike shoulder",
                code: 4,
                color: "#B2DF8A"
              },
              {
                name: "Shared-Use Path",
                code: 5,
                color: "#33A02C"
              },
              {
                name: "Bicycle / Pedestrian priority roadway",
                code: 7,
                color: "#FB9A99"
              },
              {
                name: "Marked Shared-Lane",
                code: 9,
                color: "#E31A1C"
              },
              {
                name: "Protected Bike Lane",
                code: 2,
                color: "#FDBF6F"
              }
            ]
          },
          editable: true,
          nullable: false
        },
        walk_fac_type: {
          name: "fac_type",
          type: "esriFieldTypeSmallInteger",
          alias: "Facility Type",
          domain: {
            type: "codedValue",
            name: "wfac_type",
            codedValues: [
              {
                name: "Paved Walkway",
                code: 1,
                color: "#A6CEE3"
              },
              {
                name: "Footpath, natural surface (single track or unknown/default)",
                code: 2,
                color: "#1F78B4"
              },
              {
                name: "Cartpath, natural surface (double track)",
                code: 3,
                color: "#B2DF8A"
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

