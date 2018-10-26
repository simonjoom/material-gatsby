import React, { Component } from "react";
import { Link } from "gatsby";
import withTheme from "../withContext";
import FrontCarousel from "./FrontCarousel";
import LanguageSwitcher from "./Switchlang";

class Layout extends Component {
  render() {
    const {
      translate,
      children,
      route,
      lng = "en",
      carouselList,
      page,
      path,
      location
    } = this.props;
    if (route && Object.keys(route).length === 0)
      console.log("route", lng, this.props);
    const isMobile = window ? (window.innerWidth < 600 ? true: false) : false
    console.log("isMobile in Layout.jsx is " + isMobile)
    return (
      <>
        <div
          className={
            carouselList
              ? page === "/"
                ? "carousel-main"
                : "carousel-nomain"
              : null
          }
        >
          {carouselList &&
            carouselList.length > 0 && (
              <FrontCarousel
                data={carouselList}
                page={page}
                height={carouselList.length > 1 ? null : "50%"}
              />
            )}
        </div>

        <div className="toolbar-main md-paper md-paper--1">
          <div className="md-grid md-grid--no-spacing toolbar-container">
            <div className="md-grid md-grid--no-spacing md-cell md-cell--11 md-cell--6-tablet md-cell--3-phone toolbar-menu toolbar-menu">
              {
                !isMobile &&
                global.menuList &&
                global.menuList[lng] &&
                global.menuList[lng].length > 0 &&
                global.menuList[lng].map(post => (
                  <Link
                    key={post.path}
                    style={{ textDecoration: "none" }}
                    to={post.path}
                    className="Menulink toolbar-link"
                  >
                    {post.title}
                  </Link>
                ))}
            </div>
            {((route && Object.keys(route).length !== 0) || path) && (
              <LanguageSwitcher path={path} route={route} />
            )}
          </div>
        </div>
        {children}
      </>
    );
  }
}
export default withTheme(Layout);
