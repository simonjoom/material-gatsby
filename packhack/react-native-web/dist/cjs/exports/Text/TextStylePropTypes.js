"use strict";

exports.__esModule = true;
exports.default = void 0;

var _ColorPropType = _interopRequireDefault(require("../ColorPropType"));

var _ViewStylePropTypes = _interopRequireDefault(require("../View/ViewStylePropTypes"));

var _propTypes = require("prop-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var numberOrString = (0, _propTypes.oneOfType)([_propTypes.number, _propTypes.string]);

var TextStylePropTypes = _extends({}, _ViewStylePropTypes.default, {
  color: _ColorPropType.default,
  fontFamily: _propTypes.string,
  fontFeatureSettings: _propTypes.string,
  fontSize: numberOrString,
  fontStyle: _propTypes.string,
  fontWeight: _propTypes.string,
  fontVariant: _propTypes.array,
  letterSpacing: numberOrString,
  lineHeight: numberOrString,
  textAlign: (0, _propTypes.oneOf)(['center', 'end', 'inherit', 'justify', 'justify-all', 'left', 'right', 'start']),
  textAlignVertical: _propTypes.string,
  textDecorationColor: _ColorPropType.default,
  textDecorationLine: _propTypes.string,
  textDecorationStyle: _propTypes.string,
  textShadowColor: _ColorPropType.default,
  textShadowOffset: (0, _propTypes.shape)({
    width: _propTypes.number,
    height: _propTypes.number
  }),
  textShadowRadius: _propTypes.number,
  writingDirection: (0, _propTypes.oneOf)(['auto', 'ltr', 'rtl']),

  /* @platform web */
  textIndent: numberOrString,
  textOverflow: _propTypes.string,
  textRendering: (0, _propTypes.oneOf)(['auto', 'geometricPrecision', 'optimizeLegibility', 'optimizeSpeed']),
  textTransform: (0, _propTypes.oneOf)(['capitalize', 'lowercase', 'none', 'uppercase']),
  unicodeBidi: (0, _propTypes.oneOf)(['normal', 'bidi-override', 'embed', 'isolate', 'isolate-override', 'plaintext']),
  whiteSpace: _propTypes.string,
  wordWrap: _propTypes.string,
  MozOsxFontSmoothing: _propTypes.string,
  WebkitFontSmoothing: _propTypes.string
});

var _default = TextStylePropTypes;
exports.default = _default;