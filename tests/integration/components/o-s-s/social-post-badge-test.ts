import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, setupOnerror } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | o-s-s/social-post-badge', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.postType = 'pin';
    this.plain = false;
    this.selected = false;
    this.onToggle = () => {
      this.plain = !this.plain;
      this.selected = !this.selected;
    };
  });

  test('it renders', async function (assert) {
    await render(
      hbs`<OSS::SocialPostBadge @postType={{this.postType}} @plain={{this.plain}} @selected={{this.selected}} @onToggle={{this.onToggle}}/>`
    );

    assert.dom('.oss-social-post-badge').exists();
  });

  module('@plain', () => {
    test('When @plain is not set class is not added', async function (assert) {
      await render(
        hbs`<OSS::SocialPostBadge @postType={{this.postType}} @selected={{this.selected}} @onToggle={{this.onToggle}}/>`
      );

      assert.dom('.oss-social-post-badge').hasNoClass('oss-social-post-badge--plain');
    });

    test('When @plain is true class is added', async function (assert) {
      this.plain = true;

      await render(
        hbs`<OSS::SocialPostBadge @postType={{this.postType}} @plain={{this.plain}} @selected={{this.selected}} @onToggle={{this.onToggle}}/>`
      );

      assert.dom('.oss-social-post-badge').hasClass('oss-social-post-badge--plain');
    });
  });

  module('@selected', () => {
    test('When @selected is not set class is not added', async function (assert) {
      await render(
        hbs`<OSS::SocialPostBadge @postType={{this.postType}} @plain={{this.plain}} @onToggle={{this.onToggle}}/>`
      );

      assert.dom('.oss-social-post-badge').hasNoClass('oss-social-post-badge--selected');
    });

    test('When @selected is true class is added', async function (assert) {
      this.selected = true;

      await render(
        hbs`<OSS::SocialPostBadge @postType={{this.postType}} @plain={{this.plain}} @selected={{this.selected}} @onToggle={{this.onToggle}}/>`
      );

      assert.dom('.oss-social-post-badge').hasClass('oss-social-post-badge--selected');
    });
  });

  module('When clicking on an item', () => {
    test('Then the @onToggle method is triggered', async function (assert) {
      this.postType = 'facebook_status';
      this.onToggle = sinon.spy();

      await render(
        hbs`<OSS::SocialPostBadge @postType={{this.postType}} @plain={{this.plain}} @selected={{this.selected}} @onToggle={{this.onToggle}}/>`
      );

      await click('.oss-social-post-badge');
      assert.ok(this.onToggle.calledWith('facebook_status'));
    });
  });

  module('error management', () => {
    test('it throws an error if @selectedToggle is not provided', async function (assert) {
      setupOnerror((err: any) => {
        assert.equal(
          err.message,
          'Assertion Failed: [component][OSS::SocialPostBadge] The @postType parameter of type String is mandatory'
        );
      });
      await render(
        hbs`<OSS::SocialPostBadge @plain={{this.plain}} @selected={{this.selected}} @onToggle={{this.onToggle}}/>`
      );
    });

    test('it throws an error if @postType is not a value of SocialPostType', async function (assert) {
      this.postType = 'toto';

      setupOnerror((err: any) => {
        assert.equal(
          err.message,
          'Assertion Failed: [component][OSS::SocialPostBadge] The @postType parameter should be a value of SocialPostType'
        );
      });
      await render(
        hbs`<OSS::SocialPostBadge @postType={{this.postType}} @plain={{this.plain}} @selected={{this.selected}} @onToggle={{this.onToggle}}/>`
      );
    });
  });
});
