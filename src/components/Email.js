import React, { PureComponent } from "react";

import Button from "../reactLIB/Button";

class Email extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      href: "#"
    };
  }
  onMouseEnter() {
    this.setState({
      href: this.props.href.replace("O0O", ".").replace("_", "@")
    });
  }

  onClick() {
    window.location.href = `mailto:${this.state.href}`;
  }
  render() {
    const { href, children } = this.props;
    return (
      <Button
        onClick={() => this.onClick()}
        onMouseEnter={() => this.onMouseEnter()}
      >
        {children}
      </Button>
    );
  }
}
export default Email;
