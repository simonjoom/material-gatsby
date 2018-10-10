import React, { Component } from "react"; 
import Button from "../../../reactLIB/Button"; 
import { SideBarContext } from "../../SideBarContext";

class BackButton extends Component {
  render() {
    console.log("BackButton", this.props);
    return ( 
          <div>
            {this.props.location.pathname !== "/" ? (
              <Button onClick={() => window.history.back()} icon="arrow_back" flat
              type="material"/>
            ) : (
              <Button onClick={() => context.toggleDrawer(true)} icon="menu" flat
              type="material"/>
            )}
          </div>
      
    );
  }
}

export default BackButton;
