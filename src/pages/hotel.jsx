import React from "react";
import { graphql } from "gatsby";
import withTheme from "../withContext";
import PostListing from "../components/PostListing";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

class Hotel extends React.Component {
  render() {
    const { translate: t, data } = this.props;
    const { lng, route, files, slug } = this.props.pageContext;
    global.filesQuery = files;
    const postEdges = data.allMarkdownRemark.edges.filter(
      el => el.node.frontmatter.category !== "hotel"
    );
    console.log("postEdges",postEdges)
    const postNode = data.allMarkdownRemark.edges.find(
      el => el.node.frontmatter.category === "hotel"
    ).node;
    const post = postNode.frontmatter;
    const carouselList = post.cover ? post.cover.split(",") : [];

    const mynode = ({ star }) => (
      <div
        className="center"
        style={{
          color: "white",
          position: "absolute",
          zIndex: "1",
          width: "100%"
        }}
      >
        <span>
          SkiScool <i className="fa fa-copyright" />
        </span>
        <div>
          {Array.from(new Array(star), a => (
            <i className="yellow-text fa fa-star" />
          ))}
        </div>
      </div>
    );
    return (
      <Layout
        carouselList={carouselList}
        route={route}
        lng={lng}
        ismain={false}
        location={this.props.location}
      >
        <div className="index-container">
          <SEO
            postNode={postNode}
            postPath={slug}
            lng={lng}
            title={t("Hotel")("Hotels")}
            route={route}
            postSEO
            translate={t("Hotel")}
          />
          <PostListing
            postEdges={postEdges}
            size="3"
            sizebig="11"
            extra={mynode}
          />
        </div>
      </Layout>
    );
  }
}
export default withTheme(Hotel);

export const pageQuery = graphql`
  query HotelQuery($lng: String!) {
    allMarkdownRemark(
      limit: 2000
      filter: {
        fields: { lng: { eq: $lng } }
        frontmatter: {
          title: { ne: "default" }
          category: { regex: "/hotel/" }
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
            star
            date
          }
          excerpt
          timeToRead
          frontmatter {
            title
            tags
            category
            cover
            date
          }
        }
      }
    }
  }
`;
