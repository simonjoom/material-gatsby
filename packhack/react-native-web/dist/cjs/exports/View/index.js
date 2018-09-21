"use strict";

exports.__esModule = true;
exports.default = void 0;

var _applyLayout = _interopRequireDefault(require("../../modules/applyLayout"));

var _applyNativeMethods = _interopRequireDefault(require("../../modules/applyNativeMethods"));

var _propTypes = require("prop-types");

var _createElement = _interopRequireDefault(require("../createElement"));

var _filterSupportedProps = _interopRequireDefault(require("./filterSupportedProps"));

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

var _StyleSheet = _interopRequireDefault(require("../StyleSheet"));

var _ViewPropTypes = _interopRequireDefault(require("./ViewPropTypes"));

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var calculateHitSlopStyle = function calculateHitSlopStyle(hitSlop) {
  var hitStyle = {};

  for (var prop in hitSlop) {
    if (hitSlop.hasOwnProperty(prop)) {
      var value = hitSlop[prop];
      hitStyle[prop] = value > 0 ? -1 * value : 0;
    }
  }

  return hitStyle;
};

var View =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(View, _Component);

  function View() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = View.prototype;

  _proto.render = function render() {
    var hitSlop = this.props.hitSlop;
    var supportedProps = (0, _filterSupportedProps.default)(this.props);

    if (process.env.NODE_ENV !== 'production') {
      _react.default.Children.toArray(this.props.children).forEach(function (item) {
        (0, _invariant.default)(typeof item !== 'string', "Unexpected text node: " + item + ". A text node cannot be a child of a <View>.");
      });
    }

    var isInAParentText = this.context.isInAParentText;
    supportedProps.style = _StyleSheet.default.compose(styles.initial, _StyleSheet.default.compose(isInAParentText && styles.inline, this.props.style));

    if (hitSlop) {
      var hitSlopStyle = calculateHitSlopStyle(hitSlop);
      var hitSlopChild = (0, _createElement.default)('span', {
        style: [styles.hitSlop, hitSlopStyle]
      });
      supportedProps.children = _react.default.Children.toArray([hitSlopChild, supportedProps.children]);
    }

    return (0, _createElement.default)('div', supportedProps);
  };

  return View;
}(_react.Component);

View.displayName = 'View';
View.contextTypes = {
  isInAParentText: _propTypes.bool
};

var styles = _StyleSheet.default.create({
  // https://github.com/facebook/css-layout#default-values
  initial: {
    alignItems: 'stretch',
    borderWidth: 0,
    borderStyle: 'solid',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    margin: 0,
    padding: 0,
    position: 'relative',
    zIndex: 0,
    // fix flexbox bugs
    minHeight: 0,
    minWidth: 0
  },
  inline: {
    display: 'inline-flex'
  },
  // this zIndex-ordering positions the hitSlop above the View but behind
  // its children
  hitSlop: _extends({}, _StyleSheet.default.absoluteFillObject, {
    zIndex: -1
  })
});

var _default = (0, _applyLayout.default)((0, _applyNativeMethods.default)(View));

exports.default = _default;