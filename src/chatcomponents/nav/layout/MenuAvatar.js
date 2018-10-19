import React, { Component } from "react";
import { AUTH_TOKEN } from "../../../constants/constants";
import Dropdown from "../../../reactLIB/Dropdown";
import NavItem from "../../../reactLIB/NavItem";
import Logo from "../../../components/logo";

class MenuAvatar extends Component {
  render() {
    const tt="/user/" + this.props.user.id;
    return (
      <Dropdown trigger={<Logo width={23} height={23} />}>
        <NavItem
          key="Profile"
          href={tt}
        >
          Profile
        </NavItem>
        <NavItem
          key="Logout"
          href="/login"
          onClick={() => localStorage.removeItem(AUTH_TOKEN)}
        >
          Logout
        </NavItem>
      </Dropdown>
    );
  }
}

export default MenuAvatar;
