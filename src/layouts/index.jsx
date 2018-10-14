import React from "react";
import Navigation from "../components/Navigation";
import "./global.scss";
import "./toolbar.scss";
import "./carousel.scss";
import "./post.scss";
import config from "../data/SiteConfig";
if (process.env.NODE_ENV === "production")
  require("font-awesome/scssprod/font-awesome.scss");
else require("font-awesome/scss/font-awesome.scss");

export default class MainNavLayout extends React.Component {
  render() {
    const { children, lng, location } = this.props;
    const postNode = children.props.data && children.props.data.markdownRemark;
    return (
      <Navigation
        postNode={postNode}
        lng={lng}
        config={config}
        LocalTitle={this.props.title}
      >
        {children}
      </Navigation>
    );
  }
}
