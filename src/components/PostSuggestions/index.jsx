import React, { Component } from "react";
import Button from "../../reactLIB/Button";
import { Link } from "gatsby";
import "./PostSuggestions.scss";

export default class PostSuggestions extends Component {
  render() {
    const { postNode } = this.props;
    const postFields = postNode.fields;
    console.log("postFields", postFields);
    return (
      <div className="post-suggestions md-grid md-cell md-cell--12">
        <Button
          node={Link}
          to={postFields.prevSlug}
          style={{maxHeight: '60px' }}
          waves="light"
          className="post-suggestion"
          type="material"
          icon="arrow_back"
          iconStyle={{
            
          }}
        >
          <div className="hide-on-mobile">
            <p className="secondary-color" style={{margin: 0}}>Previous</p>
            <p className="secondary-color" style={{margin: 0}}><b>{postFields.prevTitle}</b></p>
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
            // height: 64,
            // width: 64,
            // fontSize: 64
          }}
        >
          <div className="headline-container">
            <p className="secondary-color" style={{margin: 0}}>Next</p>
            <p className="secondary-color" style={{margin: 0}}><b>{postFields.nextTitle}</b></p>
          </div>
        </Button>
      </div>
    );
  }
}
