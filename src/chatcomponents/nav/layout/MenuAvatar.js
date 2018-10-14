import React, { Component } from "react";
import { navigate } from "gatsby";
import { AUTH_TOKEN } from "../../../constants/constants";

import Dropdown from "../../../reactLIB/Dropdown";
import NavItem from "../../../reactLIB/NavItem";
import Logo from "../../../components/logo";

class MenuAvatar extends Component { 

  handleClose = page => {
    // this.setState({ anchorEl: null });
    if (page === "profile") {
      navigate("/user/" + this.props.user.id);
    }
    if (page === "logout") {
      localStorage.removeItem(AUTH_TOKEN);
      navigate(`/login`);
    }
    //  this.setState({ open: false });
  };

  render() {
    console.log("Menuavatar")
    return (
      <Dropdown
        trigger={
          <div className="">
            <Logo width={30} height={30} />
          </div>
        }
      >
        <NavItem key="Profile" onClick={() => this.handleClose("profile")}>
          Profile
        </NavItem>
        <NavItem key="Logout" onClick={() => this.handleClose("logout")}>
          Logout
        </NavItem>
      </Dropdown>
    );
  }
}

export default MenuAvatar;
