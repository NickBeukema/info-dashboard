import DS from 'ember-data';

export default DS.Model.extend({
  currentSummary: DS.attr(),
  currentTemperature: DS.attr(),

  currentRoundedTemperature: Ember.computed('currentTemperature', function(){
    return Math.round(this.get('currentTemperature'));
  }),

  hourlySummary: DS.attr(),
  hourlyData: DS.attr(),

  dailySummary: DS.attr(),
  dailyData: DS.attr(),
});
