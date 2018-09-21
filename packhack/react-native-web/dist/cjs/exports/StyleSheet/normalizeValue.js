"use strict";

exports.__esModule = true;
exports.default = void 0;

var _unitlessNumbers = _interopRequireDefault(require("../../modules/unitlessNumbers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) 2016-present, Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */
var normalizeValue = function normalizeValue(property, value) {
  if (!_unitlessNumbers.default[property] && typeof value === 'number') {
    value = value + "px";
  }

  return value;
};

var _default = normalizeValue;
exports.default = _default;