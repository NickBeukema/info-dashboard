import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  classNames: ['calendar-list__item'],
  record: null,

  isFullDayEvent: Ember.computed.notEmpty('record.day'),

  momentStartDate: Ember.computed('record.startDate','record.day', function() {
    return moment(this.get('record.startDate') || this.get('record.day'));
  }),
  
  momentEndDate: Ember.computed('record.endDate', function() {
    return moment(this.get('record.endDate'));
  }),

  month: Ember.computed('momentStartDate', function() {
    return this.get('momentStartDate').format('MMM');
  }),

  day: Ember.computed('momentStartDate', function() {
    return this.get('momentStartDate').format('D');
  }),

  startTime: Ember.computed('isFullDayEvent', 'momentStartDate', function() {
    return this.get('isFullDayEvent') ? '' : this.get('momentStartDate').format('h:mma');
  }),

  endTime: Ember.computed('momentEndDate', function() {
    return this.get('momentEndDate').format('h:mma');
  })


});
