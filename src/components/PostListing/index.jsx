import React from "react";
import PostPreview from "../PostPreview"; 
var canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

class PostListing extends React.Component {
  state = {
    arr: []
  };
  constructor(props) {
    super(props);
    this.arrSSR = [];
    this.postList = [];
    this.props.postEdges.forEach(postEdge => {
      const carouselList = postEdge.node.frontmatter.cover
        ? [postEdge.node.frontmatter.cover]
        : [];
      this.postList.push({
        html: postEdge.node.html,
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
  }

  componentWillMount() {
    const size = this.props.size || "12";
    this.arrSSR = []; 
    this.postList.forEach((el, index) => {
      this.arrSSR.push(
        <PostPreview key={el.title} postInfo={el} size={size} />
      );
    }); 
    this.running = true;
    this.runAnim();
  }
  runAnim() {
      setTimeout(() => {
        this.setState({ arr: [...this.state.arr, this.arrSSR.shift()] });
      }, 780);
  }
 
  componentDidUpdate(nextprops) { 
    if (this.running && this.arrSSR.length > 0)
      setTimeout(() => {
        this.setState({ arr: [...this.state.arr, this.arrSSR.shift()] });
      }, 780);
  }
  componentWillUnmount() {
    this.running = false;
  }

  render() {
    const size = this.props.size || "12";
    const sizebig = this.props.sizebig || "8";
    return (
      <div className="md-grid md-grid--no-spacing md-cell--middle">
        <div className={`md-grid md-cell--${sizebig} mobile-fix`}>
          {canUseDOM ? this.state.arr : this.arrSSR}
        </div>
      </div>
    );
  }
}

export default PostListing;
