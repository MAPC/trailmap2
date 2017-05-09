import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('filters', { path: '/map' });
  this.route('desktop');
  this.route('mobile');
});

Router.reopen({
    notifyGoogleAnalytics: function() {
        if (typeof ga != 'function') { return; }
        return ga('send', 'pageview', {
          'page': this.get('url'),
          'title': this.get('url')
        });
    }.on('didTransition')
});

export default Router;
