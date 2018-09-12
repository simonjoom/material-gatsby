"use strict";

exports.__esModule = true;

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Asset = {
  loadAsync: function loadAsync() {
    return _promise2.default.resolve();
  }
};

exports.default = Asset;