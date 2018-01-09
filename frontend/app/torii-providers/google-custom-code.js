import OAuth2Code from 'torii/providers/oauth2-code';
import {configurable} from 'torii/configuration';
import Ember from 'ember';

var GoogleCustomCode = OAuth2Code.extend({

  name:    'google-custom-code',
  baseUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenValidationUrl: 'https://www.googleapis.com/oauth2/v2/tokeninfo',

  // additional parameters that this provider requires
  optionalUrlParams: ['scope', 'request_visible_actions', 'access_type', 'prompt'],

  // a scope MUST be given (no default value because there are so many possible
  // at Google)
  scope: configurable('scope'),

  requestVisibleActions: configurable('requestVisibleActions', ''),

  responseType: 'code',

  accessType: 'offline',
  prompt: 'consent',

  responseParams: ['code'],
  redirectUri: configurable('redirectUri'),

  /**
   * @method open
   * @return {Promise<object>} If the authorization attempt is a success,
   * the promise will resolve an object containing the following keys:
   *   - authorizationToken: The `token` from the 3rd-party provider
   *   - provider: The name of the provider (i.e., google-oauth2)
   *   - redirectUri: The redirect uri (some server-side exchange flows require this)
   * If there was an error or the user either canceled the authorization or
   * closed the popup window, the promise rejects.
   */
  open: function(options){

    console.log(this.get('popup'));

    var name        = this.get('name'),
        url         = this.buildUrl(),
        redirectUri = this.get('redirectUri'),
        responseParams = this.get('responseParams'),
        tokenValidationUrl = this.get('tokenValidationUrl'),
        clientId = this.get('apiKey');

    return this.get('popup').open(url, responseParams, options).then(function(authData){
      var missingResponseParams = [];

      responseParams.forEach(function(param){
        if (authData[param] === undefined) {
          missingResponseParams.push(param);
        }
      });

      if (missingResponseParams.length){
        throw new Error("The response from the provider is missing " +
              "these required response params: " +
              missingResponseParams.join(', '));
      }

      /* at this point 'authData' should look like:
      {
        access_token: '<some long acces token string>',
        expires_in: '<time in s, was '3600' in jan 2017>',
        token_type: 'Bearer'
      }
      */

      console.log("Trigger refresh")
      return new Ember.RSVP.Promise( function (resolve, reject) {
        resolve(Object.assign(authData,
          {
            provider: name,
            redirectUri: redirectUri
          }
        ));
      }).then( function (authenticationData) {
        return authenticationData;
      });
    });
  },

  fetch: function (authenticationData) {
    // this is the most basic for ember-simple-auth to work with this provider,
    // but the session could actually be checked and renewed here if the token
    // is too old.
    return authenticationData;
  }
});

export default GoogleCustomCode;
