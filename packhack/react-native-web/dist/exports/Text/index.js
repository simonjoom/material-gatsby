function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * Copyright (c) 2015-present, Nicolas Gallagher.
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
import applyLayout from '../../modules/applyLayout';
import applyNativeMethods from '../../modules/applyNativeMethods';
import { bool } from 'prop-types';
import { Component } from 'react';
import createElement from '../createElement';
import StyleSheet from '../StyleSheet';
import TextPropTypes from './TextPropTypes';

var Text =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(Text, _Component);

  function Text() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = Text.prototype;

  _proto.getChildContext = function getChildContext() {
    return {
      isInAParentText: true
    };
  };

  _proto.render = function render() {
    var _this$props = this.props,
        dir = _this$props.dir,
        numberOfLines = _this$props.numberOfLines,
        onPress = _this$props.onPress,
        selectable = _this$props.selectable,
        style = _this$props.style,
        adjustsFontSizeToFit = _this$props.adjustsFontSizeToFit,
        allowFontScaling = _this$props.allowFontScaling,
        ellipsizeMode = _this$props.ellipsizeMode,
        lineBreakMode = _this$props.lineBreakMode,
        minimumFontScale = _this$props.minimumFontScale,
        onLayout = _this$props.onLayout,
        onLongPress = _this$props.onLongPress,
        pressRetentionOffset = _this$props.pressRetentionOffset,
        selectionColor = _this$props.selectionColor,
        suppressHighlighting = _this$props.suppressHighlighting,
        textBreakStrategy = _this$props.textBreakStrategy,
        tvParallaxProperties = _this$props.tvParallaxProperties,
        otherProps = _objectWithoutPropertiesLoose(_this$props, ["dir", "numberOfLines", "onPress", "selectable", "style", "adjustsFontSizeToFit", "allowFontScaling", "ellipsizeMode", "lineBreakMode", "minimumFontScale", "onLayout", "onLongPress", "pressRetentionOffset", "selectionColor", "suppressHighlighting", "textBreakStrategy", "tvParallaxProperties"]);

    var isInAParentText = this.context.isInAParentText;

    if (onPress) {
      otherProps.accessible = true;
      otherProps.onClick = this._createPressHandler(onPress);
      otherProps.onKeyDown = this._createEnterHandler(onPress);
    } // allow browsers to automatically infer the language writing direction


    otherProps.dir = dir !== undefined ? dir : 'auto';
    otherProps.style = [styles.initial, this.context.isInAParentText === true && styles.isInAParentText, style, selectable === false && styles.notSelectable, numberOfLines === 1 && styles.singleLineStyle, onPress && styles.pressable];
    var component = isInAParentText ? 'span' : 'div';
    return createElement(component, otherProps);
  };

  _proto._createEnterHandler = function _createEnterHandler(fn) {
    return function (e) {
      if (e.keyCode === 13) {
        fn && fn(e);
      }
    };
  };

  _proto._createPressHandler = function _createPressHandler(fn) {
    return function (e) {
      e.stopPropagation();
      fn && fn(e);
    };
  };

  return Text;
}(Component);

Text.displayName = 'Text';
Text.childContextTypes = {
  isInAParentText: bool
};
Text.contextTypes = {
  isInAParentText: bool
};
var styles = StyleSheet.create({
  initial: {
    borderWidth: 0,
    boxSizing: 'border-box',
    color: 'inherit',
    display: 'inline',
    fontFamily: 'System',
    fontSize: 14,
    fontStyle: 'inherit',
    fontVariant: ['inherit'],
    fontWeight: 'inherit',
    lineHeight: 'inherit',
    margin: 0,
    padding: 0,
    textDecorationLine: 'none',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word'
  },
  isInAParentText: {
    // inherit parent font styles
    fontFamily: 'inherit',
    fontSize: 'inherit',
    whiteSpace: 'inherit'
  },
  notSelectable: {
    userSelect: 'none'
  },
  pressable: {
    cursor: 'pointer'
  },
  singleLineStyle: {
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
});
export default applyLayout(applyNativeMethods(Text));