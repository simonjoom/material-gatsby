import React from "react";
import Navigation from "../components/Navigation";
import "./global.scss";
import "./toolbar.scss";
import "./carousel.scss";
import "./post.scss";
const config = require("../data/SiteConfig"+process.env.LANG);
if (process.env.NODE_ENV === "production")
  require("font-awesome/scssprod/font-awesome.scss");
else require("font-awesome/scss/font-awesome.scss");

export default class MainNavLayout extends React.Component {
  render() {
    const { children, lng, location } = this.props;
    console.log(this.props, this.pageContext)
    console.log("LNG from layouts (father of navigation) is " + lng)
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
