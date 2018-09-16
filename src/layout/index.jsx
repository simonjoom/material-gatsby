import React from "react";
import Helmet from "react-helmet";
import { graphql, Link, StaticQuery } from "gatsby";
import { View } from "react-native";
import "font-awesome/scss/font-awesome.scss";
import Navigation from "../components/Navigation";
import config from "../../data/SiteConfig";
import FrontCarousel from "../components/FrontCarousel";
import LanguageSwitcher from "../components/Switchlang";
import { router } from "../config";
import "./index.scss";
import "./global.scss";
import Toolbar from 'react-md/lib/Toolbars'
import './toolbar.scss'

class MainNavLayout extends React.Component {
  render() {
    const { children, route, t, postList, carouselList } = this.props;
    console.log("carouselList", postList);
    return (
      <Navigation config={config} LocalTitle={this.props.title}>
        <Helmet>
          <meta name="description" content={config.siteDescription} />
        </Helmet>
          {carouselList &&
          carouselList.length > 0 && <FrontCarousel dataList={carouselList} />}
        <Toolbar className="toolbar-main" >
          <div className="toolbar-container">
            <div className="rowlink toolbar-menu">
            {postList.map(post => (
              <Link
                key={post.path}
                style={{ textDecoration: "none" }}
                to={post.path}
                className="Menulink toolbar-link"
              >
                {/* <i className="mr1 fa fa-lg fa-circle-o" /> */}
                {post.title}
              </Link>
            ))}
            </div>

              <LanguageSwitcher route={route} className="flex-end" />
            
          </div>
          
        </Toolbar>

        {/* <LanguageSwitcher route={route} className="flex-end" />
        <View className="rowlink">
          {postList.map(post => (
            <Link
              key={post.path}
              style={{ textDecoration: "none" }}
              to={post.path}
              className="Menulink"
            >
              <i className="mr1 fa fa-lg fa-circle-o" />
              {post.title}
            </Link>
          ))}
        </View> */}
        {children}
      </Navigation>
    );
  }
}
const NoStaticRun = ({ children, route, t, lng, carouselList, postEdges }) => {
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

export { NoStaticRun };

const StaticRun = ({ children, route, t, lng, carouselList }) => (
  <StaticQuery
    query={graphql`
      query MenuQuery {
        allMarkdownRemark(
          limit: 2000
          filter: { fields: { type: { eq: "pages" } } }
          sort: { fields: [fields___date], order: DESC }
        ) {
          edges {
            node {
              html
              timeToRead
              excerpt
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
    }}
  />
);

export default StaticRun;
