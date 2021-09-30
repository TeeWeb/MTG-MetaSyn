import React, { useState, useEffect } from "react";
import axios from "axios"

import Card from "./Card";
import { getSynergisticCards, calcAvgPos, convertColorIdsToPosArrays, convertCmcToYValue } from "./Utils";

const Plane = ({ cards, handleUpdateOverlayData }) => {
  const [allCards, setAllCards] = useState(cards);
  const [selectedCard, setSelectedCard] = useState();
  // TODO: Use cardCoordsWithSynergy to relocate orbs based on positions of synergistic cards
  // const [cardCoordsWithSynergy, setCardCoordsWithSynergy] = useState();

  // API includes many duplicate cards that don't have multiverse IDs 
  // 1. "Trim" the array of cards so we can ensure use of only cards w/ multiverse IDs
  // and calculate origin positions of cards
  // 2. Tally card coord counts to use for adjusting orb positions and prevent stacking/overlapping
  // 3. Adjust card orb coordinates, as needed, in 3D space around initial origin coord
  const processCards = (cardArray) => {
    const trimmedCards = trimDuplicateCards(cardArray)
    const talliedCoords = coordCounts(trimmedCards)
    const cardIdsToUpdate = getCoordAdjustments(talliedCoords)
    if (cardIdsToUpdate) {
      const updatedCardsArray = trimmedCards
      updatedCardsArray.forEach(card => {
        if (cardIdsToUpdate[card.multiverseid]) {
          card.coords[0] += parseFloat(cardIdsToUpdate[card.multiverseid][0])
          card.coords[1] += parseFloat(cardIdsToUpdate[card.multiverseid][1])
        }
      })
      return updatedCardsArray
    } else {
      return trimmedCards
    }
  }

  const trimDuplicateCards = (cardArray) => {
    let trimmedCards = []
    cardArray.forEach(rawCard => {
      if (rawCard.multiverseid) {
        let initialCoords = calcCardOrigin(rawCard.colorIdentity, rawCard.cmc)
        rawCard.coords = initialCoords
        trimmedCards.push(rawCard)
      }
    });   
    return trimmedCards 
  }

  // Uses card's color identity to find correct origin
  // X & Y coords based on color (see color origin coords in /Utils file)
  // Z (height) coord based on converted mana cost
  const calcCardOrigin = (colorIdentity, cmc) => {
    const initialCoordsArray = convertColorIdsToPosArrays(colorIdentity);
    const averagedCoords = calcAvgPos(initialCoordsArray);
    const calculatedPosition = [
      averagedCoords[0],
      averagedCoords[1],
      convertCmcToYValue(cmc),
    ];
    return calculatedPosition
  }

  // Tallies through each set of card coordinates to determine count of coords that share the same origin.
  // Used to calculate adjusted coords/position to prevent card orbs from stacking on top of each other
  const coordCounts = (cardArray) => {
    let coordVariations = []
    cardArray.forEach(card => {
      if (coordVariations[0] == undefined) {
        coordVariations.push({ coord: card.coords, count: 1, multiverseIds: [card.multiverseid] })
      } else {
        // Not the first set of coords
        let currentNumVariations = coordVariations.length
        let dupeFound = false
        for (let i = 0; i < currentNumVariations; i++) {
          if (JSON.stringify(coordVariations[i].coord) == JSON.stringify(card.coords)) {
            coordVariations[i].count += 1
            coordVariations[i].multiverseIds.push(card.multiverseid)
            dupeFound = true
            break
          } 
        }
        // Add new variation to coordVariations if no other card found in same position
        if (dupeFound === false) {
          coordVariations.push({ coord: card.coords, count: 1, multiverseIds: [card.multiverseid] })
        }
      }
    })    
    return coordVariations 
  }

  // Uses coord counts to determine how to spread out card orbs w/ similar origin coords
  // Adjusts coordinates to position orbs around shared origin point
  // to prevent stacking/overlapping
  const getCoordAdjustments = (talliedCoords) => {
    let cardIdsToUpdate = {}
    for (let i = 0; i < talliedCoords.length; i++) {
      if (talliedCoords[i].count > 1) {
        let angle = (Math.PI * (360 / (talliedCoords[i].count - 1))) / 180
        // TODO: Check if there are more orbs than will fit on one axis around origin
        // ... if so, setup additional orbs around vertical axis
        talliedCoords[i].multiverseIds.forEach((id, idIndex) => {
          let newX = parseFloat(3 * (Math.cos(angle * idIndex))).toFixed(2)
          let newY = parseFloat(3 * (Math.sin(angle * idIndex))).toFixed(2)
          if (idIndex > 0) {
            cardIdsToUpdate[id] = [newX, newY]
          }
        })
      }
    }
    return cardIdsToUpdate
  }

  const selectCard = (
    isActive,
    cardKey,
    name,
    cmc,
    colorId,
    supertypes,
    types,
    subtypes,
    text,
    imageUrl,
    multiverseId,
    coords,
  ) => {
    if (isActive) {
      setSelectedCard();
    } else {
      let synergizedCards = []
      allCards.forEach((card) => {
        // Remove cards that are missing multiverse IDs (usually duplicates anyways)
        if (card.multiverseid !== undefined) {
          if (card.multiverseid === multiverseId) {
            setSelectedCard(card)
            handleUpdateOverlayData(cardKey, coords)
          } else {
            synergizedCards.push({
              id: card.multiverseid,
              colors: card.colors,
              manaCost: card.manaCost,
              cmc: card.cmc,
              name: card.name,
              legalities: card.legalities,
              text: card.text,
              type: card.type,
              subtypes: card.subtypes,
              set: card.set,
              power: card.power,
              toughness: card.toughness
            })
          }
        }
      });
      axios.post('http://localhost:5000/api/synergize?card=' + multiverseId, {otherCards: synergizedCards}).then(response => {
        response.data
      }, error => {
        console.log(error)
      })
    }
  };

  const displayHoveredCard = (id) => {
    handleUpdateOverlayData(id)
  }

  const displaySelectedCard = (id) => {
    if (selectedCard !== undefined) {
      handleUpdateOverlayData(selectedCard.id)
    } else {
      handleUpdateOverlayData(id)
    }
  }

  useEffect(() => {
    const processedCards = processCards(cards)
    if (selectedCard === undefined) {
      setAllCards(processedCards);
    } else {
      let filteredCards = getSynergisticCards(
        selectedCard.id,
        selectedCard.colorIdentity,
        selectedCard.supertypes,
        selectedCard.types,
        selectedCard.subtypes,
        selectedCard.text,
        processedCards
      );
      filteredCards.push(selectedCard);
    }
  }, [cards, selectedCard, handleUpdateOverlayData]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
      <meshStandardMaterial
        attach="material"
        color={"black"}
        transparent
        opacity={0.5}
      />
      {allCards.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          coords={card.coords}
          colors={card.colors}
          cmc={card.cmc}
          name={card.name}
          colorIdentity={card.colorIdentity}
          manaCost={card.manaCost}
          power={card.power}
          toughness={card.toughness}
          imageUrl={card.imageUrl}
          handleSelectCard={selectCard}
          handleHoverCard={displayHoveredCard}
          handleHoverOff={displaySelectedCard}
          supertypes={card.supertypes}
          types={card.types}
          subtypes={card.subtypes}
          text={card.text}
          multiverseId={card.multiverseid}
        />
      ))}
    </mesh>
  );
};

export default Plane;
