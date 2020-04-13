import React, { useRef, useState, useEffect } from "react";
import { useThree, useFrame, extend } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls });

const Controls = ({ selectedCard }) => {
  const checkDefaultPos = (selectedCard) => {
    if (!selectedCard) {
      console.log("Setting to origin");
      return [0, 0, 0];
    } else {
      return selectedCard;
    }
  };
  const { camera, gl } = useThree();
  const orbitRef = useRef();
  camera.position.set(0, 100, 125);
  camera.aspect = window.innerWidth / window.innerHeight;
  const [cardInFocus, setCardInFocus] = useState(selectedCard);

  console.log("Selected Card Position: ", selectedCard);
  // console.log("cardInFocus Position: ", cardInFocus);

  useEffect(() => {
    setCardInFocus(checkDefaultPos(selectedCard));
    camera.lookAt(selectedCard[0], selectedCard[1], selectedCard[2]);
  }, [selectedCard]);

  useFrame(() => {
    orbitRef.current.update();
  });

  return (
    <orbitControls
      args={[camera, gl.domElement]}
      ref={orbitRef}
      maxPolarAngle={Math.PI / 2.01}
      enableKeys={true}
      enablePanning={true}
      keys={{ LEFT: 65, UP: 87, RIGHT: 68, BOTTOM: 83 }}
    />
  );
};

export default Controls;
