"use strict";

exports.__esModule = true;
exports.default = void 0;

var _ExecutionEnvironment = require("fbjs/lib/ExecutionEnvironment");

var _StyleSheet = _interopRequireDefault(require("./StyleSheet"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// allow component styles to be editable in React Dev Tools
if (process.env.NODE_ENV !== 'production') {
  if (_ExecutionEnvironment.canUseDOM && window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.resolveRNStyle = _StyleSheet.default.flatten;
  }
}

var _default = _StyleSheet.default;
exports.default = _default;