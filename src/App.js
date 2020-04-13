import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { Canvas, extend } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import mtg from "mtgsdk";

import Card from "./Components/Card";
import Controls from "./Components/Controls";
import Plane from "./Components/Plane";
import GUI from "./Components/GUI";
import Overlay from "./Components/Overlay";
import { update } from "react-spring/three";

const App = () => {
  extend({ OrbitControls });
  const [cards, setCards] = useState([]);
  const [overlayData, setOverlayData] = useState();
  const [selectedCardPos, setSelectedCardPos] = useState();
  // const [activeColors, setActiveColors] = useState([]);

  const origins = {
    colorless: [0, 0, 0],
    white: [0, 0, 100],
    blue: [95, 0, 31],
    black: [-59, 0, -81],
    red: [59, 0, -81],
    green: [-95, 0, -31],
  };

  async function requestCards(
    activeColors,
    colorOperator,
    cardSet,
    keyword,
    type
  ) {
    console.log(
      "Requesting Cards: ",
      activeColors,
      colorOperator,
      cardSet,
      keyword,
      type
    );
    const filteredCards = [];
    const cardData = await mtg.card
      .where({
        set: cardSet,
        type: type,
        text: keyword || type,
      })
      .then((res) => {
        return res;
      });

    cardData.forEach((card) => {
      if (card.imageUrl) {
        filteredCards.push(card);
      }
    });

    setCards(filteredCards);
  }

  const updateSelectedCard = (cardInfo) => {
    let selectedCard = cardInfo;
    console.log("Updating selected card:", selectedCard);
    if (!selectedCard) {
      setSelectedCardPos([0, 0, 0]);
    } else {
      setSelectedCardPos(selectedCard);
    }

    return selectedCard;
  };

  const updateOverlayData = (cardInfo) => {
    let overlayCard;
    console.log("Updating Overlay Data: ", cardInfo);
    cards.forEach((card) => {
      if (card.id === cardInfo.id) {
        overlayCard = card;
      }
    });
    if (!overlayCard) {
      console.log("Unable to find card ID for Overlay data");
    } else {
      console.log("Found card for overlay:", overlayCard);
      setOverlayData(overlayCard);
    }
    return overlayData;
  };

  // const updateActiveColors = (activeColors) => {
  //   console.log(activeColors);
  //   let cardArray = [];
  //   mtg.card
  //     .all({ colorIdentity: activeColors, set: "ELD" })
  //     .on("data", (card) => {
  //       cardArray.push(card);
  //     });
  //   console.log(cardArray);

  //   setCards(cardArray);
  // };

  useEffect(() => {
    setCards([]);
  }, [setCards]);

  return (
    <div>
      <Canvas
        shadowMap
        onCreated={({ gl }) => {
          gl.shadowMap.type = THREE.PCFShadowMap;
        }}
      >
        <fog attach="fog" args={["gray", 250, 400]} />
        <Controls selectedCard={selectedCardPos} />
        <Plane
          cards={cards}
          origins={origins}
          handleUpdateOverlayData={(overlayData) =>
            updateOverlayData(overlayData)
          }
          handleUpdateSelectedCard={(selectedCard) => {
            updateSelectedCard(selectedCard);
          }}
        />
        <ambientLight intensity={0.75} />
        <spotLight position={[0, 100, 150]} penumbra={0.15} castShadow />
      </Canvas>
      <GUI handleUpdateCards={() => requestCards} />
      <Overlay imageUrl={overlayData} />
    </div>
  );
};

render(React.createElement(App), document.getElementById("root"));
