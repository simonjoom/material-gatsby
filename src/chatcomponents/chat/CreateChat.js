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
      <div className="itc-cvs-footer">
        <div className="itc-composer">
          <form onSubmit={this.handleChat} className="formcompose"> 
              <Input
                id="message"
                label="message"
                autoComplete="off"
                onChange={e => this.setState({ message: e.target.value })}
                value={this.state.message} 
                s={6}
                inline
                buttonIcon={
                  <Button
                    onClick={this.handleNext}
                    disabled={!this.state.message}
                    type="submit"
                  >
                    Send
                  </Button>
                }
              /> 
          </form>

          <div className="itc-composer-buttons">
            <button
              className="itc-composer-gif-button"
              aria-label="Gif picker"
              tabindex="0"
            >
              <svg viewBox="0 0 29 18">
                <g fill-rule="evenodd">
                  <path
                    d="M9 1a8 8 0 1 0 0 16h11a8 8 0 1 0 0-16H9zm0-1h11a9 9 0 0 1 0 18H9A9 9 0 0 1 9 0z"
                    fill-rule="nonzero"
                  />
                  <path d="M6.561 9.337c0-2.277 1.683-3.795 3.773-3.795 1.298 0 2.2.572 2.849 1.375l-.726.451c-.462-.594-1.243-1.012-2.123-1.012-1.606 0-2.827 1.232-2.827 2.981 0 1.738 1.221 2.992 2.827 2.992.88 0 1.606-.429 1.969-.792v-1.496H9.784v-.814h3.432v2.651a3.822 3.822 0 0 1-2.882 1.265c-2.09 0-3.773-1.529-3.773-3.806zM14.701 13V5.663h.913V13h-.913zm2.629 0V5.663h4.807v.814h-3.894v2.365h3.817v.814h-3.817V13h-.913z" />
                </g>
              </svg>
            </button>
            <button
              className="itc-composer-emoji-button"
              aria-label="Emoji picker"
              tabindex="0"
            >
              <svg viewBox="0 0 18 18">
                <path
                  d="M9 0a9 9 0 1 1 0 18A9 9 0 0 1 9 0zm0 1C4.589 1 1 4.589 1 9s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zM5 6.999a1 1 0 1 1 2.002.004A1 1 0 0 1 5 6.999zm5.999 0a1.002 1.002 0 0 1 2.001 0 1 1 0 1 1-2.001 0zM8.959 13.5c-.086 0-.173-.002-.26-.007-2.44-.132-4.024-2.099-4.09-2.182l-.31-.392.781-.62.312.39c.014.017 1.382 1.703 3.37 1.806 1.306.072 2.61-.554 3.882-1.846l.351-.356.712.702-.35.356c-1.407 1.427-2.886 2.15-4.398 2.15z"
                  fill-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
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

/*
      <div style={{ backgroundColor: "#F9FAFD", height: '80px' }} className="right"> */
