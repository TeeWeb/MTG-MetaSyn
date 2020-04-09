import React from "react";
import SearchParams from "./SearchParams";

import "./GUI.css";

const GUI = ({ handleUpdateCards }) => {
  return (
    <div className="gui">
      <h1>MTG Visualizer</h1>
      <SearchParams requestCards={handleUpdateCards()} />
    </div>
  );
};

export default GUI;
