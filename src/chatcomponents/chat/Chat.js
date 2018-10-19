import React, { Component } from "react";
import Card from "../../reactLIB/Card";
import Button from "../../reactLIB/Button";
import Logo from "../../components/logo";
import { navigate } from "gatsby";
import "../../layouts/chat.scss";

var parse = require("date-fns/parse");
var format = require("date-fns/format");

class Chat extends Component {
  state = {
    orderBy: "createdAt_ASC",
    addcss: ""
  };
  componentDidMount(props) {
    this.setState({ addcss: " itc-cvs-part-enter-active" });
  }
  openProfile(author) {
    navigate("/user/" + author.id);
  }
  render() {
    // for testing 
    const { author } = this.props.chat;
    const isadmin = author.role == "ADMIN";

    const extracls = {
      "itc-comment-ctr": true,
      "itc-comment-ctr-admin": isadmin,
      "itc-comment-ctr-user": !isadmin,
      "itc-comment-ctr-admin-avatar": !!author
    }; 
    return (
      <Card
        horizontal
        extracls={extracls}
        className={`itc-cvs-part itc-cvs-part-user itc-cvs-part-enter ${this.state.addcss} chat-card`}
        contentImage={
          author && (
            <Button
              floating
              tooltip={author.name}
              onClick={() => this.openProfile(author)}
            >
              <Logo width={20} height={20}/>
            </Button>
          )
        }
        //  title={<b>{this.props.chat.message}</b>}
      >
        <p>{this.props.chat.message}</p>
        <p style={{ fontSize: "0.8em", color: "#D5D5D5" }}>
          {format(parse(this.props.chat.createdAt), "MM/DD/YYYY hh:mma")}
        </p>
      </Card>
    );
  }
}
export default Chat;
/*
const cardStyle = {
  margin: 30,
  backgroundColor: "#F9FAFD",
  borderRadius: "10px",
  height: "auto",
  minHeight: "70px"
};



<ImageTemplate format={'avatar'} nameFile={this.props.chat.author.nameFile}/> */
