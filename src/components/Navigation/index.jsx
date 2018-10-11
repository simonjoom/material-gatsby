import React, { Component } from "react";
import { Link } from "gatsby";
import LogoSkiscool from "../logo";
import Button from "../../reactLIB/Button";
import Disqus from "../../components/Disqus";
import SideNavItem from "../../reactLIB/SideNavItem";
import SideNav from "../../reactLIB/SideNav";
import Footer from "../../reactLIB/Footer";
import UserLinks from "../UserLinks";
import route from "../../config";

//import config from "../../../data/SiteConfig"

//import ToolbarActions from "../ToolbarActions";
import "./Navigation.scss";

class Navigation extends Component {
  render() {
    const {
      children,
      config,
      LocalTitle,
      translate,
      postNode,
      lng
    } = this.props;
    const footerLinks = LocalTitle !== "About";
    return (
      <div className="main-content">
        <SideNav
          trigger={
            <Button
              floating
              fab="horizontal"
              tooltip="open"
              icon="bars"
              type="awesome"
              className="right"
              large
              style={{
                top: 0,
                bottom: 0,
                right: "14px",
                height: 50,
                width: 200
              }}
            >
              <Button
                floating
                type="mat"
                icon="attach_file"
                className="bgblue"
              />
              <Button
                floating
                type="mat"
                icon="format_quote"
                className="bgwhite"
              />
              <Button
                floating
                tooltip="open"
                icon="publish"
                type="mat"
                className="bgred"
              />
            </Button>
          }
        >
          <Button flat className="right" tooltip="Skiscool">
            <LogoSkiscool />
          </Button>{" "}
          {SideNavItem && (
            <>
              <SideNavItem href={route.router["/"][lng]} icon="home">
                HOME
              </SideNavItem>
              <SideNavItem
                href={route.router["/instructor/"][lng]}
                icon="group"
              >
                INSTRUCTORS
              </SideNavItem>
              <SideNavItem href={route.router["/about/"][lng]} icon="group">
                About Us
              </SideNavItem>
              <SideNavItem divider />
              <SideNavItem subheader>Social</SideNavItem>
              <SideNavItem waves href="#">
                News Feed
              </SideNavItem>
              <SideNavItem
                userView
                user={{
                  name: "Simon Gendrin",
                  email: "simon@skiscool.com"
                }}
              />
            </>
          )}
        </SideNav>
        <div className="main-container">{children}</div>
        {postNode && <Disqus postNode={postNode} />}
        <Footer
          copyrights="&copy; 2018 Skiscool"
          moreLinks={<UserLinks config={config} labeled footer />}
          links={
            <ul>
              <li>
                <Link
                  className="grey-text text-lighten-3"
                  to={route.router["/"][lng]}
                >
                  HOME
                </Link>
              </li>
              <li>
                <Link
                  className="grey-text text-lighten-3"
                  to={route.router["/instructor/"][lng]}
                >
                  INSTRUCTORS
                </Link>
              </li>
              <li>
                <Link
                  className="grey-text text-lighten-3"
                  to={route.router["/blog/"][lng]}
                >
                  BLOG
                </Link>
              </li>
              <li>
                <Link
                  className="grey-text text-lighten-3"
                  to={route.router["/contact/"][lng]}
                >
                  CONTACT US
                </Link>
              </li>
            </ul>
          }
          className="footer__main"
        >
          <div className="footer__content white-text">
            <img src="/assets/baton.png" />
            <h5 className="footer__title">Need a Lesson Today? Contact Us</h5>
            <p className="white-text">
              Email Us:{" "}
              <a href="mailto:simon@skiscool.com" className="footer__link">
                simon@skiscool.com
              </a>
            </p>
            <p className="white-text">Call Us: +33675505209</p>
          </div>
        </Footer>
      </div>
    );
  }
}
export default Navigation;
