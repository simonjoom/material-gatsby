function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * Copyright (c) 2017-present, Nicolas Gallagher.
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
import View from '../View';
import { number, oneOf } from 'prop-types';
import React, { Component } from 'react';
import ViewPropTypes from '../ViewPropTypes';

var KeyboardAvoidingView =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(KeyboardAvoidingView, _Component);

  function KeyboardAvoidingView() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this.frame = null;

    _this.onLayout = function (event) {
      _this.frame = event.nativeEvent.layout;
    };

    return _this;
  }

  var _proto = KeyboardAvoidingView.prototype;

  _proto.relativeKeyboardHeight = function relativeKeyboardHeight(keyboardFrame) {
    var frame = this.frame;

    if (!frame || !keyboardFrame) {
      return 0;
    }

    var keyboardY = keyboardFrame.screenY - this.props.keyboardVerticalOffset;
    return Math.max(frame.y + frame.height - keyboardY, 0);
  };

  _proto.onKeyboardChange = function onKeyboardChange(event) {};

  _proto.render = function render() {
    var _this$props = this.props,
        behavior = _this$props.behavior,
        contentContainerStyle = _this$props.contentContainerStyle,
        keyboardVerticalOffset = _this$props.keyboardVerticalOffset,
        rest = _objectWithoutPropertiesLoose(_this$props, ["behavior", "contentContainerStyle", "keyboardVerticalOffset"]);

    return React.createElement(View, _extends({
      onLayout: this.onLayout
    }, rest));
  };

  return KeyboardAvoidingView;
}(Component);

KeyboardAvoidingView.defaultProps = {
  keyboardVerticalOffset: 0
};
export default KeyboardAvoidingView;