import React from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import { translate } from "utils/i18n";
import PostListing from "../components/PostListing"; 
import Layout from "../components/Layout";
import config from "../../data/SiteConfig";

class CategoryTemplate extends React.Component {
  render() {
    const { category, lng, route } = this.props.pageContext;
    const postEdges = this.props.data.allMarkdownRemark.edges; 
    return (
      <Layout carouselList={[]} route={route} lng={lng} ismain={false} location={this.props.location}>
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

export default translate(["Category", "common"])(CategoryTemplate);

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


/*
    locales: allLocale(filter: { lng: { eq: $lng } }) {
      ...LocaleFragment
    }

      <Layout
        location={this.props.location}
        title={category.charAt(0).toUpperCase() + category.slice(1)}
        route={route}
        t={this.props.t}
        lng={lng}
      >*/