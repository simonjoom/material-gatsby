import React from "react";
import TopHello from "./TopHello";
import { navigate } from "gatsby";
import Button from "../../../reactLIB/Button";
import BackButton from "./BackButton";

const Header = ({ location, me }) => {
  return (
    <header className="sidechath headerchat md-grid md-grid--no-spacing">
      <div className="md-cell--1-phone md-cell--3-tablet md-cell--4">
        <BackButton location={location} />
      </div>
      <div className="md-cell--1-phone md-cell--3-tablet md-cell--4">
        <Button
          onClick={() => {
            console.log("flexGrowclick");
            navigate("/");
          }}
          type="material"
          flat
          icon="home"
        />
      </div>
      <div className="md-cell--1-phone md-cell--2-tablet md-cell--4">
        <TopHello me={me} />
      </div>
    </header>
  );
};

export default Header;
