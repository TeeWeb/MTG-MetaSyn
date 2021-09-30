import React, { useState, useEffect, Suspense } from "react";
import { render } from "react-dom";
import { Canvas, extend } from "react-three-fiber";
import * as THREE from "three";
import mtg, { card } from "mtgsdk";

import Controls from "./Components/Controls";
import Plane from "./Components/Plane";
import GUI from "./Components/GUI";
import Overlay from "./Components/Overlay";

const App = () => {
  const [cards, setCards] = useState([]);
  const [overlayData, setOverlayData] = useState([]);
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
    console.log("Requesting Cards: ", cardSet, type);
    const filteredCards = [];
    const cardData = await mtg.card
      .where({
        set: cardSet,
        type: type,
      })
      .then((res) => {
        return res;
      });

    cardData.forEach((card) => {
      // TODO: Determine how to handle duplicate cards/alternate artwork
      // Update 10/22/20: Found that many duplicates were missing multiverseIds. Added function to "prune" those from [allCards] state in <Plane /> component.
      if (card.imageUrl) {
        filteredCards.push(card);
      } else {
        // Use back of card for Overlay image if no card image available
        card.imageUrl =
          "https://gamepedia.cursecdn.com/mtgsalvation_gamepedia/f/f8/Magic_card_back.jpg?version=0ddc8d41c3b69c2c3c4bb5d72669ffd7";
        filteredCards.push(card);
      }
    });

    setCards(filteredCards);
  }

  const updateOverlayData = (id) => {
    setOverlayData();
    let overlayCard;
    cards.forEach((card) => {
      if (card.id === id) {
        overlayCard = card;
      }
    });
    if (!overlayCard) {
      console.log("Unable to find card ID for Overlay data");
    } else {
      // console.log("Found card for overlay:", overlayCard);
      setOverlayData(overlayCard.imageUrl);
    }
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
        <Suspense fallback={null}>
          <fog attach="fog" args={["gray", 250, 400]} />
          <Controls />
          <Plane
            cards={cards}
            origins={origins}
            handleUpdateOverlayData={(name, imageUrl) =>
              updateOverlayData(name, imageUrl)
            }
          />
          <ambientLight intensity={0.75} />
          <spotLight position={[0, 100, 150]} penumbra={0.15} castShadow />
        </Suspense>
      </Canvas>
      <GUI handleUpdateCards={() => requestCards} />
      <Overlay imageUrl={overlayData} />
    </div>
  );
};

render(React.createElement(App), document.getElementById("root"));
