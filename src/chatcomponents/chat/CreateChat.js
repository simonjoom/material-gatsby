import React from "react";
import gql from "graphql-tag"; 
import Button from "../../reactLIB/Button";
import Input from "../../reactLIB/Input";
import { graphql, compose } from "react-apollo";
import { withApollo } from "react-apollo";

class CreateChat extends React.Component {
  state = {
    message: ""
  };

  render() {
    return (
      <div style={{ backgroundColor: "#F9FAFD", height: '80px' }} className="md-cell md-cell--12"> 
          <form onSubmit={this.handleChat}>
            <div className="md-grid">
              <Input 
                id="message"
                label="message"
                autoComplete="off"
                onChange={e => this.setState({ message: e.target.value })}
                value={this.state.message}
                style={{ width: "80%" }}
                s={12}
                inline
                buttonIcon={
                  <Button
                    onClick={this.handleNext}
                    disabled={!this.state.message}
                    type="submit"
                    style={{ marginLeft: "10px" }}
                  >
                    Send
                  </Button>
                }
              />
            </div>
          </form> 
      </div>
    );
  }

  handleChat = async e => {
    e.preventDefault();
    const { message } = this.state;
    await this.props.createChatMutation({
      variables: { message }
    });
    this.setState({ message: "" });
  };
}

const CREATE_DRAFT_MUTATION = gql`
  mutation CreateChatMutation($message: String!) {
    createChat(data: { message: $message }) {
      id
      message
    }
  }
`;

export default compose(
  graphql(CREATE_DRAFT_MUTATION, { name: "createChatMutation" }),
  withApollo
)(CreateChat);
