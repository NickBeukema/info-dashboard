/* eslint-env node */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'dashboard-app',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',

    googleFonts: [
      'Open+Sans:300,400,700',
    ],

    // Set or update content security policies
    contentSecurityPolicy: {
      'font-src': "'self' fonts.gstatic.com",
      'style-src': "'self' fonts.googleapis.com"
    },


    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    'ember-simple-auth': {
      authorizer: 'authorizer:token'
    },

    torii: {
      providers: {
        'google-custom-code': {
          apiKey: '973762602332-2pdqd1b7d1ln8noil93hpkp9k4b332d5.apps.googleusercontent.com',
          scope: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/plus.me profile email'
        },
      }
    },

    APP: {
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
    ENV.API_HOST = (process.env.API_HOST || 'http://localhost:3000');

    ENV.torii.providers['google-custom-code'].redirectUri = 'http://localhost:3000/torii/redirect.html';

    ENV.APP.contentSecurityPolicy = {
      'connect-src': "'self' http://localhost:3000",
    };

    ENV['ember-simple-auth-token'] = {
      serverTokenEndpoint: 'http://localhost:3000/api/get-token',
      serverTokenRefreshEndpoint: 'http://localhost:3000/api/refresh-token',
      refreshAccessTokens: true,
      refreshLeeway: 60, // 1 minute
    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.API_HOST = '';
  }

  if (environment === 'production') {
    ENV.torii.providers['google-custom-code'].redirectUri = 'https://dashboard.michiganfyzical.com/torii/redirect.html';

    ENV.APP.contentSecurityPolicy = {
      'connect-src': "'self' https://dashboard.michiganfyzical.com",
    };

    ENV['ember-simple-auth-token'] = {
      serverTokenEndpoint: 'https://dashboard.michiganfyzical.com/api/get-token',
      serverTokenRefreshEndpoint: 'https://dashboard.michiganfyzical.com/api/refresh-token',
      refreshAccessTokens: true,
      refreshLeeway: 60, // 1 minute
    };

  }

  return ENV;
};
