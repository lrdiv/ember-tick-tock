/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-tick-tock',
  included: function(app) {
    this._super.included(app);
    app.import(app.bowerDirectory + '/moment/min/moment.min.js');
  }
};
