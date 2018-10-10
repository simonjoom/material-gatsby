import React, { Component } from "react"; 
import Card from "../../reactLIB/Card";
import Button from "../../reactLIB/Button";
import { navigate } from "gatsby";

var parse = require("date-fns/parse");
var format = require("date-fns/format");

class Chat extends Component {
  openProfile(author) {
    navigate("/z/user/" + author.id);
  }
  render() {
    console.log("createdAt", this.props.chat.createdAt);
    return (
      <Card
        horizontal
        style={cardStyle}
        contentImage={
          this.props.chat.author && (
            <Button
              floating
              tooltip={this.props.chat.author.name}
              onClick={() => this.openProfile(this.props.chat.author)}
            >
              <img
                src="/assets/starter-logo-1024.png"
                width="40px"
                height="40px"
              />
            </Button>
          )
        }
      //  title={<b>{this.props.chat.message}</b>}
        children={format(parse(this.props.chat.createdAt), "MM/DD/YYYY hh:mma")}
      >
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <p style={{fontSize: '1.2em', textAlign: 'left'}}>{this.props.chat.message}</p>
        <p style={{fontSize:'0.8em', color: 'grey'}}>{format(parse(this.props.chat.createdAt), "MM/DD/YYYY hh:mma")}</p>
      </div>
      
      </Card>
    );
  }
}
const cardStyle = { 
  margin: 30,
  backgroundColor: '#F9FAFD',
  borderRadius: "10px",
  height: 'auto',
  minHeight: '70px'

};

export default Chat;

/*
<ImageTemplate format={'avatar'} nameFile={this.props.chat.author.nameFile}/> */
