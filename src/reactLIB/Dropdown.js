import React, { Component } from 'react';
import PropTypes from 'prop-types';
import idgen from './idgen';
import cx from 'classnames';

const classes = {
  'dropdown-content': true
};

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.idx = 'dropdown_' + idgen();
    this.instances = null;
    this.elems = [];
    this.renderTrigger = this.renderTrigger.bind(this);
  }

  componentDidMount() {
    const { options } = this.props;
    this.elems = document.querySelectorAll('.dropdown-trigger');
    if (typeof M !== 'undefined')
      this.instances = M.Dropdown.init(this.elems, options);
  }

  componentWillUnmount() {
    if (typeof M !== 'undefined')
      $(this.elems).map((i, el) => {
        var instance = M.Dropdown.getInstance(el);
        instance && instance.destroy();
      });
  }

  componentWillMount() {
    this.el = this.renderTrigger();
  }
  renderTrigger = () => {
    const { trigger } = this.props;
    if (!trigger) {
      return;
    }
    const classNames = cx(trigger.props.className, 'dropdown-trigger');
    return React.cloneElement(trigger, {
      //ref: t => (this._trigger = `[data-target=${this.idx}]`),
      className: classNames,
      'data-target': this.idx
    });

    /*  const { trigger, fixed } = this.props; 

    return React.cloneElement(trigger, {
 //     ref: t => (this._trigger = `[data-target=${this.id}]`),
     'data-target': this.id,
      className: classNames
    });*/
  };

  render() {
    const { children, className, ...props } = this.props;
    delete props.trigger;
    delete props.options;

    return (
      <div>
        {this.el}
        <ul {...props} className={cx(classes, className)} id={this.idx}>
          {children}
        </ul>
      </div>
    );
  }
}

Dropdown.propTypes = {
  /**
   * The node to trigger the dropdown
   */
  trigger: PropTypes.node.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,

  /**
   * Options hash for the dropdown
   * <a target="_blank" href="http://materializecss.com/dropdown.html#options">http://materializecss.com/dropdown.html</a>
   */
  options: PropTypes.shape({
    inDuration: PropTypes.number,
    outDuration: PropTypes.number,
    constrainWidth: PropTypes.bool,
    hover: PropTypes.bool,
    gutter: PropTypes.number,
    coverTrigger: PropTypes.bool,
    alignment: PropTypes.oneOf(['left', 'right'])
  })
};

export default Dropdown;
