"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
function createStrictShapeTypeChecker(shapeTypes) {
  function checkType(isRequired, props, propName, componentName, location) {
    if (!props[propName]) {
      if (isRequired) {
        (0, _invariant.default)(false, "Required object `" + propName + "` was not specified in `" + componentName + "`.");
      }

      return;
    }

    var propValue = props[propName];
    var propType = typeof propValue;
    var locationName = location || '(unknown)';

    if (propType !== 'object') {
      (0, _invariant.default)(false, "Invalid " + locationName + " `" + propName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected `object`."));
    } // We need to check all keys in case some are required but missing from
    // props.


    var allKeys = (0, _extends2.default)({}, props[propName], shapeTypes);

    for (var _len = arguments.length, rest = new Array(_len > 5 ? _len - 5 : 0), _key = 5; _key < _len; _key++) {
      rest[_key - 5] = arguments[_key];
    }

    for (var _key2 in allKeys) {
      var checker = shapeTypes[_key2];

      if (!checker) {
        (0, _invariant.default)(false, "Invalid props." + propName + " key `" + _key2 + "` supplied to `" + componentName + "`." + '\nBad object: ' + JSON.stringify(props[propName], null, '  ') + '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  '));
      }

      var error = checker.apply(void 0, [propValue, _key2, componentName, location].concat(rest));

      if (error) {
        (0, _invariant.default)(false, error.message + '\nBad object: ' + JSON.stringify(props[propName], null, '  '));
      }
    }
  }

  function chainedCheckType(props, propName, componentName, location) {
    for (var _len2 = arguments.length, rest = new Array(_len2 > 4 ? _len2 - 4 : 0), _key3 = 4; _key3 < _len2; _key3++) {
      rest[_key3 - 4] = arguments[_key3];
    }

    return checkType.apply(void 0, [false, props, propName, componentName, location].concat(rest));
  }

  chainedCheckType.isRequired = checkType.bind(null, true);
  return chainedCheckType;
}

var _default = createStrictShapeTypeChecker;
exports.default = _default;