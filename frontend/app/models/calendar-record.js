import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  title: DS.attr(),
  startDate: DS.attr(),
  endDate: DS.attr(),
  day: DS.attr(),
  type: DS.attr()
});
