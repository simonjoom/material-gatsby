import React from "react";
import Helmet from "react-helmet"; 
import "font-awesome/scss/font-awesome.scss";
//import Paper from "react-md/lib/Papers/Paper";
import Navigation from "../components/Navigation";
import config from "../../data/SiteConfig"; 
import { ThemeContext } from "../withContext";
import "./index.scss";
import "./global.scss";
import "./toolbar.scss";
import "./carousel.scss";

export default class MainNavLayout extends React.Component {
  componentWillUnmount(){
    console.log("unmountLayout")
  }
  render() {
    const {
      children,
      route, 
      lng, 
      location
    } = this.props;
    console.log("runMainNavLayout",global.trname, global.postList);
    console.log("tracet", global.trname, location);
    return (
      <ThemeContext.Provider
        value={{
          translate: global.trname
        }}
      >
        <Navigation config={config} LocalTitle={this.props.title}>
          <Helmet>
            <meta name="description" content={config.siteDescription} />
          </Helmet>
          {children}
        </Navigation>
      </ThemeContext.Provider>
    );
  }
}
