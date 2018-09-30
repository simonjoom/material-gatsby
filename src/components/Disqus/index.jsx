import React, { Component } from "react";
import ReactDisqusComments from "react-disqus-comments";
import moment from "moment"; 
import urljoin from "url-join";
import Avatar from "react-md/lib/Avatars";
//import FontIcon from "react-md/lib/FontIcons";
import Snackbar from "react-md/lib/Snackbars";
import config from "../../../data/SiteConfig";
import Card from "../../reactLIB/Card"; 
import Icon from "../../reactLIB/Icon";
import Button from "../../reactLIB/Button";

class Disqus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toasts: []
    };
    this.notifyAboutComment = this.notifyAboutComment.bind(this);
    this.onSnackbarDismiss = this.onSnackbarDismiss.bind(this);
  }

  onSnackbarDismiss() {
    const [, ...toasts] = this.state.toasts;
    this.setState({ toasts });
  }
  notifyAboutComment() {
    const toasts = this.state.toasts.slice();
    toasts.push({ text: "New comment available!" });
    this.setState({ toasts });
  }
  render() {
    const { postNode } = this.props;
    if (!config.disqusShortname) {
      return null;
    }
    const post = postNode.frontmatter;
    const url = urljoin(
      config.siteUrl,
      config.pathPrefix,
      postNode.fields.slug
    );

    return (
      <><Card
        key={post.path}
        waves="light"
        className="md-grid md-cell md-cell--12-phone md-cell--4 md-cell--4-tablet"
        contentImage={<Avatar icon={<Icon type="material" className="comment"/>} />}
        titlereveal="Comments" 
        title={
            <Button className="btn" icon="comment" type="material">Comments</Button>
        }
        imgtitle={
          <div>
            <Avatar icon={<Icon className="calendar" />} />
            Published on{" "}
            {`${moment(postNode.fields.date).format(config.dateFormat)}`}
          </div>
        } 
      >
      <ReactDisqusComments
        shortname={config.disqusShortname}
        identifier={post.title}
        title={post.title}
        url={url}
        category_id={post.category_id}
        onNewComment={this.notifyAboutComment}
      />
      </Card>
        <Snackbar
          toasts={this.state.toasts}
          onDismiss={this.onSnackbarDismiss}
        /></>
    );
  }
}

export default Disqus;
