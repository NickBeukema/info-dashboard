import Ember from 'ember';
import moment from 'moment';

let ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

export default Ember.Component.extend({
  store: Ember.inject.service(),

  weatherPromise: null,
  weatherData: null,
  coordinates: null,

  refreshRate: 1000 * 60 * 5,

  hourlyData: Ember.computed.readOnly('weatherData.hourlyData'),

  hourlyDataDisplay: Ember.computed('hourlyData.[]', function(){
    let hourlyData = this.get('hourlyData');
    if(Ember.isEmpty(hourlyData)) { return []; }

    return hourlyData.filter((hour, idx) => {
      return idx % 2 == 0;
    }).slice(0,5).map(hour => {
      return {
        temperature: Math.round(hour.temperature),
        time: moment(hour.time * 1000).format("ha"),
        icon: hour.icon
      };
    });
  }),

  dailyData: Ember.computed.readOnly('weatherData.dailyData'),

  dailyDataDisplay: Ember.computed('dailyData.[]', function(){
    let dailyData = this.get('dailyData');
    if(Ember.isEmpty(dailyData)) { return []; }

    return dailyData.slice(0,3).map(day => {
      return {
        temperatureMin: Math.round(day.temperatureMin),
        temperatureMax: Math.round(day.temperatureMax),
        summary: day.summary,
        icon: day.icon,
        day: moment(day.time * 1000).format('dddd')
      };

    });
  }),

  didInsertElement() {
    navigator.geolocation.getCurrentPosition(position => {
      this.set('coordinates', position.coords);
      this.set('isWaitingForGeolocation', false);
      this.loadWeather(this.get('coordinates'));
      this.refreshLoop();
    });
  },

  refreshLoop() {
    Ember.run.later(() => {
      this.loadWeather(this.get('coordinates'));
      this.refreshLoop();
    }, this.get('refreshRate'));
  },

  loadWeather(coords) {
    if(Ember.isEmpty(this.get('weatherPromise'))) {
      let weatherPromise = this.fetchWeather(coords.latitude, coords.longitude);

      let promise = Ember.RSVP.hash({ weatherRecords: weatherPromise });
      let proxy = ObjectPromiseProxy.create({ promise: promise });
      this.set('weatherPromise', proxy);
    } else {
      this.fetchWeather(coords.latitude, coords.longitude);
    }
  },

  fetchWeather(lat, long) {
    return this.get('store').query('weather-record', { lat: lat, long: long }).then(
        weatherRecords => this.set('weatherData', weatherRecords.get('firstObject')));
  },

  isLoading: Ember.computed.or('isLoadingWeather', 'isWaitingForGeolocation'),
  isWaitingForGeolocation: true,
  isLoadingWeather: Ember.computed.readOnly('weatherPromise.isPending'),
  finishedLoadingWeather: Ember.computed.readOnly('weatherPromise.isSettled'),

});
