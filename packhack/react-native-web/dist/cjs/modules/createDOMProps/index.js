"use strict";

exports.__esModule = true;
exports.default = void 0;

var _AccessibilityUtil = _interopRequireDefault(require("../AccessibilityUtil"));

var _StyleSheet = _interopRequireDefault(require("../../exports/StyleSheet"));

var _styleResolver2 = _interopRequireDefault(require("../../exports/StyleSheet/styleResolver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var emptyObject = {};

var resetStyles = _StyleSheet.default.create({
  ariaButton: {
    cursor: 'pointer'
  },
  button: {
    appearance: 'none',
    backgroundColor: 'transparent',
    color: 'inherit',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontStyle: 'inherit',
    fontVariant: ['inherit'],
    fontWeight: 'inherit',
    lineHeight: 'inherit',
    textAlign: 'inherit'
  },
  heading: {
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontStyle: 'inherit',
    fontVariant: ['inherit'],
    fontWeight: 'inherit',
    lineHeight: 'inherit'
  },
  link: {
    backgroundColor: 'transparent',
    color: 'inherit',
    textDecorationLine: 'none'
  },
  list: {
    listStyle: 'none'
  }
});

var pointerEventsStyles = _StyleSheet.default.create({
  auto: {
    pointerEvents: 'auto'
  },
  'box-none': {
    pointerEvents: 'box-none'
  },
  'box-only': {
    pointerEvents: 'box-only'
  },
  none: {
    pointerEvents: 'none'
  }
});

var defaultStyleResolver = function defaultStyleResolver(style) {
  return _styleResolver2.default.resolve(style);
};

var createDOMProps = function createDOMProps(component, props, styleResolver) {
  if (!styleResolver) {
    styleResolver = defaultStyleResolver;
  }

  if (!props) {
    props = emptyObject;
  }

  var _props = props,
      accessibilityLabel = _props.accessibilityLabel,
      accessibilityLiveRegion = _props.accessibilityLiveRegion,
      importantForAccessibility = _props.importantForAccessibility,
      placeholderTextColor = _props.placeholderTextColor,
      pointerEvents = _props.pointerEvents,
      providedStyle = _props.style,
      testID = _props.testID,
      accessible = _props.accessible,
      accessibilityComponentType = _props.accessibilityComponentType,
      accessibilityRole = _props.accessibilityRole,
      accessibilityTraits = _props.accessibilityTraits,
      domProps = _objectWithoutPropertiesLoose(_props, ["accessibilityLabel", "accessibilityLiveRegion", "importantForAccessibility", "placeholderTextColor", "pointerEvents", "style", "testID", "accessible", "accessibilityComponentType", "accessibilityRole", "accessibilityTraits"]);

  var disabled = _AccessibilityUtil.default.isDisabled(props);

  var role = _AccessibilityUtil.default.propsToAriaRole(props); // GENERAL ACCESSIBILITY


  if (importantForAccessibility === 'no-hide-descendants') {
    domProps['aria-hidden'] = true;
  }

  if (accessibilityLabel && accessibilityLabel.constructor === String) {
    domProps['aria-label'] = accessibilityLabel;
  }

  if (accessibilityLiveRegion && accessibilityLiveRegion.constructor === String) {
    domProps['aria-live'] = accessibilityLiveRegion === 'none' ? 'off' : accessibilityLiveRegion;
  }

  if (role && role.constructor === String && role !== 'label') {
    domProps.role = role;
  } // DISABLED


  if (disabled) {
    domProps['aria-disabled'] = disabled;
    domProps.disabled = disabled;
  } // FOCUS
  // Assume that 'link' is focusable by default (uses <a>).
  // Assume that 'button' is not (uses <div role='button'>) but must be treated as such.


  var focusable = !disabled && importantForAccessibility !== 'no' && importantForAccessibility !== 'no-hide-descendants';

  if (role === 'link' || component === 'input' || component === 'select' || component === 'textarea') {
    if (accessible === false || !focusable) {
      domProps.tabIndex = '-1';
    } else {
      domProps['data-focusable'] = true;
    }
  } else if (role === 'button' || role === 'textbox') {
    if (accessible !== false && focusable) {
      domProps['data-focusable'] = true;
      domProps.tabIndex = '0';
    }
  } else {
    if (accessible === true && focusable) {
      domProps['data-focusable'] = true;
      domProps.tabIndex = '0';
    }
  } // STYLE
  // Resolve React Native styles to optimized browser equivalent


  var reactNativeStyle = [component === 'a' && resetStyles.link, component === 'button' && resetStyles.button, role === 'heading' && resetStyles.heading, component === 'ul' && resetStyles.list, role === 'button' && !disabled && resetStyles.ariaButton, pointerEvents && pointerEventsStyles[pointerEvents], providedStyle, placeholderTextColor && {
    placeholderTextColor: placeholderTextColor
  }];

  var _styleResolver = styleResolver(reactNativeStyle),
      className = _styleResolver.className,
      style = _styleResolver.style;

  if (className && className.constructor === String) {
    domProps.className = props.className ? props.className + " " + className : className;
  }

  if (style) {
    domProps.style = style;
  } // OTHER
  // Link security and automation test ids


  if (component === 'a' && domProps.target === '_blank') {
    domProps.rel = (domProps.rel || '') + " noopener noreferrer";
  }

  if (testID && testID.constructor === String) {
    domProps['data-testid'] = testID;
  }

  return domProps;
};

var _default = createDOMProps;
exports.default = _default;