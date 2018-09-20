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
    const { lng, route } = this.props.pageContext; 
    const postEdges = this.props.data.allMarkdownRemark.edges;
    global.filesQuery=this.props.data.allFile.edges;
    return (
      <Layout
        location={this.props.location}
        route={route}
        t={this.props.t}
        lng={lng}
      >
        <div className="index-container">
          <Helmet>
            <title>{config.siteTitle}</title>
            <link rel="canonical" href={`${config.siteUrl}`} />
          </Helmet>
          <SEO postEdges={postEdges} translate={this.props.t} />
          <PostListing postEdges={postEdges} size="3" sizebig="11" />
        </div>
      </Layout>
    );
  }
}
export default translate(["Index", "common"])(Index);

export const pageQuery = graphql`  
  query InstructorQuery($lng: String!) {
    locales: allLocale(filter: { lng: { eq: $lng } }) {
      ...LocaleFragment
    }
    allFile(
            filter: {
          absolutePath:{regex:"/(assets)\/.*\\.(jpg$|png$)/"}
            }
              ) {
                edges {
                  node {
                    id
                    absolutePath
                    childImageSharp {
                      id
                      internal {
                        contentDigest
                        type
                        owner
                      }
                      fluid(maxWidth: 1300) {
                        base64
                        tracedSVG
                        aspectRatio
                        src
                        srcSet
                        sizes
                        srcWebp
                        srcSetWebp
                        originalName
                      }
                    }
                  }
                }
              }
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
