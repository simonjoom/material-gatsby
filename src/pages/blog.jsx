import React from "react";
import { graphql } from "gatsby";
import withTheme from "../withContext";
import Layout from "../components/Layout";
import PostListing from "../components/PostListing";
import SEO from "../components/SEO";
import "../articleApp.scss";

class Blog extends React.Component {
  render() {
    const { translate: t, data } = this.props;
    const { slug, lng, route, files, slugbase } = this.props.pageContext;
    global.filesQuery = files;
    console.log(data.allMarkdownRemark.edges);
    const postEdges = data.allMarkdownRemark.edges.filter(
      el => el.node.frontmatter.category !== "blog"
    );
    const postNode = data.allMarkdownRemark.edges.find(
      el => el.node.frontmatter.category === "blog"
    ).node;
    const post = postNode.frontmatter;
    const carouselList = post.cover ? post.cover.split(",") : [];

    return (
      <Layout
        carouselList={carouselList}
        route={route}
        lng={lng}
        page={slugbase}
        location={this.props.location}
      >
        <div className="index-container">
          <SEO
            postSEO
            postNode={postNode}
            postPath={slug}
            lng={lng}
            title={t("")("Blog")}
            route={route}
            translate={t("")}
          />
          <PostListing postEdges={postEdges} sizebig={12} size={6} />
        </div>
      </Layout>
    );
  }
}
export default withTheme(Blog);

export const pageQuery = graphql`
  query BlogQuery($lng: String!) {
    allMarkdownRemark(
      limit: 2000
      filter: {
        fields: { lng: { eq: $lng } }
        frontmatter: {
          title: { ne: "default" }
          category: { regex: "/(blog|ski-resort)/" }
        }
      }
      sort: { fields: [fields___date], order: DESC }
    ) {
      edges {
        node {
          fields {
            lng
            slug
            type
            date
          }
          excerpt
          timeToRead
          frontmatter {
            title
            tags
            category
            cover
            avatar
            date
          }
        }
      }
    }
  }
`;
