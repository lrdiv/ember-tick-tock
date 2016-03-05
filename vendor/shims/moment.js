(function() {
  function vendorModule() {
    'use strict';

    return { 'default': self['moment'] };
  }

  define('moment', [], vendorModule);
})();
