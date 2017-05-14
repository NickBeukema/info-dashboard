import Ember from 'ember';

export default Ember.Component.extend({
  size: 20,
  width: Ember.computed.readOnly('size'),
  height: Ember.computed.readOnly('size'),

  attributeBindings: ['width', 'height'],
  tagName: 'canvas',
  icon: 'rain',

  didInsertElement() {
    let skycon = new Skycons();
    skycon.add(this.get('elementId'), this.get('icon'));
    skycon.play();
  }
});
