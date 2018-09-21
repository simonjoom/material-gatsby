function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * Copyright (c) 2015-present, Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
import TextStylePropTypes from '../Text/TextStylePropTypes';
import { oneOf } from 'prop-types';

var TextInputStylePropTypes = _extends({}, TextStylePropTypes, {
  /* @platform web */
  resize: oneOf(['none', 'vertical', 'horizontal', 'both'])
});

export default TextInputStylePropTypes;