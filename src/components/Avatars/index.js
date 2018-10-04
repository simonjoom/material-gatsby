import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
 

/**
 * The avatar component is used to convert a `FontIcon`, an image, or
 * a letter into an avatar.
 *
 * Any other props given to the Avatar component such as event listeners
 * or styles will also be applied.
 */
export default class Avatar extends PureComponent {
  static defaultProps = {
    suffixes: [
      'red',
      'pink',
      'purple',
      'deep-purple',
      'indigo',
      'blue',
      'light-blue',
      'cyan',
      'teal',
      'green',
      'light-green',
      'lime',
      'yellow',
      'amber',
      'orange',
      'deep-orange',
      'brown',
      'grey',
      'blue-grey',
    ],
  };

  state = { color: null };

  componentWillMount() {
    if (this.props.random) {
      this._setRandomColor();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.random && (this.props.src !== nextProps.src || this.props.icon !== nextProps.icon)) {
      this._setRandomColor();
    } else if (this.props.random && !nextProps.random) {
      this.setState({ color: null });
    }
  }

  _setRandomColor = () => {
    const { suffixes } = this.props;

    const i = (Math.floor(Math.random() * (suffixes.length - 1)) + 1);
    this.setState({ color: suffixes[i] });
  };

  _getColor(suffix, suffixes, color) {
    if (suffix) {
      return `md-avatar--${suffix}`;
    } else if (!!suffixes && !color) {
      return 'md-avatar--default';
    }

    return `md-avatar--${color}`;
  }

  render() {
    const {
      className,
      contentStyle,
      contentClassName,
      src,
      alt,
      icon,
      children,
      suffix,
      suffixes,
      iconSized,
      role,
      random, // eslint-disable-line no-unused-vars
      ...props
    } = this.props;

    let content;
    if (src) {
      content = (
        <img
          src={src}
          alt={alt}
          role={role}
          style={contentStyle}
          className={cn('md-avatar-img', contentClassName)}
        />
      );
    } else {
      content = (
        <div
          style={contentStyle}
          className={cn('md-avatar-content', contentClassName)}
        >
          {icon || children}
        </div>
      );
    }
    return (
      <div
        {...props}
        className={cn('md-inline-block md-avatar', this._getColor(suffix, suffixes, this.state.color), {
          'md-avatar--icon-sized': iconSized,
        }, className)}
      >
        {content}
      </div>
    );
  }
}
