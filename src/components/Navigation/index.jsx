import React, { Component } from "react";
import Icon from "../../reactLIB/Icon";
import Button from "../../reactLIB/Button";
import SideNavItem from "../../reactLIB/SideNavItem";
import SideNav from "../../reactLIB/SideNav";
import Footer from "../../reactLIB/Footer";
import UserLinks from "../UserLinks";
import config from "../../../data/SiteConfig"

//import NavigationDrawer from "react-md/lib/NavigationDrawers";
//import ToolbarActions from "../ToolbarActions";

// import Footer from "../Footer";
//import GetNavList from "./NavList";
import "./Navigation.scss";

class Navigation extends Component { 
  render() {
    const { children, config, LocalTitle, translate } = this.props;  
    const {userLinks} = config;
    const footerLinks = LocalTitle !== "About";
    return (
      <div className="main-content">
        <SideNav 
          trigger={
            <Button className="right" tooltip="open">
              <Icon className="bars" />
            </Button>
          }
        >
          {SideNavItem && (
            <>
              {/* <SideNavItem
                userView
                user={{
                  name: "John Doe",
                  email: "jdandturk@gmail.com"
                }}
              /> */}
              <SideNavItem href="/" icon="home">
                HOME
              </SideNavItem>
              <SideNavItem href="/instructor" icon="group">INSTRUCTORS</SideNavItem>
              <SideNavItem divider />
              <SideNavItem subheader>Social</SideNavItem>
              <SideNavItem waves href="#">
                News Feed
              </SideNavItem>
            </>
          )}
        </SideNav>
        <div className="main-container">{children}</div>
        
        <Footer copyrights="&copy; 2018 Skiscool"
          moreLinks={
            <UserLinks config={config} labeled footer></UserLinks>
          }
          links={
            <ul>
              <li><a className="grey-text text-lighten-3" href="/">HOME</a></li>
              <li><a className="grey-text text-lighten-3" href="/instructor">INSTRUCTORS</a></li>
              <li><a className="grey-text text-lighten-3" href="/blog">BLOG</a></li>
              <li><a className="grey-text text-lighten-3" href="/contact">CONTACT US</a></li>
            </ul>
          }
          className='footer__main'
        >
          <div className="footer__content white-text">
            <h5 className="footer__title">Need a Lesson Today? Contact Us</h5>
            <p className="white-text">Email Us: <a href="mailto:simon@skiscool.com" className="footer__link">simon@skiscool.com</a></p>
            <p className="white-text">Call Us: +33675505209</p>
          </div>
          
        </Footer>
      </div>
    );
  }
}
export default Navigation;
