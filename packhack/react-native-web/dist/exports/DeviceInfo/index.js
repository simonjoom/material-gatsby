/**
 * Copyright (c) 2015-present, Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import Dimensions from '../Dimensions';
var DeviceInfo = {
  Dimensions: {
    get windowPhysicalPixels() {
      var _Dimensions$get = Dimensions.get('window'),
          width = _Dimensions$get.width,
          height = _Dimensions$get.height,
          fontScale = _Dimensions$get.fontScale,
          scale = _Dimensions$get.scale;

      return {
        width: width * scale,
        height: height * scale,
        scale: scale,
        fontScale: fontScale
      };
    },

    get screenPhysicalPixels() {
      var _Dimensions$get2 = Dimensions.get('screen'),
          width = _Dimensions$get2.width,
          height = _Dimensions$get2.height,
          fontScale = _Dimensions$get2.fontScale,
          scale = _Dimensions$get2.scale;

      return {
        width: width * scale,
        height: height * scale,
        scale: scale,
        fontScale: fontScale
      };
    }

  },

  get locale() {
    if (canUseDOM) {
      if (window.navigator.languages) {
        return window.navigator.languages[0];
      } else {
        return window.navigator.language;
      }
    }
  },

  get totalMemory() {
    return canUseDOM ? window.navigator.deviceMemory : undefined;
  },

  get userAgent() {
    return canUseDOM ? window.navigator.userAgent : '';
  }

};
export default DeviceInfo;