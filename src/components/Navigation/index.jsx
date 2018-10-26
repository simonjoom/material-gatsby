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
    // console.log("this is the menulist" + global.menuList)
    
    const isMobile = window ? (window.innerWidth < 600 ? true: false) : false
    console.log("Mobile is " + isMobile)
    console.log("MenuList is " + JSON.stringify(global.menuList))
    console.log(lng)
    console.log(global.lng)
    // console.log(global.menuList[lng])
    // global.menuList[lng].map(post=> console.log(post.path))
    return (
      <>
        <SideNav
          trigger={
            <Button
              floating
              fab="horizontal"
              tooltip="open"
              icon="bars"
              type="awesome"
              className="right menubars"
              large
            >
              <a href="#">
                <Button
                key="B1"
                floating
                tooltip="zuck us!"
                type="mat"
                icon="facebook"
                type="awesome"
                className="bgblue"
                />
              </a>
              <a href="#">
                <Button
                  key="B2"
                  floating
                  tooltip="chirp us!"
                  type="awesome"
                  icon="twitter"
                  className="bgblue"
                />
              </a>
              <a href="mailto:simon@skiscool.com">
                <Button
                  key="B3"
                  floating
                  icon="envelope"
                  type="awesome"
                  className="bgblue"
                  tooltip="mail us!"
                />
              </a>
              
            </Button>
          }
        >
          <Button flat className="right" tooltip="Skiscool">
            <LogoSkiscool style={{marginTop: 10}}/>
          </Button>{" "}
          {SideNavItem && (
            <>
              { 
                !isMobile && (
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
                  </>
                )
              }
              
              {
                isMobile &&
                global.menuList[lng] &&
                global.menuList[lng] &&
                global.menuList[lng].length > 0 &&
                global.menuList[lng].map(post=> 
                  (<SideNavItem href={post.path}>
                    {post.title}
                  </SideNavItem>)
                )
              }
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
        {children}
        {/* {postNode && <Disqus postNode={postNode} />} */}
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
          className='footer__main'
        >
          <div className="footer__content white-text">
            <img src="/assets/baton.png" alt="Ski Baton"/>
            <h5 className="footer__title">Need a Lesson Today? Contact Us</h5>
            <p className="white-text">Email Us: <a href="mailto:simon@skiscool.com" className="footer__link">simon@skiscool.com</a></p>
            <p className="white-text">Call Us: +33675505209</p>
          </div>
          
        </Footer>
      </>
    );
  }
}
export default Navigation;
