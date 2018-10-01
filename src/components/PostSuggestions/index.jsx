import React, { Component } from "react";
import Button from "../../reactLIB/Button";
import { Link } from "gatsby";
import "./PostSuggestions.scss";

export default class PostSuggestions extends Component {
  render() {
    const { postNode } = this.props;
    const postFields = postNode.fields;
    return (
      <div className="post-suggestions md-grid md-cell--12">
        <Button
          node={Link}
          to={postFields.prevSlug}
          style={{ height: "auto" }}
          waves="light"
          className="post-suggestion"
          type="material"
          icon="arrow_back"
          iconStyle={{
            height: 64,
            width: 64,
            fontSize: 64
          }}
        >
          <div className="headline-container hide-on-mobile">
            <h2 className="md-body-2 secondary-color">Previous</h2>
            <h6 className="md-headline secondary-color">
              {postFields.prevTitle}
            </h6>
          </div>
        </Button>
        <Button
          node={Link}
          to={postFields.nextSlug}
          style={{ height: "auto" }}
          waves="light"
          className="post-suggestion"
          type="material"
          icon="arrow_forward"
          iconStyle={{
            height: 64,
            width: 64,
            fontSize: 64
          }}
        >
          <div className="headline-container">
            <h2 className="md-body-2 secondary-color">Next</h2>
            <h6 className="md-headline secondary-color">
              {postFields.nextTitle}
            </h6>
          </div>
        </Button>
      </div>
    );
  }
}
