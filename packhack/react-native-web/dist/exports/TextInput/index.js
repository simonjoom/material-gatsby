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
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import { Component } from 'react';
import ColorPropType from '../ColorPropType';
import createElement from '../createElement';
import findNodeHandle from '../findNodeHandle';
import StyleSheet from '../StyleSheet';
import StyleSheetPropType from '../../modules/StyleSheetPropType';
import TextInputStylePropTypes from './TextInputStylePropTypes';
import TextInputState from '../../modules/TextInputState';
import ViewPropTypes from '../ViewPropTypes';
import { any, bool, func, number, oneOf, shape, string } from 'prop-types';
var isAndroid = canUseDOM && /Android/i.test(navigator && navigator.userAgent);
var emptyObject = {};
/**
 * React Native events differ from W3C events.
 */

var normalizeEventHandler = function normalizeEventHandler(handler) {
  return function (e) {
    if (handler) {
      e.nativeEvent.text = e.target.value;
      return handler(e);
    }
  };
};
/**
 * Determines whether a 'selection' prop differs from a node's existing
 * selection state.
 */


var isSelectionStale = function isSelectionStale(node, selection) {
  if (node && selection) {
    var selectionEnd = node.selectionEnd,
        selectionStart = node.selectionStart;
    var start = selection.start,
        end = selection.end;
    return start !== selectionStart || end !== selectionEnd;
  }

  return false;
};
/**
 * Certain input types do no support 'selectSelectionRange' and will throw an
 * error.
 */


var setSelection = function setSelection(node, selection) {
  try {
    if (isSelectionStale(node, selection)) {
      var start = selection.start,
          end = selection.end; // workaround for Blink on Android: see https://github.com/text-mask/text-mask/issues/300

      if (isAndroid) {
        setTimeout(function () {
          return node.setSelectionRange(start, end || start);
        }, 10);
      } else {
        node.setSelectionRange(start, end || start);
      }
    }
  } catch (e) {}
};

