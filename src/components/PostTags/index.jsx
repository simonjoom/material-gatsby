import React, { Component } from "react";
import { kebabCase } from "lodash";
import i18next from "../../utils/i18n";
import { Link } from "gatsby";
import "./PostTags.scss";

class PostTags extends Component { 
  render() {
    const lng = i18next.language;
    const { tags } = this.props;
    if (!lng) return null;

    return (
      <div className="post-tag-container">
      <div className="chips">
        {tags &&
          tags.map(tag => (
            <Link
              key={tag}
              style={{ textDecoration: "none" }}
              to={`/tags_${lng}/${kebabCase(tag)}`}
            >
                <div className="chip">
                  {tag}
                </div>
            </Link>
          ))}
          </div>
      </div>
    );
  }
}

export default PostTags;
