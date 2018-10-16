import React, { Component } from "react";
import ReactDisqusComments from "react-disqus-comments";
import parse from "date-fns/parse";
import format from "date-fns/format";
import urljoin from "url-join";
import Avatar from "../Avatars";
//import Snackbar from "react-md/lib/Snackbars";
const config = require("../../data/SiteConfig"+process.env.LANG);
import Card from "../../reactLIB/Card";
import Icon from "../../reactLIB/Icon";
import Button from "../../reactLIB/Button";

class Disqus extends Component {
  constructor(props) {
    super(props);
    /*
    this.state = {
      toasts: []
    };*/
    this.notifyAboutComment = this.notifyAboutComment.bind(this);
    // this.onSnackbarDismiss = this.onSnackbarDismiss.bind(this);
  }

  /* onSnackbarDismiss() {
    const [, ...toasts] = this.state.toasts;
    this.setState({ toasts });
  }*/
  notifyAboutComment(comment) {
    /*     console.log(comment.text); 
    const toasts = this.state.toasts.slice();
    toasts.push({ text: "New comment available!" });
    this.setState({ toasts });*/
    var toastHTML =
      "<span>" +
      comment.text +
      "</span><button class='btn-flat toast-action'>Undo</button>";
    typeof M !== "undefined" && M.toast({ html: toastHTML });
  }
  render() {
    const { postNode } = this.props;
    if (!config.disqusShortname) {
      return null;
    }
    const post = postNode.frontmatter;
    const url = urljoin(
      config.siteUrl,
      postNode.fields.slug
    );

    const date = format(parse(postNode.fields.date), config.dateFormat);
    return (
      <Card
        key={post.path}
        waves="light"
        className="md-grid md-cell md-cell--12-phone md-cell--4 md-cell--4-tablet"
        contentImage={
          <Avatar icon={<Icon type="mat" className="comment" />} />
        }
        titlereveal="Comments"
        title={
          <Button className="btn" icon="comment" type="material">
            Comments
          </Button>
        }
        imgtitle={
          <div>
            <Avatar icon={<Icon className="calendar" />} />
            Published on {date}
          </div>
        }
      >
        <ReactDisqusComments
          shortname={config.disqusShortname}
          identifier={post.title}
          title={post.title}
          url={url}
          category_id="123456"
          onNewComment={this.notifyAboutComment}
        />
      </Card>
    );
  }
}

export default Disqus;
