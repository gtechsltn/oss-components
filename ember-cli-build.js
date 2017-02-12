/*jshint node:true*/
/* global require, module */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    snippetPaths: ['tests/dummy/app/snippets'],
    lessOptions: {
      paths: [
        'bower_components/bootstrap/less',
        'bower_components/upfluence-oss/less',
      ]
    }
  });

  return app.toTree();
};
