/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    metricsAdapters: [
      {
        name: 'GoogleAnalytics',
        environments: ['development', 'production'],
        config: {
          id: 'UA-5547782-27',
          // Use `analytics_debug.js` in development
          // debug: environment === 'development',
          // Use verbose tracing of GA events
          // trace: environment === 'development',
          // Ensure development env hits aren't sent to GA
          sendHitTask: environment !== 'development'
        }
      }
    ],
    googleFonts: [
      'Open+Sans'
    ],
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
    trackJs: {
      config: {
        token: "d3652eff27744c068ec692baace6a7d4",
        application: "trailmap"
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
        name: "fac_type_status",
        alias: "bike_fac_type_status",
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
                color: "#7f3193"
              },
              {
                name: "Shared Lane Marking",
                code: 9,
                color: "#82C5EC"
              },
              {
                name: "Bike Lane",
                code: 1,
                color: "#0874b9"
              }
            ]
          },
          editable: true,
          nullable: false
        },
        bike_fac_type_status: {
          name: "fac_type",
          type: "esriFieldTypeSmallInteger",
          alias: "Facility Type",
          domain: {
            type: "codedValue",
            name: "fac_stat",
            codedValues: [
              {
                name: "Existing",
                code: 1
              },
              {
                name: "Proposed",
                code: 2
              }
            ]
          }
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
                color: "#db813f"
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
                color: "#275f68"
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
                color: "#FFCC00"
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
    ENV.trackJs.config.enabled = false;
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

  if (environment === 'github') {
    ENV.locationType = 'auto';
    ENV.baseUrl = '/trailmap/';
    ENV.prepend = 'https://mapc.github.io/trailmap2/';
    ENV.trackJs.config.enabled = true;
  }

  if (environment === 'production') {
    ENV.locationType = 'auto';
    ENV.trackJs.config.enabled = true;
  }
  return ENV;
};

