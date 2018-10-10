import React from "react";

export default () => {
  return (
    <img
      src="data:image/png;base64,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"
      width="50"
      height="50"
      alt="ski leçons courchevel"
    />
  );
};