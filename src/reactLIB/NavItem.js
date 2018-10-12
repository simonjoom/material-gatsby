import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Link } from 'gatsby';

const NavItem = ({
  divider,
  children,
  href = '',
  onClick,
  waves,
  external,
  ...props
}) => {
  const mywaves = waves;
  const classes = cx({
    'card-image': true,
    'waves-effect': waves,
    'waves-block': waves,
    [mywaves]: waves
  });

  if (divider) return <li className="divider" />;
  const el = external ? (
    <a href={href} className={classes}>
      {children}
    </a>
  ) : (
    <Link to={href} onClick={onClick} className={classes}>
      {children}
    </Link>
  );
  return <li {...props}>{el}</li>;
};

NavItem.propTypes = {
  /**
   * children can be a string value or a node
   */
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  divider: PropTypes.bool,
  href: PropTypes.string,
  /**
   * NavItem can have onClick. If it does have, href
   * will not be rendered
   */
  onClick: PropTypes.func
};

export default NavItem;
