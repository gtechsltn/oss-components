/* global Countdown */
import Ember from 'ember';

const { Component, RSVP, TargetActionSupport } = Ember;

export default Component.extend(TargetActionSupport, {
  tagName: 'button',
  classNames: ['upf-btn', 'upf-btn--destructive'],

  clickedToDelete: false,
  actionFailed: false,

  click: function(e) {
    e.preventDefault();

    // Because `.send` method for sending actions does not return anything, we
    // pass it an `RSVP.defer` to be resolved in the remote action.
    let defer = RSVP.defer();
    defer.promise.then( () => {
      this.$().text(this.get('successMessage'));
    }, () => {
      this.set('clickedToDelete', false);
      this.set('actionFailed', true);
      this.$().html(
        `<i class='fa fa-refresh'></i> &nbsp; ${this.get('failureMessage')}`
      );
    });

    Ember.run.debounce(this, function() {
      if (this.get('clickedToDelete')) {
        this.set('clickedToDelete', false);
        this.set('actionFailed', false);
        this.get('countdown').abort();

        this.$().html(this.get('originalContent'));
      } else {
        this.set('clickedToDelete', true);
        this.set('originalContent', this.$().html());

        this.set('countdown', new Countdown(5, (seconds) => {
          this.$().text(`${this.get('ongoingMessage')} ( ${seconds} )...`);
        }, () => {
          this.triggerAction({
            action: this.get('destructiveAction'),
            actionContext: [this.get('record'), defer]
          });
        }));
      }
    }, 100);
  }
});
