import React, { useState, useRef, useEffect } from "react";
import { useSpring, a } from "react-spring/three";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";

import w_mana from "../textures/w.png";
import b_mana from "../textures/b.png";
import r_mana from "../textures/r.png";
import g_mana from "../textures/g.png";
import u_mana from "../textures/u.png";
import c_mana from "../textures/colorless.png";

import { normalizeColors } from "./Utils";
import "./Card.css";

const Card = ({
  name,
  id,
  colors,
  coords,
  colorIdentity,
  cmc,
  manaCost,
  power,
  toughness,
  imageUrl,
  handleSelectCard,
  handleHoverCard,
  handleHoverOff,
  supertypes,
  types,
  subtypes,
  text,
  multiverseId,
}) => {
  const threeJSColors = normalizeColors(colorIdentity);

  const whiteTexture = useLoader(THREE.TextureLoader, w_mana);
  const blackTexture = useLoader(THREE.TextureLoader, b_mana);
  const blueTexture = useLoader(THREE.TextureLoader, u_mana);
  const redTexture = useLoader(THREE.TextureLoader, r_mana);
  const greenTexture = useLoader(THREE.TextureLoader, g_mana);
  const colorlessTexture = useLoader(THREE.TextureLoader, c_mana);

  const meshRef = useRef();
  const baseScale = [1, 1, 1];
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  // const [isColorless, setColorless] = useState(false);

  const getTexture = () => {
    let texture = {};
    switch (threeJSColors) {
      case "white":
        texture = whiteTexture;
        break;
      case "black":
        texture = blackTexture;
        break;
      case "blue":
        texture = blueTexture;
        break;
      case "red":
        texture = redTexture;
        break;
      case "green":
        texture = greenTexture;
        break;
      default:
        texture = colorlessTexture;
        break;
    }
    texture.mapping = THREE.EquirectangularReflectionMapping;
    return texture;
  };

  const props = useSpring({
    scale:
      active || hovered
        ? [baseScale[0] * 3, baseScale[1] * 3, baseScale[2] * 3]
        : baseScale,
    position: coords,
    colors: threeJSColors,
    opacity: active || hovered ? 1.0 : 0.6,
  });

  useFrame(() => {
    meshRef.current.rotation.y += 0.01;
  });

  useEffect(() => {}, [active]);

  const handleOnClick = () => {
    setActive(!active);
    handleSelectCard(
      active,
      id,
      name,
      cmc,
      colorIdentity,
      supertypes,
      types,
      subtypes,
      text,
      imageUrl,
      multiverseId,
      coords
    );

    console.log(
      name,
      active,
      colorIdentity,
      "CMC: " + cmc,
      threeJSColors,
      colors,
      "3D position: " + props.position.payload.map((coord) => `${coord.value}`),
      imageUrl
    );
  };

  const handleOnPointerOver = () => {
    setHovered(true);
    handleHoverCard(id);
  };

  const handleOnPointerOut = () => {
    setHovered(false);
    handleHoverOff(id);
  };

  return (
    <a.mesh
      ref={meshRef}
      onPointerOver={() => handleOnPointerOver()}
      onPointerOut={() => handleOnPointerOut()}
      onClick={() => handleOnClick()}
      scale={props.scale}
      position={props.position}
      castShadow
    >
      <sphereBufferGeometry attach="geometry" args={[1]} />
      <meshBasicMaterial
        attach="material"
        map={getTexture(threeJSColors)}
        transparent={true}
        side={THREE.DoubleSide}
        repeat={2}
      />
    </a.mesh>
  );
};

export default Card;
