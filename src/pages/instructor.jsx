import React from "react"; 
import { graphql } from "gatsby";
import withTheme from "../withContext";
import PostListing from "../components/PostListing";
import Layout from "../components/Layout";
import SEO from "../components/SEO"; 

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
          <SEO postEdges={postEdges} route={route} translate={t("Instructor")} />
          <PostListing postEdges={postEdges} size="3" sizebig="11" />
        </div>
      </Layout>
    );
  }
}
export default withTheme(Instructor);

export const pageQuery = graphql`
  query InstQuery($lng: String!) {
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
