import React from 'react';
import Icon from 'react-native-vector-icons/dist/Zocial';
import iconFont from 'react-native-vector-icons/Fonts/Zocial.ttf';
const iconFontStyles = `@font-face {
  src: url(${iconFont});
  font-family: Zocial;
}`;

// Create stylesheet
const style = document.createElement('style');
style.type = 'text/css';
if (style.styleSheet) {
  style.styleSheet.cssText = iconFontStyles;
} else {
  style.appendChild(document.createTextNode(iconFontStyles));
}

// Inject stylesheet
document.head.appendChild(style);

export default class Zocial extends React.Component {
  render() {
    return <Icon {...this.props} />;
  }
}
