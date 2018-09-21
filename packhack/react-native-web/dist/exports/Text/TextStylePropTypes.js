function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * Copyright (c) 2015-present, Nicolas Gallagher.
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
import ColorPropType from '../ColorPropType';
import ViewStylePropTypes from '../View/ViewStylePropTypes';
import { array, number, oneOf, oneOfType, shape, string } from 'prop-types';
var numberOrString = oneOfType([number, string]);

var TextStylePropTypes = _extends({}, ViewStylePropTypes, {
  color: ColorPropType,
  fontFamily: string,
  fontFeatureSettings: string,
  fontSize: numberOrString,
  fontStyle: string,
  fontWeight: string,
  fontVariant: array,
  letterSpacing: numberOrString,
  lineHeight: numberOrString,
  textAlign: oneOf(['center', 'end', 'inherit', 'justify', 'justify-all', 'left', 'right', 'start']),
  textAlignVertical: string,
  textDecorationColor: ColorPropType,
  textDecorationLine: string,
  textDecorationStyle: string,
  textShadowColor: ColorPropType,
  textShadowOffset: shape({
    width: number,
    height: number
  }),
  textShadowRadius: number,
  writingDirection: oneOf(['auto', 'ltr', 'rtl']),

  /* @platform web */
  textIndent: numberOrString,
  textOverflow: string,
  textRendering: oneOf(['auto', 'geometricPrecision', 'optimizeLegibility', 'optimizeSpeed']),
  textTransform: oneOf(['capitalize', 'lowercase', 'none', 'uppercase']),
  unicodeBidi: oneOf(['normal', 'bidi-override', 'embed', 'isolate', 'isolate-override', 'plaintext']),
  whiteSpace: string,
  wordWrap: string,
  MozOsxFontSmoothing: string,
  WebkitFontSmoothing: string
});

export default TextStylePropTypes;