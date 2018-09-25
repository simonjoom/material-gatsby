import React from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import withTheme from "../withContext";
import PostListing from "../components/PostListing";
import Layout from "../components/Layout";
import config from "../../data/SiteConfig";

class CategoryTemplate extends React.Component {
  render() {
    const { translate: t, path } = this.props;
    const { category, lng, files } = this.props.pageContext;
    global.filesQuery = files;
    const postEdges = this.props.data.allMarkdownRemark.edges;
    return (
      <Layout
        carouselList={[]}
        path={path}
        lng={lng}
        ismain={false}
        location={this.props.location}
      >
        <div className="category-container">
          <Helmet>
            <title>
              {`Posts in category "${category}" | ${config.siteTitle}`}
            </title>
            <link
              rel="canonical"
              href={`${config.siteUrl}/categories_${lng}/${category}`}
            />
          </Helmet>
          <PostListing postEdges={postEdges} />
        </div>
      </Layout>
    );
  }
}

export default withTheme(CategoryTemplate);

export const pageQuery = graphql`
  query CategoryPage($category: String) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [fields___date], order: DESC }
      filter: { frontmatter: { category: { eq: $category } } }
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
