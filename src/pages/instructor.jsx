import React from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import withTheme from "../withContext";
import PostListing from "../components/PostListing";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import config from "../../data/SiteConfig";

class Instructor extends React.Component {
  render() {
    const {translate: t} = this.props;
    const { lng, route,files } = this.props.pageContext;
    global.filesQuery=files; 
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
          <SEO postEdges={postEdges} translate={t("Instructor")} />
          <PostListing postEdges={postEdges} size="3" sizebig="11" />
        </div>
      </Layout>
    );
  }
}
export default withTheme(Instructor);

export const pageQuery = graphql`
  query InstructorQuery($lng: String!) {
    allMarkdownRemark(
      limit: 2000
      filter: {
        fields: { lng: { eq: $lng }, type: { eq: "instructor" } }
        frontmatter: { title: { ne: "default" } }
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
            date
          }
        }
      }
    }
  }
`;
