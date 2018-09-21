import React from "react";
import Helmet from "react-helmet";
import { graphql, Link, StaticQuery } from "gatsby";
import "font-awesome/scss/font-awesome.scss";
//import Paper from "react-md/lib/Papers/Paper";
import Navigation from "../components/Navigation";
import config from "../../data/SiteConfig";
import FrontCarousel from "../components/FrontCarousel";
import LanguageSwitcher from "../components/Switchlang";

import { router } from "../config";
import "./index.scss";
import "./global.scss";
import "./toolbar.scss";
import "./carousel.scss";
global.postList = [];

const ZeptoAsync = () =>
  import(/* webpackChunkName: "zepto" */ "../components/zepto");

const ZeptoMin = () => import(/* webpackChunkName: "minz" */ "./cc.js");

class MainNavLayout extends React.Component {
  constructor(props) {
    super(props);
    global.Button ="div";
    this.state = { Button: "div", SideNavItem: null, SideNav: "div" };
  }
  componentDidMount() {
    ZeptoAsync().then(Zepto => {
      global.Zepto = Zepto.default;
      ZeptoMin().then(() => {
        const Button = require("../reactLIB/Button").default;
        const SideNavItem = require("../reactLIB/SideNavItem").default;
        const SideNav = require("../reactLIB/SideNav").default;
        const Dropdown= require("../reactLIB/Dropdown").default;
        const NavItem= require("../reactLIB/NavItem").default;
        global.Button =Button;
        global.Dropdown =Dropdown;
        global.NavItem =NavItem;
        this.setState({
          Button,
          SideNavItem,
          SideNav
        });
      });
    });
  }
  render() {
    const { children, route, t, postList, carouselList, ismain } = this.props;
    console.log("ismain22", ismain);
    return (
      <Navigation
        Button={this.state.Button}
        SideNavItem={this.state.SideNavItem}
        SideNav={this.state.SideNav}
        config={config}
        LocalTitle={this.props.title}
      >
        <Helmet>
          <meta name="description" content={config.siteDescription} />
        </Helmet>
        <div
          className={
            carouselList ? (ismain ? "carousel-main" : "carousel-nomain") : null
          }
        >
          {carouselList &&
            carouselList.length > 0 && (
              <FrontCarousel data={carouselList} ismain={ismain} t={t} />
            )}
        </div>

        <div className="toolbar-main md-paper md-paper--1">
          <div className="toolbar-container">
            <div className="rowlink toolbar-menu">
              {postList.map(post => (
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
      </Navigation>
    );
  }
}

/*
const NoStaticRun = ({ children, route, t, lng, carouselList, postEdges,background }) => {
  const postList = [];
  postEdges.forEach(postEdge => {
    let title;
    if (postEdge.node.fields.lng === lng) {
      //console.log("testslug", postEdge.node.fields.slug);
      title = t(postEdge.node.frontmatter.title);
      if (postEdge.node.fields.inmenu)
        postList.push({
          path: postEdge.node.fields.slug,
          title
        });
    }
  });
  ///
  postList.push({
    path: router["/instructor"][lng],
    title: t("instructor")
  });
  return (
    <MainNavLayout
      postList={postList}
      route={route}
      t={t}
      carouselList={carouselList}
    >
      {children}
    </MainNavLayout>
  );
};

export { NoStaticRun };*/

const StaticRun = ({ children, route, t, lng, carouselList, ismain }) => {
  console.log("global.postList", global.postList);
  if (global.postList.length > 0)
    return (
      <MainNavLayout
        postList={global.postList}
        route={route}
        t={t}
        ismain={ismain}
        carouselList={carouselList}
      >
        {children}
      </MainNavLayout>
    );

  return (
    <StaticQuery
      query={graphql`
        query MenuFileQuery {
          allMarkdownRemark(
            limit: 2000
            filter: { fields: { type: { eq: "pages" } } }
            sort: { fields: [fields___date], order: DESC }
          ) {
            edges {
              node {  
                fields {
                  inmenu
                  carousel
                  slug
                  lng
                }
                frontmatter {
                  title
                }
              }
            }
          }
        }
      `}
      render={data => {
        //generate Menu from allMarkdownRemark
        const postEdges = data.allMarkdownRemark.edges;
        postEdges.forEach(postEdge => {
          let title;
          if (postEdge.node.fields.lng === lng) {
            //console.log("testslug", postEdge.node.fields.slug);
            title = t(postEdge.node.frontmatter.title);
            if (postEdge.node.fields.inmenu)
              global.postList.push({
                path: postEdge.node.fields.slug,
                title
              });
          }
        });
        ///
        global.postList.push({
          path: router["/instructor/"][lng],
          title: t("instructor")
        });
        global.postList.push({
          path: router["/blog/"][lng],
          title: t("blog")
        });
        return (
          <MainNavLayout
            postList={postList}
            route={route}
            t={t}
            ismain={ismain}
            carouselList={carouselList}
          >
            {children}
          </MainNavLayout>
        );
      }}
    />
  );
};

export default StaticRun;
