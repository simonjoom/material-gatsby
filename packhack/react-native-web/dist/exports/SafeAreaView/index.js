function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
import React from 'react';
import StyleSheet from '../StyleSheet';
import View from '../View';
import ViewPropTypes from '../ViewPropTypes';

var SafeAreaView =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(SafeAreaView, _React$Component);

  function SafeAreaView() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = SafeAreaView.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        style = _this$props.style,
        rest = _objectWithoutPropertiesLoose(_this$props, ["style"]);

    return React.createElement(View, _extends({}, rest, {
      style: StyleSheet.compose(styles.root, style)
    }));
  };

  return SafeAreaView;
}(React.Component);

SafeAreaView.displayName = 'SafeAreaView';
var styles = StyleSheet.create({
  root: {
    paddingTop: 'env(safe-area-inset-top)',
    paddingRight: 'env(safe-area-inset-right)',
    paddingBottom: 'env(safe-area-inset-bottom)',
    paddingLeft: 'env(safe-area-inset-left)'
  }
});
export default SafeAreaView;