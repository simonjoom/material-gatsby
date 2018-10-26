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
    const isMobile = window ? (window.innerWidth < 600 ? true: false) : false;
    console.log(global.menuList[lng].filter((menu)=> menu.title == "Contact" || menu.title == "Instructors"))
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
                {
                  isMobile &&
                  global.menuList &&
                  global.menuList[lng] &&
                  global.menuList[lng].length > 0 &&
                  global.menuList[lng].filter(menu=> {
                    switch(lng){
                      case "en":
                        return menu.path == "/Instructors_skischool/" || menu.path == "/contact/"
                      case "fr":
                        return menu.path == "/fr/Moniteurs_skischool/" || menu.path == "/fr/contact"
                      case "pt":
                        return menu.path == "/pt/instructors_skischool/" || menu.path == "/pt/contato/"
                      case "uk":
                        return menu.path == "/uk/інструкторів_skischool/" || menu.path == "/uk/дотик/"
                      case "ru":
                        return menu.path == "/ru/Инструкторы_skischool/" || menu.path == "/ru/контакт/"
                      case "ch":
                        return menu.title == "Instructors" || menu.title == "Contact"
                    }
                  })
                  .map(post=>(
                    <Link
                      key={post.path}
                      style={{ textDecoration: "none" }}
                      to={post.path}
                      className="Menulink toolbar-link"
                    >
                      {post.title}
                    </Link>
                  ))
                }
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
