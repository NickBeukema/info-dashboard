import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('calendar-display-listing', 'Integration | Component | calendar display listing', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{calendar-display-listing}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#calendar-display-listing}}
      template block text
    {{/calendar-display-listing}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
