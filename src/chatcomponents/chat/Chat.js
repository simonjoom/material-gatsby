import React, { Component } from "react";
import Card from "../../reactLIB/Card";
import Button from "../../reactLIB/Button";
import Logo from "../../components/logo";
import { navigate } from "gatsby";
import "../../layouts/chat.scss";

var parse = require("date-fns/parse");
var format = require("date-fns/format");

class Chat extends Component {
  openProfile(author) {
    navigate("/user/" + author.id);
  }
  render() {
    // for testing
    const isadmin = Math.random() > 0.5;
    const extracls = {
      "itc-comment-ctr": true,
      "itc-comment-ctr-admin": isadmin,
      "itc-comment-ctr-user": !isadmin,
      "itc-comment-ctr-admin-avatar": !!this.props.chat.author
    };
    console.log("createdAt", this.props.chat.createdAt);
    return (
      <Card
        horizontal
        extracls={extracls}
        className="itc-cvs-part itc-cvs-part-user"
        contentImage={
          this.props.chat.author && (
            <Button
              floating
              tooltip={this.props.chat.author.name}
              onClick={() => this.openProfile(this.props.chat.author)}
            >
              <Logo width={20} height={20} />
            </Button>
          )
        }
        //  title={<b>{this.props.chat.message}</b>}
      >
        <p>{this.props.chat.message}</p>
        <p style={{ fontSize: "0.8em", color: "grey" }}>
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
