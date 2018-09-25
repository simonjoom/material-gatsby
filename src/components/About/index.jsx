import React, { Component } from "react";
import withTheme from "../../withContext";
import Card from "../../reactLIB/Card"; 

import UserLinks from "../UserLinks";
import config from "../../../data/SiteConfig";
import "./About.scss";

class About extends Component {
  render() {
    const {translate: t} = this.props;
    return (
      <div className="about-container md-grid mobile-fix">
        <Card
          className="md-grid md-cell--8"
          titlereveal="UserDescription"
          title="UserDescription"
          contentImage={
            <img
              src={config.userAvatar}
              className="about-img"
              alt={config.userName}
            />
          }
        >
          <p className="about-text md-body-1">{t("UserDescription")}</p>
          <UserLinks labeled config={config} />
        </Card>
      </div>
    );
  }
}

export default withTheme(About); 
