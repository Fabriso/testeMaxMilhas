(function() {
  'use strict';

  angular
    .module('testmax')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
