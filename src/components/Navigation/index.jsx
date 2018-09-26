import React, { Component } from "react";
import Icon from "../../reactLIB/Icon";
import Button from "../../reactLIB/Button";
import SideNavItem from "../../reactLIB/SideNavItem";
import SideNav from "../../reactLIB/SideNav";
 
//import ToolbarActions from "../ToolbarActions";

import Footer from "../Footer";
//import GetNavList from "./NavList";
import "./Navigation.scss";

class Navigation extends Component { 
  render() {
    const { children, config, LocalTitle, translate } = this.props;  
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
              <SideNavItem
                userView
                user={{
                  name: "John Doe",
                  email: "jdandturk@gmail.com"
                }}
              />
              <SideNavItem href="#!icon" icon="cloud">
                First Link With Icon
              </SideNavItem>
              <SideNavItem href="#!second">Second Link</SideNavItem>
              <SideNavItem divider />
              <SideNavItem subheader>Subheader</SideNavItem>
              <SideNavItem waves href="#!third">
                Third Link With Waves
              </SideNavItem>
            </>
          )}
        </SideNav>
        <div className="main-container">{children}</div>
      </div>
    );
  }
}
export default Navigation; 