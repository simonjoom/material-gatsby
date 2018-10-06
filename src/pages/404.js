import React from "react";  
import withTheme from "../withContext";
import Layout from "../components/Layout"; 
import SEO from "../components/SEO"; 
import "../articleApp.scss";

class Comp_404 extends React.Component {
  render() {
    const { translate: t } = this.props; 
    const { slug, lng } = this.props.pageContext;
    console.log("lng",lng)
    return (
      <Layout
        carouselList={[]}  
        lng={lng}
        ismain={false}
        location={this.props.location}
      >
        404 Page
      </Layout>
    );
  }
}
export default withTheme(Comp_404);

