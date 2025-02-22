import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, setupOnerror, typeIn, triggerKeyEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | o-s-s/email-input', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<OSS::EmailInput @value="" />`);
    assert.dom('.oss-input-container').exists();
  });

  test('it renders the @placeholder', async function (assert) {
    await render(hbs`<OSS::EmailInput @value="" @placeholder="test" />`);
    assert.dom('.oss-input-container input').hasProperty('placeholder', 'test');
  });

  test('it displays the error message when the @errorMessage is non-empty', async function (assert) {
    await render(hbs`<OSS::EmailInput @value="" @errorMessage="This is the error message" />`);
    assert.dom('.oss-input-container').hasClass('oss-input-container--errored');
    assert.dom('.text-color-error').hasText('This is the error message');
  });

  test('If the email regex isnt matched, then the error message is displayed', async function (assert) {
    this.value = '';
    await render(hbs`<OSS::EmailInput @value={{this.value}} />`);
    await typeIn('input', 'foo@f');
    assert.dom('.text-color-error').hasText('Please enter a valid email address.');
  });

  test('If the email regex is matched, and the @validates method is passed, then the status of the validation is returned', async function (assert) {
    this.value = 'john.doe@example.com';
    this.validates = (x: boolean) => {
      assert.equal(x, true);
    };
    await render(hbs`<OSS::EmailInput @value={{this.value}} @validates={{this.validates}} />`);
    await typeIn('input', 'a');
  });

  test('If the email regex isnt matched, and the @validates method is passed, then the status of the validation is returned', async function (assert) {
    this.value = 'foo@f';
    this.validates = (x: boolean) => {
      assert.equal(x, false);
    };
    await render(hbs`<OSS::EmailInput @value={{this.value}} @validates={{this.validates}} />`);
    await typeIn('input', 'a');
  });

  test('it throws an error when the @value parameter is missing', async function (assert) {
    setupOnerror((err: any) => {
      assert.equal(err.message, 'Assertion Failed: [component][OSS::EmailInput] The @value parameter is mandatory');
    });

    await render(hbs`<OSS::EmailInput />`);
  });

  module('for the @onChange method', (hooks) => {
    hooks.beforeEach(function () {
      this.value = '';
      this.onChange = sinon.stub();
    });

    test('it is called when a new character is typed', async function (assert) {
      await render(hbs`<OSS::EmailInput @value={{this.value}} @onChange={{this.onChange}} />`);
      await typeIn('input', 'a');
      assert.true(this.onChange.calledOnceWithExactly('a'));
    });

    test('it returns null value', async function (assert) {
      this.value = null;
      await render(hbs`<OSS::EmailInput @value={{this.value}} @onChange={{this.onChange}} />`);
      await triggerKeyEvent('input', 'keyup', 'Backspace');
      assert.true(this.onChange.calledOnceWithExactly(null));
    });

    test('if defined, it transforms the result to lowercase', async function (assert) {
      await render(hbs`<OSS::EmailInput @value={{this.value}} @onChange={{this.onChange}} />`);
      await typeIn('input', 'A');
      assert.true(this.onChange.calledOnceWithExactly('a'));
    });
  });
});
