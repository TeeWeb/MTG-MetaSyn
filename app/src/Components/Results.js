import React from "react";
import Card from "./Card";

const Results = ({ cards }) => {
  return (
    <div className="search">
      {cards.length === 0 ? (
        <h1>No Cards Found</h1>
      ) : (
        cards.map((card) => (
          <Card
            id={card.number}
            key={card.number}
            type={card.types}
            colors={card.colors}
            cmc={card.cmc}
            manaCost={card.manaCost}
            imageUrl={card.imageUrl}
          />
        ))
      )}
    </div>
  );
};

export default Results;
