import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, setupOnerror } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | o-s-s/badge', function (hooks) {
  setupRenderingTest(hooks);

  test('it throws an error if no argument is passed', async function (assert: Assert) {
    setupOnerror((err: Error) => {
      assert.equal(
        err.message,
        '[component][OSS::Badge] One of @icon, @image or @text arguments is mandatory. You passed 0 arguments'
      );
    });

    await render(hbs`<OSS::Badge />`);
  });

  test('it throws an error if more than one content argument is passed', async function (assert: Assert) {
    setupOnerror((err: Error) => {
      assert.equal(
        err.message,
        '[component][OSS::Badge] One of @icon, @image or @text arguments is mandatory. You passed 2 arguments'
      );
    });

    await render(hbs`<OSS::Badge @icon="fas fa-users" @text="2x" />`);
  });

  module('sizes', function () {
    test('it throws an error when an unsupported size is passed', async function (assert: Assert) {
      setupOnerror((err: Error) => {
        assert.equal(err.message, '[component][OSS::Badge] Unknown size. Available sizes are: sm, md, lg');
      });

      await render(hbs`<OSS::Badge @size="foo" @text="2x" />`);
    });

    test('it sets the right class when usng a supported size', async function (assert: Assert) {
      await render(hbs`<OSS::Badge @size="lg" @text="2x" />`);

      assert.dom('.upf-badge').exists();
      assert.dom('.upf-badge').hasClass('upf-badge--size-lg');
    });

    test('it defaults to md size if none is passed', async function (assert: Assert) {
      await render(hbs`<OSS::Badge @text="2x" />`);

      assert.dom('.upf-badge').exists();
      assert.dom('.upf-badge').hasClass('upf-badge--size-md');
    });
  });

  module('content args', function () {
    test('it displays the right icon when using the @icon arg', async function (assert: Assert) {
      await render(hbs`<OSS::Badge @icon="fas fa-users" />`);

      assert.dom('.upf-badge').exists();
      assert.dom('.upf-badge i').hasAttribute('class', 'fas fa-users text-color-bright-purple');
    });

    test('it displays the right text when using the @text arg', async function (assert: Assert) {
      await render(hbs`<OSS::Badge @text="2x" />`);

      assert.dom('.upf-badge').exists();
      assert.dom('.upf-badge .upf-badge__text').exists();
      assert.dom('.upf-badge .upf-badge__text').hasText('2x');
    });

    test('it displays the right image when using the @image arg', async function (assert: Assert) {
      await render(hbs`<OSS::Badge @image="http://foo.co/bar.png" />`);

      assert.dom('.upf-badge').exists();
      assert.dom('.upf-badge img').exists();
      assert.dom('.upf-badge img').hasAttribute('src', 'http://foo.co/bar.png')
    });
  });
});
