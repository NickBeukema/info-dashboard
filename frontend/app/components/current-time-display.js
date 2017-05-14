import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({

  nextTick: null,
  value: 0,

  didInsertElement() {
    this.tick();
  },

  currentTime: Ember.computed('value', function(){
    return moment().format("h:mm A");
  }),

  tick() {
    let nextTick = Ember.run.later(() => {
      this.notifyPropertyChange('value');
      this.tick();
    }, 1000);

    this.set('nextTick', nextTick);
  },

  willDestroyElement() {
    Ember.run.cancel(this.get('nextTick'));
  }
});
