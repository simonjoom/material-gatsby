import React from "react";
import PostPreview from "../PostPreview";

class PostListing extends React.Component {
  getPostList() {
    const postList = [];
    this.props.postEdges.forEach(postEdge => {
      postList.push({
        path: postEdge.node.fields.slug,
        tags: postEdge.node.frontmatter.tags,
        cover: postEdge.node.frontmatter.cover,
        title: postEdge.node.frontmatter.title,
        date: postEdge.node.fields.date,
        excerpt: postEdge.node.excerpt,
        timeToRead: postEdge.node.timeToRead
      });
    });
    return postList;
  }
  render() {
    const size=this.props.size||"12"
    const sizebig=this.props.sizebig||"8"
    const postList = this.getPostList();
    return (
      <div className="md-grid md-grid--no-spacing md-cell--middle">
        <div className={`md-grid md-cell--${sizebig} mobile-fix`}>
          {postList.map(post => (
            <PostPreview key={post.title} postInfo={post} size={size} />
          ))}
        </div>
      </div>
    );
  }
}

export default PostListing;
