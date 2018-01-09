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
    },

    sentry: {
      dsn: 'https://b3d3cc0fb17741daad6df5c790fa1e0d@sentry.io/268942',
      debug: true,
      development: false,
      exposedPropertyName: 'raven',
      globalErrorCatching: true,
      includePaths: [],
      whitelistUrls: [],
      ravenOptions: {},
    }
  };

  ENV.contentSecurityPolicy = {
    // Deny everything by default
    'default-src': "'unsafe-inline'",
    'script-src': ["'self'", "https://www.google-analytics.com", "http://mapc.carto.com", "https://mapc-admin.carto.com", "https://cartocdn-ashbu.global.ssl.fastly.net", "'unsafe-inline'"],
    'font-src': ["'self'", "http://themes.googleusercontent.com", "http://fonts.gstatic.com/", "data: application/font-woff"],
    'connect-src': ["'self'", "app.getsentry.com", "https://mapc.github.io/trailmap-about/", "http://www.google-analytics.com", "https://mapc-admin.carto.com"],
    'img-src': ["'self'", "data: app.getsentry.com", "http://www.google-analytics.com", "https://cartocdn-ashbu.global.ssl.fastly.net", "https://cartodb-basemaps-b.global.ssl.fastly.net", "https://cartodb-basemaps-a.global.ssl.fastly.net", "https://cartodb-basemaps-c.global.ssl.fastly.net/", "http://cartodb.s3.amazonaws.com" ],
    'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    'media-src': null
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
  }

  if (environment === 'production') {
    ENV.locationType = 'auto';
  }
  return ENV;
};

