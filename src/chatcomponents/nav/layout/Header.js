import React from "react";
import TopHello from "./TopHello";
import { navigate } from "gatsby";
import Button from "../../../reactLIB/Button";
import BackButton from "./BackButton";

const Header = ({ location, me, startChat }) => {
  return (
    <div className="flexGrow" style={{paddingLeft:'1.5em'}}>
      <header className="headerchat md-grid md-grid--no-spacing">
        <div className="md-cell md-cell--2-tablet md-cell-4">
          <BackButton location={location} />
        </div>
        <div className="md-cell md-cell--2-tablet md-cell-4">
          <Button
            onClick={() => {
              navigate("/");
            }}
            type="material"
            flat
            icon="home"
          />
        </div>
        <div className="md-cell md-cell-4">
          <TopHello me={me} />
        </div>
      </header>
      <h4>{startChat}</h4>
    </div>
  );
};

export default Header;
