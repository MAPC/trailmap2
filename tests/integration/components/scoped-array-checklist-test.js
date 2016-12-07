import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('scoped-array-checklist', 'Integration | Component | scoped array checklist', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{scoped-array-checklist}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#scoped-array-checklist}}
      template block text
    {{/scoped-array-checklist}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
