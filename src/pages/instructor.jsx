import React from "react";
import { graphql } from "gatsby";
import withTheme from "../withContext";
import PostListing from "../components/PostListing";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

class Instructor extends React.Component {
  render() {
    const { translate: t, data } = this.props;
    const { lng, route, files, slugbase } = this.props.pageContext;
    global.filesQuery = files;
    const postEdges = data.allMarkdownRemark.edges.filter(
      el => el.node.frontmatter.category !== "instructor"
    );
    const postNode = data.allMarkdownRemark.edges.find(
      el => el.node.frontmatter.category === "instructor"
    ).node;
    console.log("inst", files);
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
            postEdges={postEdges}
            route={route}
            translate={t("Instructor")}
          />
          <PostListing postEdges={postEdges} size="3" sizebig="11" />
        </div>
      </Layout>
    );
  }
}
export default withTheme(Instructor);

export const pageQuery = graphql`
  query InstQuery($lng: String!) {
    allMarkdownRemark(
      limit: 2000
      filter: {
        fields: { lng: { eq: $lng } }
        frontmatter: {
          title: { ne: "default" }
          category: { regex: "/(instructor|profile)/" }
        }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          html
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
            cover
            category
            date
          }
        }
      }
    }
  }
`;
