import React from "react";
import withTheme from "../withContext";
import Layout from "../components/Layout";
import "../articleApp.scss";

class Comp_404 extends React.Component {
  render() {
    const { translate: t } = this.props;
    const { slug, lng, slugbase } = this.props.pageContext;
    console.log("lng", lng);
    return (
      <Layout
        carouselList={[]}
        lng={lng}
        page={slugbase}
        location={this.props.location}
      >
        {t("index")("404")}
      </Layout>
    );
  }
}
export default withTheme(Comp_404);
