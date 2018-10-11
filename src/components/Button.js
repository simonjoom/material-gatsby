import React from "react";
import Button from "../reactLIB/Button";

const ButtonC = ({ cls, children,flat, ...other }) => (
  <Button className={cls} flat={flat} {...other}>
    {children}
  </Button>
);

export default ButtonC;
