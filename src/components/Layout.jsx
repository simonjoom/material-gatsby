import React from "react";
import { Link } from "gatsby";
import withTheme from "../withContext";
import FrontCarousel from "./FrontCarousel";
import LanguageSwitcher from "./Switchlang";

class Layout extends React.Component {
  render() {
    const {
      translate,
      children,
      route,
      lng="en",
      carouselList,
      page,
      path,
      location
    } = this.props;
    console.log("route", lng);
    return (
      <div>
        <div
          className={
            carouselList ? (page==="/" ? "carousel-main" : "carousel-nomain") : null
          }
        >
          {carouselList &&
            carouselList.length > 0 && (
              <FrontCarousel
                data={carouselList}
                page={page}
                height={carouselList.length > 1 ? "400px" : "50%"}
              />
            )}
        </div>

        <div className="toolbar-main md-paper md-paper--1">
          <div className="md-grid md-grid--no-spacing toolbar-container">
            <div className="md-grid md-grid--no-spacing md-cell md-cell--11 md-cell--6-tablet md-cell--3-phone toolbar-menu toolbar-menu">
              {global.menuList && global.menuList[lng]&&
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
            {(route || path) && (
              <LanguageSwitcher
                path={path}
                route={route}
              />
            )}
          </div>
        </div>
        {children}
      </div>
    );
  }
}
export default withTheme(Layout);
