import React from "react";
import Button from "../reactLIB/Button";

const ButtonC = ({ cls, children, flat, ...other }) => {
  const cc = children.filter(a => a !== String.fromCharCode(10));
  return (
    <Button className={cls} flat={flat} {...other}>
      {cc}
    </Button>
  );
};

export default ButtonC;
