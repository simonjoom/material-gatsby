function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

import ColorPropType from '../ColorPropType';
import { Component } from 'react';
import createElement from '../createElement';
import { number, oneOfType, string } from 'prop-types';

var PickerItem =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(PickerItem, _Component);

  function PickerItem() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = PickerItem.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        color = _this$props.color,
        label = _this$props.label,
        testID = _this$props.testID,
        value = _this$props.value;
    var style = {
      color: color
    };
    return createElement('option', {
      style: style,
      testID: testID,
      value: value
    }, label);
  };

  return PickerItem;
}(Component);

export { PickerItem as default };