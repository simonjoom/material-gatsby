import React from "react";
import { graphql } from "gatsby";
import withTheme from "../withContext";
import Layout from "../components/Layout";
import PostListing from "../components/PostListing";
import SEO from "../components/SEO";
import config from "../data/SiteConfig";

class TagTemplate extends React.Component {
  render() {
    const { translate: t, path } = this.props;
    const { tag, lng, route, slugbase } = this.props.pageContext;
    const postEdges = this.props.data.allMarkdownRemark.edges;
    return (
      <Layout
        carouselList={[]}
        path={path}
        route={route}
        lng={lng}
        page={slugbase}
        location={this.props.location}
      >
        <div className="tag-container">
          <SEO
            title={`Posts tagged as "${tag}" | ${config.siteTitle}`}
            route={route}
            translate={t && t("Index")}
          />
          <PostListing postEdges={postEdges} />
        </div>{" "}
      </Layout>
    );
  }
}
export default withTheme(TagTemplate);

export const pageQuery = graphql`
  query TagPage($tag: String, $lng: String!) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [fields___date], order: DESC }
      filter: {
        fields: { lng: { eq: $lng } }
        frontmatter: { title: { ne: "default" }, tags: { in: [$tag] } }
      }
    ) {
      totalCount
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
            cover
            date
          }
        }
      }
    }
  }
`;
