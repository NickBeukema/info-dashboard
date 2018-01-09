import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  session: Ember.inject.service('session'),

  actions: {
    sessionRequiresAuthentication: function() {
      let session = this.get('session');

      this.get('torii')
        .open('google-custom-code')
        .then(function(googleAuth) {
          console.log("AUTH", googleAuth);
          var code = googleAuth.code;
          //console.log('Google authentication successful.');

          session
            .authenticate('authenticator:jwt', { password: code })
            .then(function(){
              //console.log('custom token authentication successful!');
            }, function (/*error*/) {
              //console.log('custom token authentication failed!', error);
            });
        }, function(/*error*/) {
          //console.error('Google auth failed: ', error.message);
        })
    },

    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
