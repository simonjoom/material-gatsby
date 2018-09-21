import React, { Component } from "react";

//import NavigationDrawer from "react-md/lib/NavigationDrawers";
//import ToolbarActions from "../ToolbarActions";

import Footer from "../Footer";
//import GetNavList from "./NavList";
import "./Navigation.scss";

class Navigation extends Component {
  static defaultProps = {
    Button: "div",
    SideNavItem: false,
    SideNav: "div"
  };

  render() {
    const {
      children,
      config,
      LocalTitle,
      Button,
      SideNavItem,
      SideNav
    } = this.props;
    const footerLinks = LocalTitle !== "About";
    return (
      <div className="main-content">
        <SideNav
          trigger={
            <Button className="right" tooltip="open">
              <i class="fa fa-bars" />
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
/*
    
      <NavigationDrawer
        drawerTitle={config.siteTitle}
        toolbarTitle={LocalTitle}
        contentClassName="main-content"
        navItems={GetNavList(config)}
        mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY}
        tabletDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY}
        desktopDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY}
        toolbarActions={<ToolbarActions config={config} />}
      >
        <div className="main-container">{children}</div>
        <Footer userLinks={footerLinks} />
      </NavigationDrawer>*/
