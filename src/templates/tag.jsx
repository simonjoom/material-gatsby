import React from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import withTheme from "../withContext";
import Layout from "../components/Layout";
import PostListing from "../components/PostListing";
import config from "../../data/SiteConfig";

class TagTemplate extends React.Component {
  render() {
    const { translate: t ,path } = this.props;
    const { tag, lng } = this.props.pageContext;
    const postEdges = this.props.data.allMarkdownRemark.edges;
    return (
      <Layout
        carouselList={[]}
        path={path}
        lng={lng}
        ismain={false}
        location={this.props.location}
      >
        <div className="tag-container">
          <Helmet>
            <title>{`Posts tagged as "${tag}" | ${config.siteTitle}`}</title>
            <link rel="canonical" href={`${config.siteUrl}/tags/${tag}`} />
          </Helmet>
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
        frontmatter: { tags: { in: [$tag] } }
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