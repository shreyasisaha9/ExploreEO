import React from "react";

import "./Cardd.css";

const Cardd = (props) => {
  return (
    <div className={`card ${props.className}`} style={props.style}>
      {props.children}
    </div>
  );
};

export default Cardd;
