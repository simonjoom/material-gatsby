import React from "react";
import { Link } from "gatsby";
import withTheme from "../withContext";
import { router } from "../config";
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

    console.log("Layoutroute", route);
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

        <div className="toolbar-main md-paper md-paper--1" style={{}}>
          <div className="toolbar-container">
            <div className="rowlink toolbar-menu" style={{margin: 'auto 0', padding: '0', display: 'flex'}}>
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
              <Link
                key={router["/instructor/"][lng]}
                style={{ textDecoration: "none" }}
                to={router["/instructor/"][lng]}
                className="Menulink toolbar-link"
              >
                <i className="mr1 fa fa-lg fa-circle-o" />
                {translate("Index")("instructor")}
              </Link>
              <Link
                key={router["/blog/"][lng]}
                style={{ textDecoration: "none" }}
                to={router["/blog/"][lng]}
                className="Menulink toolbar-link"
              >
                <i className="mr1 fa fa-lg fa-circle-o" />
                {translate("Index")("blog")}
              </Link>
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
