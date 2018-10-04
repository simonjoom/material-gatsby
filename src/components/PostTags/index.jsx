import React, { Component } from "react";
import { kebabCase } from "lodash";
import i18next from "../../utils/i18n";
import { Link } from "gatsby";
import "./PostTags.scss";

class PostTags extends Component {
  componentDidMount() {
    if (typeof M !== "undefined")
      document.addEventListener("DOMContentLoaded", function() {
        var elems = document.querySelectorAll(".chips");
        var instances = M.Chips.init(elems, options);
      });
  }
  render() {
    const lng = i18next.language;
    const { tags } = this.props;
    if (!lng) return null;

    return (
      <div className="post-tag-container">
        {tags &&
          tags.map(tag => (
            <Link
              key={tag}
              style={{ textDecoration: "none" }}
              to={`/tags_${lng}/${kebabCase(tag)}`}
            >
              <div className="chips">{tag}</div>
            </Link>
          ))}
      </div>
    );
  }
}

export default PostTags;
