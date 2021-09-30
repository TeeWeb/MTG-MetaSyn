import React from "react";
import "./Overlay.css";

const Overlay = ({ name, imageUrl }) => {
  return (
    <div className="overlay-container">
      <img src={imageUrl} alt={name} />
    </div>
  );
};

export default Overlay;
