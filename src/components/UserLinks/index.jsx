import React, { Component } from "react";
// import Button from "react-md/lib/Buttons";
import Button from "../../reactLIB/Button";
import "./UserLinks.scss";

class UserLinks extends Component {
  getLinkElements() {
    const { userLinks } = this.props.config;
    const { labeled, footer } = this.props;
    return userLinks.map(link => (
      <Button
        // icon={!labeled}
        // flat={labeled}
        // secondary
        key={link.label}
        // iconClassName={link.iconClassName}
        node="a"
        href={footer ? link.url : link.url}
        waves= "light"
        className="white-text"
        style={{margin: '0 1%'}}
      >
        <i className={link.iconClassName}></i> {labeled ? link.label : ""}
      </Button>
    ));
  }
  render() {
    const { userLinks } = this.props.config;
    if (!userLinks) {
      return null;
    }
    return <div className="user-links">{this.getLinkElements()}</div>;
  }
}

export default UserLinks;
