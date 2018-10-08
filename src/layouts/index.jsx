import React from "react";
import "font-awesome/scss/font-awesome.scss";
import "./index.scss";
import "./global.scss";
import "./toolbar.scss";
import "./carousel.scss";
import Chat from "../components/Chat/Chat"
//import Paper from "react-md/lib/Papers/Paper";
import Navigation from "../components/Navigation";
import config from "../data/SiteConfig";

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
