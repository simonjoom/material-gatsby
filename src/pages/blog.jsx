import React from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import withTheme from "../withContext";
import Layout from "../components/Layout";
import PostListing from "../components/PostListing";
import SEO from "../components/SEO";
import config from "../../data/SiteConfig";
import "../articleApp.scss";

class Blog extends React.Component {
  render() {
    const { translate: t } = this.props;
    const { slug, lng, route, files } = this.props.pageContext;
    global.filesQuery = files;
    const postEdges = this.props.data.allMarkdownRemark.edges;
    return (
      <Layout
        carouselList={[]}
        route={route}
        lng={lng}
        ismain={false}
        location={this.props.location}
      >
        <div className="index-container">
          <Helmet>
            <title>{config.siteTitle}</title>
            <link rel="canonical" href={`${config.siteUrl}`} />
          </Helmet>
          <SEO postEdges={postEdges} translate={t("Index")} />
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
        fields: { lng: { eq: $lng }, type: { eq: "post" } }
        frontmatter: { title: { ne: "default" } }
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
            cover
            date
          }
        }
      }
    }
  }
`;
