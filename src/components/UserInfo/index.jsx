import React, { Component } from "react";
import withTheme from "../../withContext";
import Card from "../../reactLIB/Card";
import Icon from "../../reactLIB/Icon"; 
import config from "../../../data/SiteConfig";
import Avatar from "react-md/lib/Avatars"; 
import IconSeparator from "react-md/lib/Helpers/IconSeparator";
import { Follow } from "react-twitter-widgets";
import UserLinks from "../UserLinks";
import "./UserInfo.scss";

class UserInfo extends Component {
  render() {
    const {
      userAvatar,
      userName,
      userLocation,
      userDescription,
      userLinks,
      userTwitter
    } = this.props.config;
    const {translate: t} = this.props;
    const { expanded } = this.props;
    const userLinksElement = (
      <UserLinks config={this.props.config} labeled />
    );
    if (!userAvatar && !userName && !userLocation && !userDescription) {
      if (userLinks) {
        return (
          <Card className="md-grid md-cell md-cell--12 user-info">
            {userLinksElement}
          </Card>
        );
      }
      return null;
    }
    return (
      <Card
        className="md-grid md-cell md-cell--12 user-info"
        titlereveal={userName && userName}
        title={
          <div>
            {userName}
            {userTwitter ? (
              <Follow
                username={userTwitter}
                options={{ count: expanded ? "none" : "none" }}
              />
            ) : (
              "Author"
            )}
          </div>
        }
        reveal={
          <>
            {userLocation && (
              <IconSeparator label={userLocation} iconBefore>
                <Icon className="map-marker" />
              </IconSeparator>
            )}
            <p>{userDescription && userDescription}</p>
            {userLinksElement}
          </>
        }
        contentImage={
          userAvatar && <Avatar src={userAvatar} role="presentation" />
        }
      >
        <p className="about-text md-body-1">{t("UserDescription")}</p>
        <UserLinks labeled config={config} />
      </Card>
    );
  }
}

export default withTheme(UserInfo); 
