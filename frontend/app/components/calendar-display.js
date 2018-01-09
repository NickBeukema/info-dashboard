import Ember from 'ember';

const refreshRate = 1000 * 60 * 15;

export default Ember.Component.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  calendarData: [],
  isLoading: false,

  isLoggedIn: Ember.computed.readOnly('session.isAuthenticated'),
  isChoosingCalendar: Ember.computed('calendarData.firstObject', function() {
    return this.get('calendarData.firstObject.type') === 'calendar';
  }),

  loginObserver: Ember.observer('isLoggedIn', function() {
    if(Ember.isEmpty(this.get('calendarData')) && this.get('isLoggedIn')) {
      this.refreshLoop();
    }
  }),

  didInsertElement() {
    if(this.get('isLoggedIn')) {
      this.refreshLoop();
    }
  },

  refreshLoop() {
    console.log("Refresh cal");
    this.set('isLooping', true);
    this.refreshCalendarData();

    Ember.run.later(() => {
      this.refreshLoop();
    }, refreshRate);
  },

  refreshCalendarData() {
    //this.get('store').unloadAll('calendar-record');
    Ember.run.next(() => {
      this.fetchCalendarRecords();
    });
  },

  fetchCalendarRecords() {
    this.set('isLoading', true);
    this.get('store').query('calendar-record', { limit: 3 }).then(records => {
      this.set('calendarData', records);
      this.set('isLoading', false);
    });
  },

  setCalendar(id) {
    this.get('store').createRecord('calendar-record', { title: id })
      .save()
      .then(() => this.refreshCalendarData());
  },

  actions: {
    openSettings() {
      this.setCalendar('');
    },
    resetCalendar() {
      this.setCalendar('');
    },
    chooseCalendar(cal) {
      this.setCalendar(cal.id);
    },
    refresh() {
      this.refreshCalendarData();
    }
  }
});
