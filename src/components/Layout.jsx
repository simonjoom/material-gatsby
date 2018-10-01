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
      lng,
      carouselList,
      ismain,
      path,
      location
    } = this.props;
 console.log("route",route)
    return (
      <>
        <div
          className={
            carouselList ? (ismain ? "carousel-main" : "carousel-nomain") : null
          }
        >
          {carouselList &&
            carouselList.length > 0 && (
              <FrontCarousel
                data={carouselList}
                ismain={ismain}
                height={carouselList.length > 1 ? "0px" : "50%"}
              />
            )}
        </div>

        <div className="toolbar-main md-paper md-paper--1">
          <div className="toolbar-container">
            <div className="rowlink toolbar-menu">
              {global.menuList&&global.menuList[lng].length > 0 &&
                global.menuList[lng].map(post => (
                  <Link
                    key={post.path}
                    style={{ textDecoration: "none" }}
                    to={post.path}
                    className="Menulink toolbar-link"
                  >
                    <i className="mr1 fa fa-lg fa-circle-o" />
                    {post.title}
                  </Link>
                ))}
            </div>
            {(route||path)&&<LanguageSwitcher path={path} route={route} className="flex-end" />}
          </div>
        </div>
        {children}
      </>
    );
  }
}
export default withTheme(Layout);
