'use strict';

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var __DEV__ = process.env.NODE_ENV !== 'production';

function cloneReferencedElement(element, config) {
  var cloneRef = config.ref;
  var originalRef = element.ref;

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  if (originalRef == null || cloneRef == null) {
    return _react.default.cloneElement.apply(_react.default, [element, config].concat(children));
  }

  if (typeof originalRef !== 'function') {
    if (__DEV__) {
      console.warn('Cloning an element with a ref that will be overwritten because it ' + 'is not a function. Use a composable callback-style ref instead. ' + 'Ignoring ref: ' + originalRef);
    }

    return _react.default.cloneElement.apply(_react.default, [element, config].concat(children));
  }

  return _react.default.cloneElement.apply(_react.default, [element, _extends({}, config, {
    ref: function ref(component) {
      cloneRef(component);
      originalRef(component);
    }
  })].concat(children));
}

var _default = cloneReferencedElement;
exports.default = _default;