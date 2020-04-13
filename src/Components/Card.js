import React, { useState, useRef, useEffect } from "react";
import { useSpring, a } from "react-spring/three";
import { useFrame } from "react-three-fiber";

import "./Card.css";

// Converts colorIdentitly into a posArray(s).
// The array(s) contain X and Z coordinates to be used in determining the cards position,
// based on the card's color origin(s)
const convertColorIdsToPosArrays = (colorIdArray) => {
  const origins = {
    colorless: [0, 0, 0],
    white: [0, 100, 0],
    blue: [95, 31, 0],
    black: [-59, -81, 0],
    red: [59, -81, 0],
    green: [-95, 31, 0],
  };
  let posArrays = [];

  if (colorIdArray === "colorless") {
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

const convertCmcToYValue = (cmcData) => {
  let zValue = (cmcData + 0.1) * 10;
  return zValue;
};

const normalizeColors = (prevColors) => {
  let normalizedColors = [];
  if (prevColors === "silver") {
    return prevColors;
  } else {
    prevColors.map((color) => {
      normalizedColors.push(color.toLowerCase());
    });
  }
  return normalizedColors;
};

const calcAvgPos = (coordArrays) => {
  let avgCoords;
  // If card is not multicolored, use the color origin.
  //Otherwise, calculate the middle point by averaging the coords of it's color origins
  if (coordArrays.length === 1) {
    avgCoords = coordArrays[0];
  } else {
    let xValues = [];
    let yValues = [];
    coordArrays.forEach((coordArray) => xValues.push(coordArray[0]));
    coordArrays.forEach((coordArray) => yValues.push(coordArray[1]));
    xValues = xValues.sort();
    yValues = yValues.sort();

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

const Card = ({
  name,
  id,
  coords,
  colors,
  colorIdentity,
  cmc,
  manaCost,
  power,
  toughness,
  imageUrl,
  handleSelectCard,
}) => {
  // Check if card is colorless (empty colorArray)
  if (colorIdentity.length === 0) {
    // Set colorless
    colorIdentity = "colorless";
    colors = "silver";
  }

  const initialCoordsArray = convertColorIdsToPosArrays(colorIdentity);
  const averagedCoords = calcAvgPos(initialCoordsArray);
  const calculatedPosition = [
    averagedCoords[0],
    averagedCoords[1],
    convertCmcToYValue(cmc),
  ];

  const meshRef = useRef();
  const baseScale = [1, 1, 1];
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  // const [isColorless, setColorless] = useState(false);

  const props = useSpring({
    scale:
      active || hovered
        ? [baseScale[0] * 3, baseScale[1] * 3, baseScale[2] * 3]
        : baseScale,
    position: calculatedPosition,
    colors: normalizeColors(colors),
    opacity: active || hovered ? 1.0 : 0.6,
  });

  useFrame(() => {
    meshRef.current.rotation.x += 0.01;
  });

  useEffect(() => {}, [active]);

  const handleOnClick = () => {
    setActive(!active);
    handleSelectCard(active, id, name, imageUrl, calculatedPosition);

    console.log(
      name,
      active,
      colorIdentity,
      "CMC: " + cmc,
      normalizeColors(colors),
      "3D position: " + props.position.payload.map((coord) => `${coord.value}`),
      imageUrl
    );
  };

  return (
    <a.mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => handleOnClick()}
      scale={props.scale}
      position={props.position}
      castShadow
    >
      <sphereBufferGeometry attach="geometry" args={[1]} />
      <a.meshPhysicalMaterial
        attach="material"
        color={props.colors}
        clearcloat={0.5}
        transparent={true}
        opacity={props.opacity}
      />
    </a.mesh>
  );
};

export default Card;
