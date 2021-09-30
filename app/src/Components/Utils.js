const origins = {
  colorless: [0, 0, 0],
  white: [0, 100, 0],
  blue: [95, 31, 0],
  black: [-59, -81, 0],
  red: [59, -81, 0],
  green: [-95, 31, 0],
};

const isColorless = (colorIdentity) => {
  if (colorIdentity.length === 0) {
    return true;
  } else {
    return false;
  }
};

// Converts colorIdentity into a positionArray(s).
// The array(s) contain X and Z coordinates to be used in determining the cards position,
// based on the card's color origin(s)
export const convertColorIdsToPosArrays = (colorIdArray) => {
  let posArrays = [];

  if (isColorless(colorIdArray)) {
    posArrays.push(origins.colorless);
  } else {
    colorIdArray.forEach((color) => {
      switch (color) {
        case "W":
          posArrays.push(origins.white);
          break;
        case "U":
          posArrays.push(origins.blue);
          break;
        case "B":
          posArrays.push(origins.black);
          break;
        case "R":
          posArrays.push(origins.red);
          break;
        case "G":
          posArrays.push(origins.green);
          break;
      }
    });
  }

  return posArrays;
};

export const convertCmcToYValue = (cmcData) => {
  let zValue = (cmcData + 0.1) * 10;
  return zValue;
};

// Returns color strings in ThreeJS-usable format for displaying object colors
export const normalizeColors = (colorIdentity) => {
  let normalizedColors;

  if (isColorless(colorIdentity)) {
    normalizedColors = "gray";
  } else {
    colorIdentity.forEach((color) => {
      switch (color) {
        case "W":
          normalizedColors = "white";
          break;
        case "U":
          normalizedColors = "blue";
          break;
        case "B":
          normalizedColors = "black";
          break;
        case "R":
          normalizedColors = "red";
          break;
        case "G":
          normalizedColors = "green";
          break;
      }
    });
  }
  return normalizedColors;
};

const extractXYValues = (coordArrays) => {
  let xValues = [];
  let yValues = [];

  if (typeof coordArrays[0][0] == "number") {
    coordArrays.forEach((array) => {
      xValues.push(array[0]);
      yValues.push(array[1]);
    })
  } else if (typeof coordArrays[0][0][0] == "number") {
    coordArrays.forEach((coordArray) => {
      coordArray.forEach((array) => {
        xValues.push(array[0]);
        yValues.push(array[1]);
      });
    });
  } else {
    console.log("Too many nested arrays... Double-check the coordArrays passed to extractXYValues()")
  }

  const xyValues = {};
  xyValues.xValues = xValues;
  xyValues.yValues = yValues;
  return xyValues;
};

export const calcAvgPos = (coordArrays) => {
  let avgCoords;
  // Calculate the middle point by averaging the coords of it's color origins and synergy coords
  if (coordArrays.length === 1) {
    avgCoords = coordArrays[0];
  } else {
    const xyValues = extractXYValues(coordArrays);
    const xValues = xyValues.xValues.sort();
    const yValues = xyValues.yValues.sort();

    const sumValues = (array) => {
      let sum = 0;
      array.forEach((value) => (sum = sum + value));
      return sum;
    };
    avgCoords = [
      sumValues(xValues) / xValues.length,
      sumValues(yValues) / yValues.length,
    ];
  }
  return avgCoords;
};

// May move this logic to server-side...
export const getSynergisticCards = (
  selectedCardKey,
  colorId,
  supertypes,
  types,
  subtypes,
  text,
  cards
) => {
  // Skip if no card is selected
  if (selectedCardKey === undefined) {
    return;
  } else {
    // Get an array of all visible cards without the currently selected card
    let otherCards = cards.filter((card) => card.id != selectedCardKey);
    // Reset any previous synergy calculations
    otherCards.forEach((card) => (card.synergy = 0));

    const calcColorSynergies = (colorId, otherCards) => {
      // Check for "synergy" in colors of the cards (colorless synergizes with all any color)
      let colorString;
      if (colorId.length === 0) {
        // Main card is colorless and has color-synergy with all other cards
        otherCards.forEach((card, i, array) => {
          array[i].synergy = 0;
        });
      } else {
        for (let i = 0; i < colorId.length; i++) {
          otherCards.forEach((card, j, array) => {
            colorString = card.colorIdentity.join("");
            if (!array[j].synergy) {
              array[j].synergy = 0;
            }
            if (colorString.length === 0) {
              // Compared card is colorless
              array[j].synergy += 0;
            } else if (colorString.includes(colorId[i])) {
              // Cards share a color
              array[j].synergy += 1;
            } else {
              // Cards don't share any colors
              array[j].synergy += -1;
            }
          });
        }
      }
      return otherCards;
    };

    // Combines all aspects of synergy into one value
    const calcuateSynergy = () => {
      let cardsWithSynergyValues = calcColorSynergies(colorId, otherCards);
      const filteredCards = cardsWithSynergyValues.filter(
        (card) => card.synergy >= 0
      );
      return filteredCards;
    };

    const synergisticCards = calcuateSynergy();

    return synergisticCards;
  }
};

export const getSynergisticCardCoords = (
  selectedCardKey,
  colorId,
  supertypes,
  types,
  subtypes,
  text,
  cards
) => {
  let allCoords = [];
  let synergisticCards = getSynergisticCards(
    selectedCardKey,
    colorId,
    supertypes,
    types,
    subtypes,
    text,
    cards
  );

  synergisticCards.forEach((card) => {
    let cardCoords = convertColorIdsToPosArrays(card.colorIdentity);
    allCoords.push(cardCoords);
  });

  return allCoords;
};
