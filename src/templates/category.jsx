import React from "react";
import { graphql } from "gatsby";
import withTheme from "../withContext";
import SEO from "../components/SEO";
import PostListing from "../components/PostListing";
import Layout from "../components/Layout"; 
const config = require("../data/SiteConfig"+process.env.LANG);
class CategoryTemplate extends React.Component {
  render() {
    const { translate: t, path } = this.props;
    const { category, lng, route, files, slugbase } = this.props.pageContext;
    global.filesQuery = files;
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
        <div className="category-container">
          <SEO
            title={`Posts in category "${category}" | ${config.siteTitle}`}
            route={route}
            translate={t("Index")}
          />
          <PostListing postEdges={postEdges} />
        </div>
      </Layout>
    );
  }
}

export default withTheme(CategoryTemplate);

export const pageQuery = graphql`
  query CategoryPage($category: String, $lng: String!) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [fields___date], order: DESC }
      filter: {
        fields: { lng: { eq: $lng } }
        frontmatter: { title: { ne: "default" }, category: { eq: $category } }
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
