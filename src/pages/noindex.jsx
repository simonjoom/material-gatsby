import React from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import { translate } from "utils/i18n";
import { Link } from "gatsby";
import Layout from "../layout";
import config from "../../data/SiteConfig";

class Index extends React.Component {
  render() {
    const postEdges = this.props.data.allMarkdownRemark.edges;
    let postList = [];
    postEdges.forEach(postEdge => {
      console.log("testslug",postEdge.node.fields.slug)
      postList.push({
        path: postEdge.node.fields.slug,
        title: postEdge.node.frontmatter.title
      });
    });

    return (
      <Layout location={this.props.location} title="Home">
        <div className="index-container">
          <Helmet>
            <title>{config.siteTitle}</title>
            <link rel="canonical" href={`${config.siteUrl}`} />
          </Helmet>
          {postList.map(post => (
            <Link style={{ textDecoration: "none" }} to={post.path} />
          ))}
        </div>
      </Layout>
    );
  }
}
export default translate(["Index", "common"])(Index);

export const pageQuery = graphql`
  query IndexQuery($lng: String!) {
    locales: allLocale(filter: { lng: { eq: $lng }, ns: { eq: "Index" } }) {
      ...LocaleFragment
    }
    allMarkdownRemark(
      limit: 2000
      filter: { fields: { lng: { eq: $lng }, type: { eq: "pages" } } }
      sort: { fields: [fields___date], order: DESC }
    ) {
      edges {
        node {
          html
          timeToRead
          excerpt
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`;
