import React, { Component } from "react";
import cx from "classnames";
import { Link } from "gatsby";
import Button from "../../reactLIB/Button";
import "./UserLinks.scss";
const liClass = {
  display: "flex",
  alignItems: "center",
  paddingLeft: "12px",
  paddingTop: "12px",
  paddingBottom: "12px",
  justifyContent: "flex-start"
};
const subHeading = {
  color: "rgba(0, 0, 0, 0.87)",
  fontSize: "1rem",
  fontWeight: 400,
  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
  lineHeight: "1.5em"
};
const EmulateItem = ({ icon, to, key, type, children }) => (
  <li style={liClass}>
    <Button
      node={Link}
      to={to}
      key={key}
      flat
      type={type}
      iconStyle={{
        color: "rgba(0, 0, 0, 0.54)",
        flexShrink: 0,
        marginRight: "16px"
      }}
      icon={icon}
    > 
      <span style={subHeading} key={"s" + key}>
        {children}
      </span>
    </Button>
  </li>
);

class UserLinks extends Component {
  getLinkElements() {
    const { userLinks } = this.props.config;
    const { labeled } = this.props;
    return userLinks.map(link => (
      <EmulateItem
        key={link.label}
        icon={link.iconClassName}
        type="awesome"
        to={link.url}
      >
        {labeled ? link.label : ""}
      </EmulateItem>
    ));
  }
  render() {
    const { userLinks } = this.props.config;
    if (!userLinks) {
      return null;
    }
    return <ul className="user-links">{this.getLinkElements()}</ul>;
  }
}

export default UserLinks;
