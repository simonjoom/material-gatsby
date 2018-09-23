import React from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import { translate } from "utils/i18n";
import Layout from "../components/Layout";
import PostListing from "../components/PostListing";
import SEO from "../components/SEO";
import config from "../../data/SiteConfig";
import "../articleApp.scss";

class Blog extends React.Component {
  render() {
    const { slug, lng, route } = this.props.pageContext;
    const postEdges = this.props.data.allMarkdownRemark.edges;
    return (
      <Layout
        carouselList={[]}
        route={route}
        lng={route}
        ismain={false}
        location={this.props.location}
      >
        <div className="index-container">
          <Helmet>
            <title>{config.siteTitle}</title>
            <link rel="canonical" href={`${config.siteUrl}`} />
          </Helmet>
          <SEO postEdges={postEdges} translate={this.props.t} />
          <PostListing
            postEdges={postEdges}
            width={"100%"}
            sizebig={12}
            size={12}
          />
        </div>
      </Layout>
    );
  }
}
export default translate(["Index", "common"])(Blog);

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

/*
   locales: allLocale(filter: { lng: { eq: $lng }, ns: { eq: "Index" } }) {
      ...LocaleFragment
    }

      <Layout
        location={this.props.location}
        route={route}
        t={this.props.t}
        lng={lng}
      >*/
