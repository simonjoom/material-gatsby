import React, { Component } from "react";
import Button from "react-md/lib/Buttons";
import { View, Text } from "react-native";
import { Link } from "gatsby";
import UserLinks from "../UserLinks";
import config from "../../../data/SiteConfig";
import "./Footer.scss";

class Footer extends Component {
  render() {
    const url = config.siteRss;
    const { userLinks } = this.props;
    const { copyright, fixedFooter } = config;
    if (!copyright) {
      return null;
    }
    return (
      <footer className={fixedFooter ? "footer footer-fixed" : "footer"}>
        {userLinks ? <UserLinks config={config} labeled /> : null}

        <View className="notice-container">
          <Text>
            <i className="fa fa-mobile" /> Call Us: +33 6 75 505209{" "}
            <i className="fa fa-phone" />
          </Text>
          <div className="c1 c5 c2 py2 fit center mx-auto">
            <img src="https://skiscool.com/dist/baton1024.jpg" />
            <img src="https://skiscool.com/dist/tripadvisor.jpg" />
          </div>
          <div
            id="ime"
            className="flex flex-wrap justify-center relative py2 fit center mx-auto"
          >
            <img src="https://skiscool.com/dist/pic/courchevel.jpg" />
            <img src="https://skiscool.com/dist/pic/apogee.jpg" />
            <img src="https://skiscool.com/dist/pic/davidcintract.jpg" />
          </div>

          <div className="copyright">
            <h4>{copyright}</h4>
          </div>

          <div className="rss">
            <Link to={url}>
              <Button flat secondary iconClassName="fa fa-rss">
                Subscribe
              </Button>
            </Link>
          </div>

          <div className="based-on">
            <h4>
              Based on{" "}
              <a href="https://github.com/simonjoom/material-gatsby">
                Gatsby SkiScool
              </a>
              .
            </h4>
          </div>
        </View>
      </footer>
    );
  }
}

export default Footer;