var TextInput =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(TextInput, _Component);

  function TextInput() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;

    _this._handleBlur = function (e) {
      var onBlur = _this.props.onBlur;
      TextInputState._currentlyFocusedNode = null;

      if (onBlur) {
        onBlur(e);
      }
    };

    _this._handleChange = function (e) {
      var _this$props = _this.props,
          onChange = _this$props.onChange,
          onChangeText = _this$props.onChangeText;
      var text = e.nativeEvent.text;

      if (onChange) {
        onChange(e);
      }

      if (onChangeText) {
        onChangeText(text);
      }

      _this._handleSelectionChange(e);
    };

    _this._handleFocus = function (e) {
      var _this$props2 = _this.props,
          clearTextOnFocus = _this$props2.clearTextOnFocus,
          onFocus = _this$props2.onFocus,
          selectTextOnFocus = _this$props2.selectTextOnFocus;
      var node = _this._node;
      TextInputState._currentlyFocusedNode = _this._node;

      if (onFocus) {
        onFocus(e);
      }

      if (clearTextOnFocus) {
        _this.clear();
      }

      if (selectTextOnFocus) {
        node && node.select();
      }
    };

    _this._handleKeyDown = function (e) {
      // Prevent key events bubbling (see #612)
      e.stopPropagation(); // Backspace, Tab, Cmd+Enter, and Arrow keys only fire 'keydown' DOM events

      if (e.which === 8 || e.which === 9 || e.which === 13 && e.metaKey || e.which === 37 || e.which === 38 || e.which === 39 || e.which === 40) {
        _this._handleKeyPress(e);
      }
    };

    _this._handleKeyPress = function (e) {
      var _this$props3 = _this.props,
          blurOnSubmit = _this$props3.blurOnSubmit,
          multiline = _this$props3.multiline,
          onKeyPress = _this$props3.onKeyPress,
          onSubmitEditing = _this$props3.onSubmitEditing;
      var blurOnSubmitDefault = !multiline;
      var shouldBlurOnSubmit = blurOnSubmit == null ? blurOnSubmitDefault : blurOnSubmit;

      if (onKeyPress) {
        var keyValue;

        switch (e.which) {
          case 8:
            keyValue = 'Backspace';
            break;

          case 9:
            keyValue = 'Tab';
            break;

          case 13:
            keyValue = 'Enter';
            break;

          case 32:
            keyValue = ' ';
            break;

          case 37:
            keyValue = 'ArrowLeft';
            break;

          case 38:
            keyValue = 'ArrowUp';
            break;

          case 39:
            keyValue = 'ArrowRight';
            break;

          case 40:
            keyValue = 'ArrowDown';
            break;

          default:
            {
              // Trim to only care about the keys that have a textual representation
              if (e.shiftKey) {
                keyValue = String.fromCharCode(e.which).trim();
              } else {
                keyValue = String.fromCharCode(e.which).toLowerCase().trim();
              }
            }
        }

        if (keyValue) {
          e.nativeEvent = {
            altKey: e.altKey,
            ctrlKey: e.ctrlKey,
            key: keyValue,
            metaKey: e.metaKey,
            shiftKey: e.shiftKey,
            target: e.target
          };
          onKeyPress(e);
        }
      }

      if (!e.isDefaultPrevented() && e.which === 13 && !e.shiftKey) {
        if ((blurOnSubmit || !multiline) && onSubmitEditing) {
          // prevent "Enter" from inserting a newline
          e.preventDefault();
          e.nativeEvent = {
            target: e.target,
            text: e.target.value
          };
          onSubmitEditing(e);
        }

        if (shouldBlurOnSubmit) {
          _this.blur();
        }
      }
    };

    _this._handleSelectionChange = function (e) {
      var _this$props4 = _this.props,
          onSelectionChange = _this$props4.onSelectionChange,
          _this$props4$selectio = _this$props4.selection,
          selection = _this$props4$selectio === void 0 ? emptyObject : _this$props4$selectio;

      if (onSelectionChange) {
        try {
          var node = e.target;

          if (isSelectionStale(node, selection)) {
            var selectionStart = node.selectionStart,
                selectionEnd = node.selectionEnd;
            e.nativeEvent.selection = {
              start: selectionStart,
              end: selectionEnd
            };
            onSelectionChange(e);
          }
        } catch (e) {}
      }
    };

    _this._setNode = function (component) {
      _this._node = findNodeHandle(component);
    };

    return _this;
  }

  var _proto = TextInput.prototype;

  _proto.clear = function clear() {
    this._node.value = '';
  };

  _proto.isFocused = function isFocused() {
    return TextInputState.currentlyFocusedField() === this._node;
  };

  _proto.componentDidMount = function componentDidMount() {
    setSelection(this._node, this.props.selection);

    if (document.activeElement === this._node) {
      TextInputState._currentlyFocusedNode = this._node;
    }
  };

  _proto.componentDidUpdate = function componentDidUpdate() {
    setSelection(this._node, this.props.selection);
  };

  _proto.render = function render() {
    var _this$props5 = this.props,
        autoCorrect = _this$props5.autoCorrect,
        editable = _this$props5.editable,
        inputAccessoryViewID = _this$props5.inputAccessoryViewID,
        keyboardType = _this$props5.keyboardType,
        multiline = _this$props5.multiline,
        numberOfLines = _this$props5.numberOfLines,
        secureTextEntry = _this$props5.secureTextEntry,
        style = _this$props5.style,
        blurOnSubmit = _this$props5.blurOnSubmit,
        clearTextOnFocus = _this$props5.clearTextOnFocus,
        onChangeText = _this$props5.onChangeText,
        onLayout = _this$props5.onLayout,
        onSelectionChange = _this$props5.onSelectionChange,
        onSubmitEditing = _this$props5.onSubmitEditing,
        selection = _this$props5.selection,
        selectTextOnFocus = _this$props5.selectTextOnFocus,
        spellCheck = _this$props5.spellCheck,
        caretHidden = _this$props5.caretHidden,
        clearButtonMode = _this$props5.clearButtonMode,
        dataDetectorTypes = _this$props5.dataDetectorTypes,
        disableFullscreenUI = _this$props5.disableFullscreenUI,
        enablesReturnKeyAutomatically = _this$props5.enablesReturnKeyAutomatically,
        inlineImageLeft = _this$props5.inlineImageLeft,
        inlineImagePadding = _this$props5.inlineImagePadding,
        keyboardAppearance = _this$props5.keyboardAppearance,
        onContentSizeChange = _this$props5.onContentSizeChange,
        onEndEditing = _this$props5.onEndEditing,
        onScroll = _this$props5.onScroll,
        returnKeyLabel = _this$props5.returnKeyLabel,
        returnKeyType = _this$props5.returnKeyType,
        selectionColor = _this$props5.selectionColor,
        selectionState = _this$props5.selectionState,
        textBreakStrategy = _this$props5.textBreakStrategy,
        underlineColorAndroid = _this$props5.underlineColorAndroid,
        otherProps = _objectWithoutPropertiesLoose(_this$props5, ["autoCorrect", "editable", "inputAccessoryViewID", "keyboardType", "multiline", "numberOfLines", "secureTextEntry", "style", "blurOnSubmit", "clearTextOnFocus", "onChangeText", "onLayout", "onSelectionChange", "onSubmitEditing", "selection", "selectTextOnFocus", "spellCheck", "caretHidden", "clearButtonMode", "dataDetectorTypes", "disableFullscreenUI", "enablesReturnKeyAutomatically", "inlineImageLeft", "inlineImagePadding", "keyboardAppearance", "onContentSizeChange", "onEndEditing", "onScroll", "returnKeyLabel", "returnKeyType", "selectionColor", "selectionState", "textBreakStrategy", "underlineColorAndroid"]);

    var type;

    switch (keyboardType) {
      case 'email-address':
        type = 'email';
        break;

      case 'number-pad':
      case 'numeric':
        type = 'number';
        break;

      case 'phone-pad':
        type = 'tel';
        break;

      case 'search':
      case 'web-search':
        type = 'search';
        break;

      case 'url':
        type = 'url';
        break;

      default:
        type = 'text';
    }

    if (secureTextEntry) {
      type = 'password';
    }

    var component = multiline ? 'textarea' : 'input';
    Object.assign(otherProps, {
      autoCorrect: autoCorrect ? 'on' : 'off',
      dir: 'auto',
      onBlur: normalizeEventHandler(this._handleBlur),
      onChange: normalizeEventHandler(this._handleChange),
      onFocus: normalizeEventHandler(this._handleFocus),
      onKeyDown: this._handleKeyDown,
      onKeyPress: this._handleKeyPress,
      onSelect: normalizeEventHandler(this._handleSelectionChange),
      readOnly: !editable,
      ref: this._setNode,
      spellCheck: spellCheck != null ? spellCheck : autoCorrect,
      style: [styles.initial, style]
    });

    if (multiline) {
      otherProps.rows = numberOfLines;
    } else {
      otherProps.type = type;
    }

    return createElement(component, otherProps);
  };

  return TextInput;
}(Component);

TextInput.displayName = 'TextInput';
TextInput.defaultProps = {
  autoCapitalize: 'sentences',
  autoComplete: 'on',
  autoCorrect: true,
  editable: true,
  keyboardType: 'default',
  multiline: false,
  numberOfLines: 1,
  secureTextEntry: false,
  style: emptyObject
};
TextInput.State = TextInputState;
var styles = StyleSheet.create({
  initial: {
    MozAppearance: 'textfield',
    WebkitAppearance: 'none',
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderRadius: 0,
    borderStyle: 'solid',
    borderWidth: 0,
    boxSizing: 'border-box',
    fontFamily: 'System',
    fontSize: 14,
    padding: 0,
    resize: 'none'
  }
});
export default applyLayout(applyNativeMethods(TextInput));