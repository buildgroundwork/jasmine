const jasmineGlobal = (function(root) {
  'use strict';

  if (typeof module !== 'undefined' && module.exports && typeof exports !== 'undefined') {
    if (typeof global !== 'undefined') {
      module.exports = { jasmineGlobal: global, jasmineRequire: {} };
    } else {
      module.exports = { jasmineGlobal: root, jasmineRequire: {} };
    }
  } else if (typeof window !== 'undefined') {
    window.jasmineRequire = {};
    return window;
  } else {
    root.jasmineRequire = {};
    return root;
  }
})(this);

