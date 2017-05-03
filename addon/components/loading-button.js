import Ember from 'ember';

const { Component, RSVP } = Ember;

export default Component.extend({
  tagName: 'button',

  click(e) {
    e.preventDefault();

    // Because `.send` method for sending actions does not return anything, we
    // pass it an `RSVP.defer` to be resolved in the remote action.
    let defer = RSVP.defer();
    defer.promise.then( () => {
      this.$().text(this.get('originalContent'));
    }, () => {

    });

    Ember.run.debounce(this, function() {
      this.$().width(this.$().width());
      this.set('originalContent', this.$().html());
      this.$().html("<i class='fa fa-circle-o-notch fa-spin'></i>")

      this.get('targetObject').send(
        this.get('slowAction'),
        this.get('record'),
        defer
      );
    }, 100);
  }
});
