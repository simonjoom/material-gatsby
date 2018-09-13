import React from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import { translate } from "utils/i18n";
import Layout from "../layout";
import PostListing from "../components/PostListing";
import SEO from "../components/SEO";
import config from "../../data/SiteConfig";

class Index extends React.Component {
  render() {
    const postEdges = this.props.data.allMarkdownRemark.edges; 
    return (
      <Layout location={this.props.location} title="Home">
        <div className="index-container">
          <Helmet>
            <title>{config.siteTitle}</title>
            <link rel="canonical" href={`${config.siteUrl}`} />
          </Helmet>
          <SEO postEdges={postEdges} translate={this.props.t} />
          <PostListing postEdges={postEdges} />
        </div>
      </Layout>
    );
  }
}
export default translate(["Index", "common"])(Index);

export const pageQuery = graphql`
  query BlogQuery($lng: String!) {
    locales: allLocale(filter: { lng: { eq: $lng }, ns: { eq: "Index" } }) {
      ...LocaleFragment
    }
    allMarkdownRemark(
      limit: 2000
      filter: { fields: { lng: { eq: $lng }, type: { eq: "post" } } }
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
            cover
            date
          }
        }
      }
    }
  }
`;