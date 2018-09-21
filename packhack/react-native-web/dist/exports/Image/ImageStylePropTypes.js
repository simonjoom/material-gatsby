function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import AnimationPropTypes from '../../modules/AnimationPropTypes';
import BorderPropTypes from '../../modules/BorderPropTypes';
import ColorPropType from '../ColorPropType';
import ImageResizeMode from './ImageResizeMode';
import InteractionPropTypes from '../../modules/InteractionPropTypes';
import LayoutPropTypes from '../../modules/LayoutPropTypes';
import ShadowPropTypes from '../../modules/ShadowPropTypes';
import TransformPropTypes from '../../modules/TransformPropTypes';
import { number, oneOf, string } from 'prop-types';

var ImageStylePropTypes = _extends({}, AnimationPropTypes, BorderPropTypes, InteractionPropTypes, LayoutPropTypes, ShadowPropTypes, TransformPropTypes, {
  backgroundColor: ColorPropType,
  opacity: number,
  resizeMode: oneOf(Object.keys(ImageResizeMode)),
  tintColor: ColorPropType,

  /**
   * @platform unsupported
   */
  overlayColor: string,

  /**
   * @platform web
   */
  boxShadow: string,
  filter: string
});

export default ImageStylePropTypes;