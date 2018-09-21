"use strict";

exports.__esModule = true;
exports.default = void 0;

var _applyNativeMethods = _interopRequireDefault(require("../../modules/applyNativeMethods"));

var _react = require("react");

var _createElement = _interopRequireDefault(require("../createElement"));

var _PickerItem = _interopRequireDefault(require("./PickerItem"));

var _PickerItemPropType = _interopRequireDefault(require("./PickerItemPropType"));

var _PickerStylePropTypes = _interopRequireDefault(require("./PickerStylePropTypes"));

var _StyleSheetPropType = _interopRequireDefault(require("../../modules/StyleSheetPropType"));

var _StyleSheet = _interopRequireDefault(require("../StyleSheet"));

var _TextPropTypes = _interopRequireDefault(require("../Text/TextPropTypes"));

var _propTypes = require("prop-types");

var _ViewPropTypes = _interopRequireDefault(require("../ViewPropTypes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var pickerStyleType = (0, _StyleSheetPropType.default)(_PickerStylePropTypes.default);

var Picker =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(Picker, _Component);

  function Picker() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;

    _this._handleChange = function (e) {
      var onValueChange = _this.props.onValueChange;
      var _e$target = e.target,
          selectedIndex = _e$target.selectedIndex,
          value = _e$target.value;

      if (onValueChange) {
        onValueChange(value, selectedIndex);
      }
    };

    return _this;
  }

  var _proto = Picker.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        children = _this$props.children,
        enabled = _this$props.enabled,
        selectedValue = _this$props.selectedValue,
        style = _this$props.style,
        testID = _this$props.testID,
        itemStyle = _this$props.itemStyle,
        mode = _this$props.mode,
        prompt = _this$props.prompt,
        otherProps = _objectWithoutPropertiesLoose(_this$props, ["children", "enabled", "selectedValue", "style", "testID", "itemStyle", "mode", "prompt"]);

    return (0, _createElement.default)('select', _extends({
      children: children,
      disabled: enabled === false ? true : undefined,
      onChange: this._handleChange,
      style: [styles.initial, style],
      testID: testID,
      value: selectedValue
    }, otherProps));
  };

  return Picker;
}(_react.Component);

Picker.Item = _PickerItem.default;

var styles = _StyleSheet.default.create({
  initial: {
    fontFamily: 'System',
    fontSize: 'inherit',
    margin: 0
  }
});

var _default = (0, _applyNativeMethods.default)(Picker);

exports.default = _default;