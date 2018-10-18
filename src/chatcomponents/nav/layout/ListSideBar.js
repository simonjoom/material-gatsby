import React, { Component } from "react";
import cx from "classnames";
import { Link } from "@reach/router";
import Button from "../../../reactLIB/Button";
import { AUTH_TOKEN } from "../../../constants/constants";

class EmulateItem extends Component {
  render() {
    const liClass = {
      marginTop: "1.5em"
    };
    const subHeading = {
      color: "rgba(0, 0, 0, 0.87)",
      fontSize: "1em",
      fontWeight: 400,
      fontFamily: "Roboto, Helvetica, Arial, sans-serif"
    };
    const { icon, to, children, className, onClick, onMouseEnter } = this.props;
    return (
      <li style={liClass}>
        <Button
          to={to}
          node={Link}
          className={cx(className, "link btn-flat")}
          type="mat"
          iconStyle={{
            color: "rgba(0, 0, 0, 0.54)",
            flexShrink: 0,
            marginRight: "16px",
            verticalAlign: "middle"
          }}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          icon={icon}
        >
          <span style={subHeading}>{children}</span>
        </Button>
      </li>
    );
  }
}
class ListSideBar extends Component {
  state = {
    isSideBarOpen: false,
    href: "#"
  };
  /*
  toggleDrawer = (isSideBarOpen) => () => {
    this.setState({isSideBarOpen: isSideBarOpen})
  } 
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({isSideBarOpen: nextProps.isSideBarOpen})
  }
  
        {this.props.isMobile && (
          <MenuItem>
            <ListItemIcon>
              <Icon>arrow_back</Icon>
            </ListItemIcon>
          </MenuItem>
        )}
  */

  onMouseEnter(href) {
    this.setState({
      href: href.replace("O0O", ".").replace("_", "@")
    });
  }

  onClick() {
    window.location.href = `mailto:${this.state.href}`;
  }
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN);
    return (
      <ul>
        <EmulateItem icon="view_quilt" to="/">
          Blog
        </EmulateItem>
        <EmulateItem
          icon="mail"
          to=""
          onClick={() => this.onClick()}
          onMouseEnter={() => this.onMouseEnter("simon_skiscoolO0Ocom")}
        >
          Mail us
        </EmulateItem>

        <EmulateItem icon="chat" to="/chats">
          Chat
        </EmulateItem>
        {authToken && (
          <EmulateItem icon="group" to="/users">
            Users
          </EmulateItem>
        )}

        {!authToken && (
          <EmulateItem icon="account_circle" to="/login">
            Users
          </EmulateItem>
        )}
      </ul>
    );
  }
}

export default ListSideBar;

/*


        {this.props.role &&
          this.props.role !== "CUSTOMER" && (
            <EmulateItem icon="mode_edit" to="/drafts">
              Drafts
            </EmulateItem>
            )
          }
            <EmulateItem icon="cloud_queue" to="/api">
              API
            </EmulateItem>*/
