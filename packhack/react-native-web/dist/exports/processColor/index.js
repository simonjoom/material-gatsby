/**
 * Copyright (c) 2016-present, Nicolas Gallagher.
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
import normalizeColor from 'normalize-css-color';

var processColor = function processColor(color) {
  if (color === undefined || color === null) {
    return color;
  } // convert number and hex


  var int32Color = normalizeColor(color);

  if (int32Color === undefined || int32Color === null) {
    return undefined;
  }

  int32Color = (int32Color << 24 | int32Color >>> 8) >>> 0;
  return int32Color;
};

export default processColor;