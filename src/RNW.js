// https://github.com/necolas/react-native-web/pull/850
// https://github.com/Dekoruma/react-native-web-modal  
import { canUseDOM } from "fbjs/lib/ExecutionEnvironment";
import { Component } from "react"; 
import Text from './react-native-web/src/exports/Text';
import View from './react-native-web/src/exports/View';
import Image from './react-native-web/src/exports/Image';
import ActivityIndicator from './react-native-web/src/exports/ActivityIndicator';
import Dimensions from './react-native-web/src/exports/Dimensions';
import StyleSheet from './react-native-web/src/exports/StyleSheet';
//import { ColorPropType } from "react-native-web";
//import MyModal from './helpers/Modal'
/*
type StatusBarAnimation = 'none' | 'fade' | 'slide'
type StatusBarStyle = 'default' | 'light-content' | 'dark-content'
type Props = {
  animated?: boolean,
  backgroundColor?: ColorPropType,
  barStyle?: StatusBarStyle,
  hidden?: boolean,
  networkActivityIndicatorVisible?: boolean,
  showHideTransition?: 'fade' | 'slide',
  translucent?: boolean,
}*/ 
const { head } = typeof window !== "undefined" ? document : {};

let _barStyle = "default";
let _hidden = false;
let _translucent = false;

const setMetaTag = (attrName, content) => {
  if (!(canUseDOM && head)) return;

  let tag = head && head.querySelector(`meta[name=${attrName}]`);

  if (!tag && document) {
    tag = document.createElement("meta");
    tag.name = attrName;

    head.appendChild(tag);
  }

  if (tag instanceof HTMLMetaElement) tag.content = content;
};

function setAppleMobileWebAppCapable() {
  setMetaTag(
    "apple-mobile-web-app-capable",
    _hidden || _translucent || _barStyle !== "default" ? "yes" : "no"
  );
}

function setAppleMobileWebAppStatusBarStyle() {
  setAppleMobileWebAppCapable();

  setMetaTag(
    "apple-mobile-web-app-status-bar-style",
    _translucent ? "black-translucent" : _barStyle
  );
}

class StatusB extends Component {
  static defaultProps = {
    showHideTransition: "fade"
  };

  static get currentHeight() {
    if (!canUseDOM) return;

    const { availHeight, height } = window.screen;

    return height - availHeight;
  }

  static setBackgroundColor(color, animated) {
    setMetaTag("theme-color", color);
  }

  static setBarStyle(style, animated) {
    _barStyle = style === "light-content" ? "black" : "default";

    setAppleMobileWebAppStatusBarStyle();
  }

  static setHidden(hidden, animation) {
    _hidden = hidden;

    setAppleMobileWebAppCapable();
  }

  static setNetworkActivityIndicatorVisible(visible) {}

  static setTranslucent(translucent) {
    _translucent = translucent;

    setAppleMobileWebAppStatusBarStyle();
  }

  render() {
    const {
      animated,
      backgroundColor,
      barStyle,
      hidden,
      networkActivityIndicatorVisible,
      showHideTransition,
      translucent
    } = this.props;

    if (backgroundColor) StatusB.setBackgroundColor(backgroundColor, animated);
    if (barStyle) StatusB.setBarStyle(barStyle, animated);
    if (hidden) StatusB.setHidden(hidden, showHideTransition);
    if (networkActivityIndicatorVisible)
      StatusB.setNetworkActivityIndicatorVisible(
        networkActivityIndicatorVisible
      );
    if (translucent) StatusB.setTranslucent(translucent);

    return null;
  }
}

//RNWeb.StatusB = StatusB;
export const StatusBar = StatusB;
export {
  View,
  Image,
  ActivityIndicator,
  Dimensions, 
  StyleSheet,
  Text
} 
