import React from "react";
import Helmet from "react-helmet"; 
import "font-awesome/scss/font-awesome.scss";
import "./index.scss";
import "./global.scss";
import "./toolbar.scss";
import "./carousel.scss"; 
import Navigation from "../components/Navigation";
import config from "../../data/SiteConfig"; 


export default class MainNavLayout extends React.Component {
  render() { 
    console.log("MainNavLayout",this.props)
    const {
      children, 
      lng, 
      location
    } = this.props;  
    const postNode = children.props.data.markdownRemark;
    return (
        <Navigation postNode={postNode} config={config} LocalTitle={this.props.title}>
          <Helmet>
            <meta name="description" content={config.siteDescription} />
          </Helmet>
          {children}
        </Navigation> 
    );
  }
}
