import React from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby"; 
import withTheme from "../withContext";
import PostListing from "../components/PostListing";
import config from "../../data/SiteConfig";

class TagTemplate extends React.Component {
  render() {
    const {translate: t} = this.props;
    const { tag, route, lng } = this.props.pageContext;
    const postEdges = this.props.data.allMarkdownRemark.edges;
    return (
        <div className="tag-container">
          <Helmet>
            <title>{`Posts tagged as "${tag}" | ${config.siteTitle}`}</title>
            <link rel="canonical" href={`${config.siteUrl}/tags/${tag}`} />
          </Helmet>
          <PostListing postEdges={postEdges} />
        </div> 
    );
  }
}
export default withTheme(TagTemplate)

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


/*
      <Layout
        location={this.props.location}
        title={`Tagged in ${tag.charAt(0).toUpperCase() + tag.slice(1)}`}
        route={route}
        t={this.props.t}
        lng={lng}
      >*/