import React from "react";
import PostPreview from "../PostPreview";

class PostListing extends React.Component {
  state = {
    arr: []
  };
  constructor(props) {
    super(props);
    this.arr = [];
    this.postList = [];
    this.props.postEdges.forEach(postEdge => {
      const carouselList = postEdge.node.frontmatter.cover
        ? [postEdge.node.frontmatter.cover]
        : [];
        this.postList.push({
        path: postEdge.node.fields.slug,
        tags: postEdge.node.frontmatter.tags,
        type: postEdge.node.fields.type,
        carouselList,
        title: postEdge.node.frontmatter.title,
        date: postEdge.node.fields.date,
        excerpt: postEdge.node.excerpt,
        timeToRead: postEdge.node.timeToRead
      });
    }); 
  };

  componentDidMount() {
    const size = this.props.size || "12"; 
    const arr = [];
    this.postList.forEach((el, index) => {
      console.log(index);
      setTimeout(() => {
        arr.push(
          <PostPreview
            key={el.title} 
            postInfo={el}
            size={size}
          />
        );
        this.setState({ arr });
      }, index*280);
    });
  }
  render() {
    const sizebig = this.props.sizebig || "8";
    return (
      <div className="md-grid md-grid--no-spacing md-cell--middle">
        <div className={`md-grid md-cell--${sizebig} mobile-fix`}>
          {this.state.arr}
        </div>
      </div>
    );
  }
}

export default PostListing;
