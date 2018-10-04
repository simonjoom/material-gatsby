import React from "react"; 
import "font-awesome/scss/font-awesome.scss";
import "./index.scss";
import "./global.scss";
import "./toolbar.scss";
<<<<<<< HEAD
import "./carousel.scss";
import Chat from "../components/Chat/Chat"
//import Paper from "react-md/lib/Papers/Paper";
=======
import "./carousel.scss"; 
>>>>>>> 8d315dab10218e76f03e303c536abfe94d94aeec
import Navigation from "../components/Navigation";
import config from "../../data/SiteConfig"; 


export default class MainNavLayout extends React.Component {
  render() {  
    const {
      children, 
      lng, 
      location
    } = this.props;  
    const postNode = children.props.data.markdownRemark;
    return (
        <Navigation postNode={postNode} config={config} LocalTitle={this.props.title}>
          {children}
        <Chat/>
        </Navigation> 
    );
  }
}
