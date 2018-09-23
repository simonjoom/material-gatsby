import React from "react";
import { Link } from "gatsby";
import FrontCarousel from "./FrontCarousel";
import LanguageSwitcher from "./Switchlang";

export default class Layout extends React.Component {
  render() {
    const { children, route, lng, carouselList, ismain, location } = this.props;
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
              {global.postList.map(post => (
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
            <LanguageSwitcher route={route} className="flex-end" />
          </div>
        </div>
        {children}
      </>
    );
  }
}
